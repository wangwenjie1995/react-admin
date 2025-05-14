import { Button } from 'antd';
import { PdfProp, PdfPage, PageStatus } from '../types'
import { GlobalWorkerOptions, getDocument, RenderTask } from 'pdfjs-dist';
//必须加上"?url"不然会报错
//报错原因:PDF.js 5.x 版本对现代打包工具（如 Vite）的支持不完善
//?url 后缀导入,通过 Vite 资源处理获取实际文件路径
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PDFDocumentProxy, RenderParameters } from 'pdfjs-dist/types/src/display/api';
import { addDynamicPageNumber, addDynamicWatermark } from '@/utils/canvas';

const pdfjsWorker = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// 设置 Worker 文件路径
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Pdf(props: PdfProp) {
  const { pdfUrl, width = '100%', height = '500px', showDownload = true, showPrint = true, style = {}, initialPage = 1, showAllPage = true, preloadPages = 2, chunkSize = 3, waterMarkText = '', loadAll = false } = props
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
  // 在组件内添加状态跟踪
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  const [allPagesRendered, setAllPagesRendered] = useState(false);

  const mergedStyle: React.CSSProperties = {
    ...style,
    width: style.width ?? width,
    height: style.height ?? height
  }
  const handlePrint = async () => {
    if (!containerRef.current) return;
    const canvases = Array.from(containerRef.current.querySelectorAll('canvas'));
    if (canvases.length === 0) return;

    // // 异步转换所有 Canvas
    const printHTML = await Promise.all(
      canvases.map(canvas =>
        new Promise<string>(resolve => {
          const img = new Image();
          img.onload = () => resolve(
            `<div style="page-break-inside: avoid;">
              <img src="${img.src}" style="width: 100%; height: auto;">
            </div>`
          );
          img.src = canvas.toDataURL('image/png');
        })
      )
    ).then(htmlParts => htmlParts.join(''));

    // 将canvas内容转换位图片
    // const printHTML = canvases.reduce((prev, cur) => {
    //   const imgDataURL = cur.toDataURL('image/png');
    //   const imgStr = `<img src="${imgDataURL}" style="width: 100%; height: auto;" />`
    //   return prev + imgStr
    // }, '')
    // 创建隐藏的iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const printDocument = iframe.contentWindow?.document;
    if (printDocument) {
      printDocument.open();
      printDocument.write(`
          <html>
            <head>
              <title>内部专用,禁止转载</title>
              <style>
              /* 打印样式 */
              @media print {
                /* 保留基础页边距 */
                @page {
                  size: auto;
                  margin: 0;
                }

                /* 防止图片分页 */
                div {
                  page-break-inside: avoid;
                  margin-bottom: 10mm;
                }
                img {
                  width: 100% !important;
                  height: auto !important;
                  max-width: none !important;
                }
              }
            </style>
            </head>
            <body style="margin: 0;">
              ${printHTML}
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
  };

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
    if (loadAll) {
      processChunk(0, totalPages)
      return
    }
    processChunk(0, chunkSize)

    // 初始化Intersection Observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageNumber = parseInt((entry.target as HTMLElement).dataset.page || '1')
          const start = Math.max(0, pageNumber - preloadPages);
          const end = Math.min(totalPages, pageNumber + preloadPages);
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

    const canvas = document.createElement('canvas');
    canvas.dataset.page = pageNum.toString();

    // 插入到正确位置
    const prevPage = container.querySelector(`[data-page="${pageNum - 1}"]`);
    if (prevPage) {
      container.appendChild(canvas);
    } else {
      container.prepend(canvas);
    }

    // 原有渲染逻辑适配
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const totalPages = pdf.numPages;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.width = '100%';
      const ctx = canvas.getContext('2d')!;
      const renderTask = page.render({
        canvasContext: ctx,
        viewport
      });

      await renderTask.promise;

      addDynamicPageNumber(ctx, pageNum, totalPages)
      addDynamicWatermark(ctx, waterMarkText);
      // 渲染完成后更新状态
      setRenderedPages(prev => {
        const newSet = new Set(prev).add(pageNum);
        if (!allPagesRendered && newSet.size === pdf.numPages) {
          setAllPagesRendered(true);
          props.onAllPagesRendered?.();
        }
        return newSet;
      });
      observerRef.current?.observe(canvas);
    } catch (err) {
      console.error(`Page ${pageNum} render error:`, err);
      canvas.remove();
    }
  }, [pdfDoc?.numPages, props.onAllPagesRendered]);
  // 添加全局状态检查（双重保障）
  useEffect(() => {
    if (pdfDoc && !allPagesRendered && renderedPages.size === pdfDoc.numPages) {
      setAllPagesRendered(true);
      props.onAllPagesRendered?.();
    }
  }, [renderedPages, pdfDoc, allPagesRendered]);
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
        containerRef.current.querySelectorAll(':scope > [data-page]').forEach(el => el.remove());
      }
    };
  }, []);
  return (
    <div style={mergedStyle} className="relative h-full w-full overflow-y-auto">
      <div className="sticky top-1 right-0 flex justify-end items-center mb-1 mr-1">
        {showPrint && allPagesRendered && <Button onClick={handlePrint}>打印</Button>}
      </div>
      <div
        ref={containerRef}
        className="pdf-pages-container"
      >
      </div>
    </div >
  )
}


