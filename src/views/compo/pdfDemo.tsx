import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Col, Radio, RadioChangeEvent, Row, Select, Spin, Upload } from "antd";
import Pdf from "@/components/Pdf/src";
const waterfallDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (

    <div className={'layout-page'}>
      {/* <div className={'layout-tool'}>
        <Row align="middle" gutter={8} style={{ marginTop: 6, marginBottom: 6 }}>

        </Row>
      </div> */}
      <div className={'layout-container'} ref={containerRef}>
        <Pdf initialPage={1} pdfUrl={"/pdfs/pdf2.pdf"} height={"100%"}></Pdf>
      </div>
    </div>
  )
}
export default waterfallDemo
