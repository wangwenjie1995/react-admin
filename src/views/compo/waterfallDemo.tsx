import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Col, Radio, RadioChangeEvent, Row, Spin, Upload } from "antd";
import Waterfall from "@/components/Waterfall";
const waterfallDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const getList = async () => {
    // 模拟异步请求
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        const newItems = Array.from({ length: 20 }).map((_, index) => ({
          key: `${Date.now()}-${index}`, // 唯一的 key
          url: "https://via.placeholder.com/150x200",
          width: 150,
          height: Math.floor(Math.random() * 100) + 100, // 随机高度,
        }));
        resolve(newItems);
      }, 1000);
    });
  };
  return (
    <div className={'layout-page'}>
      <div className={'layout-tool'}>
        <Row align="middle" gutter={8} style={{ marginTop: 6, marginBottom: 6 }}>
          <Col>
            <Button>切换列数</Button>
          </Col>
        </Row>
      </div>
      <div className={'layout-container'} ref={containerRef}>
        <Waterfall getList={getList} columnCount={4} gap={16}></Waterfall>
      </div>
    </div>
  )
}
export default waterfallDemo
