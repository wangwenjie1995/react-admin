import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from './index.module.less'
import { Spin } from "antd";
import { throttle } from "lodash-es";
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
  const itemsRef = useRef<any[]>([])
  const itemPositions = useRef<Position[]>([])
  const [visibleList, setVisibleList] = useState<Position[]>([])
  const [containerHeight, setContainerHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false) //用户视图更新
  const isLoadingRef = useRef(false) //用户视图更新
  // 缓存每列的当前高度
  const columnHeights = useRef<number[]>(Array(columnCount).fill(0));

  const updateContainerHeight = () => {
    const maxHeight = Math.max(...columnHeights.current);
    setContainerHeight(maxHeight);
  };

  const updateVisibleList = () => {
    if (!wrapRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = wrapRef.current;
    //1.元素底部低于屏幕顶部 2.元素顶部高于屏幕底部
    let visibleList = itemPositions.current.filter((item) => {
      return (
        item.y + item.height >= scrollTop - 400 && item.y <= scrollTop + clientHeight + 400
      );
    });
    setVisibleList(visibleList)
  }
  //初始化
  const initData = async () => {
    await loaderMoreItems()
    updateVisibleList()
  }
  useEffect(() => {
    initData()
  }, [])
  useEffect(() => {
    if (!containerRef.current || !wrapRef.current) {
      return
    }
    // 防抖函数
    const handleResize = throttle(() => {
      if (!wrapRef.current) return;
      wrapRef.current.scrollTop = 0;
      // 重置每列的高度
      columnHeights.current = Array(columnCount).fill(0);
      appendPositions(itemsRef.current, true)
      updateVisibleList()
    }, 200);
    // 防抖函数
    const handleScroll = throttle(async () => {
      if (!wrapRef.current || isLoadingRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = wrapRef.current;
      const buffer = 400;//缓冲距离
      //判断是否接近底部
      if (scrollTop + clientHeight >= scrollHeight - buffer) {
        await loaderMoreItems()
      }
      updateVisibleList()
    }, 200);

    wrapRef.current.addEventListener('scroll', handleScroll)
    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    });
    resizeObserver.observe(wrapRef.current);
    return () => {
      if (!wrapRef.current) {
        return
      }
      resizeObserver.disconnect();
      wrapRef.current!.removeEventListener('scroll', handleScroll)
    }
  }, [columnCount, gap])
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
    itemPositions.current = isReset ? newPositions : [...itemPositions.current, ...newPositions];
    // 更新容器高度
    updateContainerHeight();
  }

  return (
    <div ref={wrapRef} className={styles['waterfall-wrapper']}>
      <div ref={containerRef} className={styles['waterfall-container']} style={{ height: containerHeight }}>
        {visibleList.map((item, index) => (
          <div
            key={item.key}
            className={styles['waterfall-item']}
            style={{
              transform: `translate(${item.x}px, ${item.y}px)`,
              width: item.width,
              height: item.height,
            }}>
            <img src={item.url} alt={`${item.key}`} />
          </div>
        ))}
      </div>
      {/* 底部状态 */}
      <div className={styles['waterfall-footer']} style={{ visibility: isLoading ? 'visible' : 'hidden' }}>
        <div>加载中...</div>
      </div>
    </div>
  )
}
export default Waterfall
