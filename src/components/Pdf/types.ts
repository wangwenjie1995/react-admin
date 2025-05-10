export interface PdfProp {
  pdfUrl: string
  initialPage?: number
  width?: string
  height?: string
  style?: React.CSSProperties
  showPrint?: boolean
  showDownload?: boolean
  showAllPage?: boolean
  preloadPages?: number // 预加载前后页数（默认3）
  chunkSize?: number // 分块渲染页数（默认5）
  waterMarkText?: string //水印文字
  loadAll?: boolean
  onAllPagesRendered?: () => void // 新增完成回调
}
export type PageStatus = 'pending' | 'rendering' | 'done'
export interface PdfPage {
  number: number
  status: PageStatus
}
