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
          {/* <div className="flex-1 text-center text-lg">
            IntersectionObserver分页加载
            <Pdf initialPage={1} pdfUrl={"/pdfs/pdf.pdf"} waterMarkText={userInfo!.username} height={"100%"} loadAll={false}></Pdf>
          </div> */}
          <div className="flex-1 text-center text-lg">
            一次性加载所有页面
            <Pdf initialPage={1} pdfUrl={"/pdfs/pdf.pdf"} waterMarkText={userInfo!.username} height={"100%"} loadAll={true}></Pdf>
          </div>
        </div>
      </div>
    </div>
  )
}
export default waterfallDemo
