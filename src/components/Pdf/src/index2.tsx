import { Button } from 'antd';
import { PdfProp, PdfPage, PageStatus } from '../types'
import { GlobalWorkerOptions, getDocument, RenderTask } from 'pdfjs-dist';
//必须加上"?url"不然会报错
//报错原因:PDF.js 5.x 版本对现代打包工具（如 Vite）的支持不完善
//?url 后缀导入,通过 Vite 资源处理获取实际文件路径
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PDFDocumentProxy, RenderParameters } from 'pdfjs-dist/types/src/display/api';

const pdfjsWorker = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// 设置 Worker 文件路径
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Pdf(props: PdfProp) {
  const { pdfUrl, width = '100%', height = '500px', showDownload = true, showPrint = true, style = {}, initialPage = 1, showAllPage = true, preloadPages = 3, chunkSize = 5, } = props
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pages, setPages] = useState<PdfPage[]>([])
  const idleCallbackRef = useRef<number>();
  const observerRef = useRef<IntersectionObserver>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  // 使用 useRef 保存渲染任务和控制器的引用
  const renderTaskRef = useRef<RenderTask | null>(null);
  const pageAbortControllerRef = useRef<AbortController | null>(null); //用来控制pdf page页面渲染的控制器

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
  const renderAllPages = useCallback(async (pdf: PDFDocumentProxy) => {
    const totalPages = pdf.numPages;
    const initialPages = Array.from({ length: totalPages }, (_, i) => {
      return {
        number: i + 1,
        status: 'pending' as PageStatus
      }
    })

    setPages(initialPages)

    //分块渲染-​分块加载机制​
    const processChunk = (start: number, end: number) => {
      for (let i = start; i < end; i++) {
        if (i >= totalPages) break;
        if (initialPages[i].status !== 'pending') continue;

        initialPages[i].status = 'rendering';
        setPages([...initialPages])

        //空闲时渲染
        idleCallbackRef.current = requestIdleCallback(() => {
          renderPage(i + 1, pdf).finally(() => {
            initialPages[i].status = 'done';
            setPages([...initialPages])
          })
        })
      }
    }
    processChunk(0, chunkSize)

    // 初始化Intersection Observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageNumber = parseInt((entry.target as HTMLElement).dataset.pageNumber || '1')

          const start = Math.max(0, pageNumber - preloadPages);
          const end = Math.min(totalPages, pageNumber + preloadPages + 1);
          processChunk(start, end);
        }
      }, { root: containerRef.current, rootMargin: '200px 0' })
    })


  }, [chunkSize, preloadPages])
  // 修改后的渲染方法
  const renderPage = useCallback(async (pageNum: number, pdf: PDFDocumentProxy) => {
    // 创建独立canvas
    const container = containerRef.current;
    if (!container) return;

    const existingCanvas = container.querySelector(`[data-page="${pageNum}"]`);
    if (existingCanvas) return;

    // 创建canvas容器
    const pageContainer = document.createElement('div');
    pageContainer.className = 'pdf-page relative mb-4';
    pageContainer.dataset.pageNumber = pageNum.toString();

    const canvas = document.createElement('canvas');
    canvas.dataset.page = pageNum.toString();
    pageContainer.appendChild(canvas);

    // 插入到正确位置
    const prevPage = container.querySelector(`[data-page="${pageNum - 1}"]`);
    if (prevPage) {
      // prevPage.after(pageContainer);
      // container.insertBefore(pageContainer, slots[insertIndex]);
      container.appendChild(pageContainer);
    } else {
      container.prepend(pageContainer);
    }

    // 原有渲染逻辑适配
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderTask = page.render({
        canvasContext: canvas.getContext('2d')!,
        viewport
      });

      await renderTask.promise;
      observerRef.current?.observe(pageContainer);
    } catch (err) {
      console.error(`Page ${pageNum} render error:`, err);
      pageContainer.remove();
    }
  }, []);
  // const renderPage = useCallback((pageNum: number, pdf = pdfDoc) => {

  //   // 1.取消之前的渲染任务
  //   if (renderTaskRef.current) {
  //     renderTaskRef.current.cancel();
  //     renderTaskRef.current = null;
  //   }
  //   // 当前激活的控制器，防止无效渲染
  //   // 可能是：
  //   // - 前一页渲染未完成时的控制器
  //   // - 其他中断操作的控制器
  //   pageAbortControllerRef.current?.abort();
  //   // 2. 创建新的中止控制器
  //   const pageAbortController = new AbortController();
  //   pageAbortControllerRef.current = pageAbortController;

  //   //获取第一页(索引从 1 开始)
  //   const canvas = canvasRef.current;

  //   if (!canvas || !pdf || pageAbortController.signal.aborted) return;
  //   const context = canvas.getContext('2d')!;
  //   pdf!.getPage(pageNum).then((page) => {
  //     if (pageAbortController.signal.aborted) {
  //       page.cleanup();
  //       return;
  //     }

  //     console.log(`Page ${pageNum} loaded`);
  //     const scale = 1.5;
  //     const viewport = page.getViewport({ scale });

  //     //清除之前的画布内容
  //     context?.clearRect(0, 0, canvas.width, canvas.height);

  //     canvas.height = viewport.height;
  //     canvas.width = viewport.width;
  //     console.log('Canvas尺寸设置', canvas.width, 'x', canvas.height);

  //     // 渲染PDF页面到canvas
  //     const renderContext: RenderParameters = {
  //       canvasContext: context,
  //       viewport: viewport
  //     }
  //     renderTaskRef.current = page.render(renderContext); //这个过程也是异步的,也可以取消
  //     renderTaskRef.current!.promise.then(() => {
  //       if (pageAbortController.signal.aborted) return;
  //       setIsLoading(false);
  //     }).catch((renderError) => {
  //       if (renderError.name === 'RenderingCancelledException') {
  //         console.log('pageAbortController暂停，渲染已取消');
  //         return;
  //       }
  //       setError('pdf页面渲染失败:' + renderError.message);
  //     })
  //   }).catch((error: {
  //     name: string; message: string;
  //   }) => {
  //     if (error.name === 'AbortError') {
  //       console.log('加载已取消');
  //       return;
  //     }
  //     if (!pageAbortControllerRef.current!.signal.aborted) {
  //       setError('PDF加载失败: ' + error.message);
  //       console.error('Error loading PDF:', error);
  //     }
  //   }).finally(() => {
  //     if (!pageAbortControllerRef.current!.signal.aborted) {
  //       setIsLoading(false);
  //     }
  //   })
  // }, [pdfDoc])
  useEffect(() => {
    if (pdfDoc) {
      if (showAllPage) {
        renderAllPages(pdfDoc);
      } else {
        // 单页模式逻辑保持不变
        renderPage(currentPage, pdfDoc);
      }
    }
  }, [pdfDoc, currentPage, renderPage, showAllPage])
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
  useEffect(() => {
    return () => {
      // 取消所有任务
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
      }
      observerRef.current?.disconnect();

      // 清理全页模式DOM
      if (containerRef.current) {
        containerRef.current.querySelectorAll('.pdf-page').forEach(el => el.remove());
      }
    };
  }, []);
  return (
    <div style={mergedStyle} className="relative w-full">
      <div className="flex justify-between items-center mb-1">
        {/* <span className="mx-2">
          第 <span className='text-orange'>{currentPage}</span> 页
        </span>
        <div className='space-x-2'>
          <Button onClick={handlePrevPage} disabled={currentPage <= 1}>上一页</Button>
          <Button onClick={handleNextPage}>下一页</Button>
          {showPrint && <Button onClick={handlePrint}>打印</Button>}
          {showDownload && <Button onClick={handleDownload}>下载</Button>}
        </div> */}

      </div>
      {/* {isLoading && <div>加载中...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>} */}
      <div
        ref={containerRef}
        className="pdf-pages-container overflow-y-auto"
        style={{ height: 'calc(100% - 32px)' }}
      >
        {
          showAllPage ? (
            // 虚拟滚动占位符
            // pages.map(page => (
            <div
              // key={page.number}
              className="pdf-page-placeholder"
              style={{ height: '0', marginBottom: '16px' }} // 根据实际高度调整
            />
            // ))
          ) : (<canvas
            key={pdfUrl}
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
          ></canvas>)
        }
      </div>
    </div >
  )
}
