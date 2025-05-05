export interface PdfProp {
  pdfUrl: string
  initialPage?: number
  width?: number | string
  height?: number | string
  style?: React.CSSProperties
  showPrint?: boolean
  showDownload?: boolean
  showAllPage?: boolean
  preloadPages?: number // 预加载前后页数（默认3）
  chunkSize?: number // 分块渲染页数（默认5）
}
export type PageStatus = 'pending' | 'rendering' | 'done'
export interface PdfPage {
  number: number
  status: PageStatus
}
