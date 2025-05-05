import { useCallback, useEffect, useRef, useState } from "react";

import Pdf from "@/components/Pdf/src/index2";
const waterfallDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (

    <div className={'layout-page'}>
      <div className={'layout-container'} ref={containerRef}>
        <Pdf initialPage={1} pdfUrl={"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"} height={"100%"}></Pdf>
      </div>
    </div>
  )
}
export default waterfallDemo
