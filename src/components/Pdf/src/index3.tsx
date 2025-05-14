import { Button } from 'antd';
import { PdfProp, PdfPage, PageStatus } from '../types'
import { GlobalWorkerOptions, getDocument, RenderTask } from 'pdfjs-dist';
//必须加上"?url"不然会报错
//报错原因:PDF.js 5.x 版本对现代打包工具（如 Vite）的支持不完善
//?url 后缀导入,通过 Vite 资源处理获取实际文件路径
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { addDynamicPageNumber, addDynamicWatermark } from '@/utils/canvas';

const pdfjsWorker = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Pdf(props: PdfProp) {
  const {
    pdfUrl,
    width = '100%',
    height = '500px',
    initialPage = 1,
    showPrint = true,
    style = {},
    preloadPages = 2,
    chunkSize = 3,
    waterMarkText = '',
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const idleCallbackRef = useRef<number>();
  const observerRef = useRef<IntersectionObserver>();
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  const [allPagesRendered, setAllPagesRendered] = useState(false);

  // 合并后的统一加载方法
  const initializePdf = useCallback(async (pdf: PDFDocumentProxy) => {
    const total = pdf.numPages;

    // 初始化页面状态
    setPages(Array.from({ length: total }, (_, i) => ({
      number: i + 1,
      status: 'pending' as PageStatus
    })));

    // 创建预占位canvas
    const container = containerRef.current!;
    container.innerHTML = '';
    Array.from({ length: total }).forEach((_, i) => {
      const canvas = document.createElement('canvas');
      canvas.dataset.page = `${i + 1}`;
      canvas.style.width = '100%';
      canvas.style.visibility = 'hidden'; // 初始隐藏
      container.appendChild(canvas);
    });

    // 初始化分块加载（首屏优化）
    loadChunk(1, Math.min(chunkSize, total));

    // 初始化Observer（滚动加载）
    initIntersectionObserver(pdf);
  }, [chunkSize]);
  const renderPage = useCallback(async (pageNum: number, pdfDoc: PDFDocumentProxy) => {
    try {
      // 防御性检查（多层校验）
      console.log('333333333333')
      if (!pdfDoc || !containerRef.current) {
        console.warn('PDF document not ready or container missing');
        return;
      }
      console.log('2222222222222')
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = containerRef.current!.querySelector(
        `canvas[data-page="${pageNum}"]`
      ) as HTMLCanvasElement;

      // 更新canvas尺寸
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // 执行渲染
      const ctx = canvas.getContext('2d')!;
      const renderTask = page.render({
        canvasContext: ctx,
        viewport
      });
      await renderTask.promise;

      // 添加水印等
      addDynamicPageNumber(ctx, pageNum, pdfDoc!.numPages);
      addDynamicWatermark(ctx, waterMarkText);

      // 更新状态
      setRenderedPages(prev => new Set([...prev, pageNum]));
      canvas.style.visibility = 'visible'; // 渲染完成后显示
    } catch (err) {
      console.error(`Render page ${pageNum} failed`, err);
    }
  }, [pdfDoc, waterMarkText]);

  // 智能分块加载
  const loadChunk = useCallback((start: number, end: number) => {
    requestIdleCallback(() => {
      for (let i = start; i <= end; i++) {
        if (renderedPages.has(i)) continue;

        setPages(prev => prev.map(p =>
          p.number === i ? { ...p, status: 'rendering' } : p
        ));

        renderPage(i, pdfDoc!).finally(() => {
          setPages(prev => prev.map(p =>
            p.number === i ? { ...p, status: 'done' } : p
          ));
        });
      }
    });
  }, [renderedPages, pdfDoc]);
  // 优化的Observer逻辑
  const initIntersectionObserver = useCallback((pdf: PDFDocumentProxy) => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const pageNum = parseInt((entry.target as HTMLElement).dataset.page!);
        const start = Math.max(1, pageNum - preloadPages);
        const end = Math.min(pdf.numPages, pageNum + preloadPages);

        loadChunk(start, end);
      });
    }, {
      root: containerRef.current,
      rootMargin: '200px 0px',
      threshold: 0.1
    });

    // 只观察未渲染的页面
    containerRef.current!.querySelectorAll('canvas').forEach(canvas => {
      if (!renderedPages.has(Number(canvas.dataset.page))) {
        observerRef.current!.observe(canvas);
      }
    });
  }, [preloadPages, renderedPages]);


  // 给每页预生成 canvas 占位，并注册 Observer
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return;
    const total = pdfDoc.numPages;
    const container = containerRef.current;

    // 清空旧节点
    container.innerHTML = '';

    // 创建 IntersectionObserver
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageNum = Number((entry.target as HTMLElement).dataset.page);
          loadAndRender(pageNum);
        }
      });
    }, {
      root: container,
      rootMargin: '200px 0px',
      threshold: 0.1,
    });

    // 预生成占位 canvas
    for (let i = 1; i <= total; i++) {
      const c = document.createElement('canvas');
      c.dataset.page = `${i}`;
      c.style.width = '100%';
      c.style.height = '20';
      c.height = 0;       // 占位高度
      container.appendChild(c);
      observerRef.current.observe(c);
    }
  }, [pdfDoc]);

  // 真正的按需加载并渲染页
  const loadAndRender = useCallback((pageNum: number) => {
    if (!pdfDoc || renderedPages.has(pageNum)) return;

    // 标记状态为 rendering
    setPages(ps => ps.map(p =>
      p.number === pageNum ? { ...p, status: 'rendering' } : p
    ));

    // 空闲时渲染
    idleCallbackRef.current = requestIdleCallback(async () => {
      renderPage(pageNum, pdfDoc).finally(() => {
        // initialPages[pageNum].status = 'done';
        // setPages([...initialPages])
        setPages(ps => ps.map(p =>
          p.number === pageNum ? { ...p, status: 'done' } : p
        ));
      })
    });
  }, [pdfDoc, renderedPages, waterMarkText, props]);
  // 初始化 Range 加载
  useEffect(() => {
    if (!pdfUrl) return;
    let docAbortController = new AbortController();
    const loadingTask = getDocument({
      url: pdfUrl,
      rangeChunkSize: 64 * 1024,  // 每次 64KB
      disableStream: true,        // 关闭自动流式加载
      disableAutoFetch: true,     // 关闭预取
    });

    loadingTask.promise.then(pdf => {
      // 如果组件已经被卸载或取消了加载任务,则直接退出,避免继续执行无意义的操作;
      if (docAbortController.signal.aborted) return;
      setPdfDoc(pdf);
      console.log('PDF loaded');
      // 创建状态页数据
      setPages(Array.from({ length: pdf.numPages }, (_, i) => ({
        number: i + 1,
        status: 'pending' as PageStatus,
      })));
      // initializePdf(pdf);
    }).catch(err => {
      console.error('PDF load error', err);
    });
    console.log('componentWillMount')
    return () => {
      docAbortController.abort();
      if (loadingTask?.destroy && !docAbortController.signal.aborted) {
        loadingTask.destroy();
      }
      if (idleCallbackRef.current) cancelIdleCallback(idleCallbackRef.current);
      observerRef.current?.disconnect();
    };
  }, [pdfUrl]);
  return (
    <div
      ref={containerRef}
      style={{ width, height, overflowY: 'auto', ...style }}
      className="pdf-pages-container"
    >
      {showPrint && allPagesRendered && (
        <div className="sticky top-0 right-0 p-2 bg-white">
          {/* <Button onClick={props.onPrint}>打印</Button> */}
        </div>
      )}
    </div>
  );
}
