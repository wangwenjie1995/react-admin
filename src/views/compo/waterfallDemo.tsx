import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Col, Radio, RadioChangeEvent, Row, Select, Spin, Upload } from "antd";
import Waterfall from "@/components/Waterfall";
const waterfallDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnCount, setColumnCount] = useState<number>(4)
  const getList = async () => {
    // 模拟异步请求
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        const newItems = Array.from({ length: 10000 }).map((_, index) => ({
          key: `${Date.now()}-${index}`, // 唯一的 key
          url: "https://via.placeholder.com/150x200",
          width: 150,
          height: Math.floor(Math.random() * 100) + 100, // 随机高度,
        }));
        resolve(newItems);
      }, 200);
    });
  };
  const handleChange = (e: RadioChangeEvent) => {
    setColumnCount(e.target.value);
  };
  return (
    <div className={'layout-page'}>
      <div className={'layout-tool'}>
        <Row align="middle" gutter={8} style={{ marginTop: 6, marginBottom: 6 }}>
          <Col>
            <Radio.Group value={columnCount} onChange={handleChange}>
              <Radio value={1}>1列</Radio>
              <Radio value={2}>2列</Radio>
              <Radio value={3}>3列</Radio>
              <Radio value={4}>4列</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </div>
      <div className={'layout-container'} ref={containerRef}>
        <Waterfall getList={getList} columnCount={columnCount} gap={16}></Waterfall>
      </div>
    </div>
  )
}
export default waterfallDemo
