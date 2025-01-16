import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import styles from './index.module.less'
import { Spin } from "antd";
import { debounce, throttle } from "lodash-es";
interface WaterfallProps {
  columnCount?: number;
  gap?: number;
  getList: () => Promise<any[]>
}
interface Position {
  key: string;
  url: string,
  width: number,
  height: number,
  x: number,
  y: number,
}
const Waterfall: React.FC<WaterfallProps> = ({ columnCount = 3, gap = 16, getList }: WaterfallProps) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<any[]>([])
  const [itemPositions, setItemPositions] = useState<Position[]>([])
  const [containerHeight, setContainerHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false) //用户视图更新
  const isLoadingRef = useRef(false) //用户视图更新
  // 缓存每列的当前高度
  const columnHeights = useRef<number[]>(Array(columnCount).fill(0));
  const handleScroll = () => {
    if (!wrapRef.current || isLoadingRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = wrapRef.current;
    const buffer = 100;//缓冲距离
    //判断是否接近底部
    if (scrollTop + clientHeight >= scrollHeight - buffer) {
      loaderMoreItems()
    }
  }
  const updateContainerHeight = () => {
    const maxHeight = Math.max(...columnHeights.current);
    setContainerHeight(maxHeight);
  };
  const handleResize = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = 0;
    // 重置每列的高度
    columnHeights.current = Array(columnCount).fill(0);
    appendPositions(itemsRef.current, true)
  }
  //初始化
  useEffect(() => {
    loaderMoreItems()
    if (!containerRef.current || !wrapRef.current) {
      return
    }
    const triggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoadingRef.current) {
          loaderMoreItems();
        }
      });
    }, {
      root: wrapRef.current,
      rootMargin: "100px",
      threshold: 0.1,
    })
    if (triggerRef.current) {
      triggerObserver.observe(triggerRef.current);
    }
    // 防抖函数
    const throttleHandleResize = throttle(() => {
      handleResize();
    }, 200);
    // 防抖函数
    // const throttleHandleScroll = throttle(() => {
    //   handleScroll();
    // }, 200);

    // wrapRef.current.addEventListener('scroll', throttleHandleScroll)
    // window.addEventListener('resize', throttleHandleResize)
    const resizeObserver = new ResizeObserver(() => {
      throttleHandleResize()
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      if (!containerRef.current) {
        return
      }
      if (triggerRef.current) {
        triggerObserver.unobserve(triggerRef.current);
      }
      resizeObserver.disconnect();
      // wrapRef.current!.removeEventListener('scroll', throttleHandleScroll)
      // window.removeEventListener('resize', throttleHandleResize)
    }
  }, [])

  const loaderMoreItems = async () => {
    isLoadingRef.current = true
    setIsLoading(true)
    try {
      const newItems = await getList();
      itemsRef.current = [...itemsRef.current, ...newItems];
      appendPositions(newItems, false);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }
  const appendPositions = (list: any[], isReset: boolean = false) => {
    if (!containerRef.current) return;
    // 容器宽度
    const containerWidth = containerRef.current.clientWidth || containerRef.current.offsetWidth;
    const columnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount; // 每列的宽度

    const newPositions = list.map((item: any, index: number) => {
      const cardHeight = (item.height / item.width) * columnWidth;
      const columnIndex = columnHeights.current.indexOf(Math.min(...columnHeights.current));// 找到最短列

      const x = columnIndex * (gap + columnWidth);
      const y = columnHeights.current[columnIndex];
      columnHeights.current[columnIndex] += cardHeight + gap;//更新列高度
      return {
        width: columnWidth,
        height: cardHeight,
        x,
        y,
        url: item.url,
        text: item.text,
        key: item.key
      };
    })
    setItemPositions((prevPositions) =>
      isReset ? newPositions : [...prevPositions, ...newPositions]);
    // 更新容器高度
    updateContainerHeight();
  }

  return (
    <div ref={wrapRef} className={styles['waterfall-wrapper']}>
      <div ref={containerRef} className={styles['waterfall-container']} style={{ height: containerHeight }}>
        {itemPositions.map((item, index) => (
          <div
            key={index}
            className={styles['waterfall-item']}
            style={{
              transform: `translate(${item.x}px, ${item.y}px)`,
              width: item.width,
              height: item.height,
            }}>
            <img src={item.url} alt={`${index}`} />
          </div>
        ))}
      </div>
      {/* 底部触发器 */}
      <div ref={triggerRef} style={{ height: 1, background: 'transparent' }}></div>
      {/* 底部状态 */}
      <div className={styles['waterfall-footer']} style={{ visibility: isLoading ? 'visible' : 'hidden' }}>
        <div>加载中...</div>
      </div>
    </div>
  )
}
export default Waterfall
