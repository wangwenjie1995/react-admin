import { Button } from 'antd';
import { PdfProp } from '../types'
import { GlobalWorkerOptions, getDocument, RenderTask } from 'pdfjs-dist';
//必须加上"?url"不然会报错
//报错原因:PDF.js 5.x 版本对现代打包工具（如 Vite）的支持不完善
//?url 后缀导入,通过 Vite 资源处理获取实际文件路径
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PDFDocumentProxy, RenderParameters } from 'pdfjs-dist/types/src/display/api';

const pdfjsWorker = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();
// 设置 Worker 文件路径
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Pdf(props: PdfProp) {
  const { pdfUrl, width = '100%', height = '100%', showDownload = true, showPrint = true, style = {}, initialPage = 1, showAllPage = false, preloadPages = 3 } = props
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  // 使用 useRef 保存渲染任务和控制器的引用
  const renderTaskRef = useRef<RenderTask | null>(null);
  const pageAbortControllerRef = useRef<AbortController | null>(null); //用来控制pdf page页面渲染的控制器
  const isLastPage = useMemo(() => {
    if (pdfDoc) {
      return currentPage >= pdfDoc.numPages
    }
    return false
  }, [currentPage])

  const mergedStyle: React.CSSProperties = {
    ...style,
    width: style.width ?? width,
    height: style.height ?? height
  }
  // 上一页
  const handlePrevPage = () => {
    currentPage > 1 && setCurrentPage(currentPage - 1);
  }
  // 下一页
  const handleNextPage = () => {
    pdfDoc && currentPage < pdfDoc.numPages && setCurrentPage(currentPage + 1);
  }

  // 打印PDF页面
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // 创建隐藏的iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // 将canvas内容转换位图片
      const imgData = canvas.toDataURL('image/png');

      const printDocument = iframe.contentWindow?.document;
      if (printDocument) {
        printDocument.open();
        printDocument.write(`
          <html>
            <head>
              <title>Print</title>
            </head>
            <body style="margin: 0;">
              <img src="${imgData}" style="width: 100%; height: auto;" />
            </body>
          </html>
        `);
        printDocument.close();

        // 延迟执行打印以确保内容加载
        setTimeout(() => {
          iframe.contentWindow?.print();
          document.body.removeChild(iframe);
        }, 500);
      }
    }
  }
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // 创建隐藏的iframe
      const imgData = canvas.toDataURL('image/png');
      const fileName = pdfUrl.split('/').pop()?.replace(/\.pdf$/i, '') || 'download';

      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const renderPage = useCallback((pageNum: number, pdf = pdfDoc) => {

    // 1.取消之前的渲染任务
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }
    // 当前激活的控制器，防止无效渲染
    // 可能是：
    // - 前一页渲染未完成时的控制器
    // - 其他中断操作的控制器
    pageAbortControllerRef.current?.abort();
    // 2. 创建新的中止控制器
    const pageAbortController = new AbortController();
    pageAbortControllerRef.current = pageAbortController;

    //获取第一页(索引从 1 开始)
    const canvas = canvasRef.current;

    if (!canvas || !pdf || pageAbortController.signal.aborted) return;
    const context = canvas.getContext('2d')!;
    pdf!.getPage(pageNum).then((page) => {
      if (pageAbortController.signal.aborted) {
        page.cleanup();
        return;
      }

      console.log(`Page ${pageNum} loaded`);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      //清除之前的画布内容
      context?.clearRect(0, 0, canvas.width, canvas.height);

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      // canvas.style.width = width;
      // canvas.style.height = height;
      console.log('Canvas尺寸设置', canvas.width, 'x', canvas.height);

      // 渲染PDF页面到canvas
      const renderContext: RenderParameters = {
        canvasContext: context,
        viewport: viewport
      }
      renderTaskRef.current = page.render(renderContext); //这个过程也是异步的,也可以取消
      renderTaskRef.current!.promise.then(() => {
        if (pageAbortController.signal.aborted) return;
        setIsLoading(false);
      }).catch((renderError) => {
        if (renderError.name === 'RenderingCancelledException') {
          console.log('pageAbortController暂停，渲染已取消');
          return;
        }
        setError('pdf页面渲染失败:' + renderError.message);
      })
    }).catch((error: {
      name: string; message: string;
    }) => {
      if (error.name === 'AbortError') {
        console.log('加载已取消');
        return;
      }
      if (!pageAbortControllerRef.current!.signal.aborted) {
        setError('PDF加载失败: ' + error.message);
        console.error('Error loading PDF:', error);
      }
    }).finally(() => {
      if (!pageAbortControllerRef.current!.signal.aborted) {
        setIsLoading(false);
      }
    })
  }, [pdfDoc])
  useEffect(() => {
    renderPage(currentPage, pdfDoc)
  }, [pdfDoc, currentPage, renderPage])
  useEffect(() => {
    // AbortController是一个浏览器内置的API,用于取消异步操作(如网络请求);
    // 这里,用它来确保在组件或重新加载时,可以中断正在进行的PDF加载任务,避免内存泄漏或不必要的资源消耗;
    let docAbortController = new AbortController();
    if (!pdfUrl) return;
    setIsLoading(true);
    setError(null);

    const loadingTask = getDocument(pdfUrl);
    loadingTask.promise.then((pdfDoc) => {
      // 如果组件已经被卸载或取消了加载任务,则直接退出,避免继续执行无意义的操作;
      if (docAbortController.signal.aborted) return;
      setPdfDoc(pdfDoc)
      console.log('PDF loaded');
    }).catch(error => {
      setIsLoading(false);
      setError('Failed to load PDF: getDocument => promise');
      console.log('PDF load error:', error)
    })

    return () => {
      docAbortController.abort();
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, canvas.width, canvas.height);
      }
      // ✅ 新增：释放 PDF 资源
      if (loadingTask?.destroy && !docAbortController.signal.aborted) {
        loadingTask.destroy();
      }
    }

  }, [pdfUrl])
  return (
    <div style={mergedStyle} className="relative w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="mx-2">
          第 <span className='text-orange'>{currentPage}</span> 页
        </span>
        <div className='space-x-2'>
          <Button onClick={handlePrevPage} disabled={currentPage <= 1}>上一页</Button>
          <Button onClick={handleNextPage} disabled={isLastPage}>下一页</Button>
          {showPrint && <Button onClick={handlePrint}>打印</Button>}
          {showDownload && <Button onClick={handleDownload}>下载</Button>}
        </div>

      </div>
      {isLoading && <div>加载中...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <canvas
        key={pdfUrl}
        ref={canvasRef}
        style={{ height: 'calc(100% - 32px)' }}
      >
      </canvas>
    </div >
  )
}
