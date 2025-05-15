import { useCallback, useEffect, useRef, useState } from "react";

import Pdf from "@/components/Pdf/src/index3";
import useUserStore from "@/stores/userStore";
const waterfallDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const userInfo = useUserStore((state) => state.userInfo);
  return (

    <div className='layout-page'>
      <div className='layout-container' ref={containerRef}>
        <div className="flex h-full space-x-4">
          <Pdf initialPage={1} pdfUrl={"/pdfs/pdf.pdf"} waterMarkText={userInfo!.username} height={"100%"} loadAll={true}></Pdf>
        </div>
      </div>
    </div>
  )
}
export default waterfallDemo
