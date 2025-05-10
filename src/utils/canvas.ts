interface LineData {
  startX: number
  startY: number
  endX: number
  endY: number
}
interface EllipseData {
  startX: number
  startY: number
  endX: number
  endY: number
}
export const drawLine = (ctx: CanvasRenderingContext2D, lineData: LineData) => {
  const { startX, startY, endX, endY } = lineData
  ctx.beginPath()
  ctx.moveTo(startX, startY)

  //直线用lineTo比较好
  ctx.lineTo(endX, endY)
  // 曲线使用二次贝塞尔曲线绘制比较好,可以跟平滑点
  // 计算控制点，这里可以使用上一个位置和当前鼠标位置的中点作为控制点
  // const controlX = (lastX + x) / 2
  // const controlY = (lastY + y) / 2
  // ctx!.quadraticCurveTo(controlX, controlY, x, y)
  ctx.stroke()
}
// 计算椭圆或圆形的相关数据
const calculateEllipseData = (startX: number, startY: number, endX: number, endY: number) => {
  const centerX = (startX + endX) / 2
  const centerY = (startY + endY) / 2
  const width = Math.abs(endX - startX)
  const height = Math.abs(endY - startY)

  return { centerX, centerY, width, height }
}
export const drawEllipse = (ctx: CanvasRenderingContext2D, ellipseData: EllipseData) => {
  const { startX, startY, endX, endY } = ellipseData
  const { centerX, centerY, width, height } = calculateEllipseData(startX, startY, endX, endY)
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI)
  ctx.stroke()
}

export const addDynamicWatermark = (ctx: CanvasRenderingContext2D, text: string) => {
  const { width, height } = ctx.canvas

  ctx.save()
  // 调整水印参数
  ctx.globalAlpha = 0.15 // 降低透明度
  ctx.font = '28px Arial'
  ctx.fillStyle = '#888' // 改用浅灰色
  ctx.rotate((-30 * Math.PI) / 180) // 旋转30度避免遮挡正文

  // 计算水印间隔
  const textWidth = ctx.measureText(text).width
  const stepX = textWidth * 2.5 // X轴间隔为文字宽度的2.5倍
  const stepY = 150 // Y轴间隔

  // 错位平铺算法
  for (let y = -height; y < height * 2; y += stepY) {
    for (let x = -width; x < width * 2; x += stepX) {
      // 每行偏移增加半个步长
      const offsetX = (y / stepY) % 2 ? x + stepX / 2 : x
      ctx.fillText(text, offsetX, y)
    }
  }
  ctx.restore()
}
export const addDynamicPageNumber = (ctx: CanvasRenderingContext2D, pageNum: number, totalPages: number) => {
  // 获取 Canvas 尺寸
  const canvas = ctx.canvas // 通过 context 直接获取 canvas 对象
  // 添加页码（右下角）
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.font = '18px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'

  const pageText = `${pageNum}/${totalPages}`
  const padding = 20 // 边距

  // 添加文字背景（可选）
  const textWidth = ctx.measureText(pageText).width
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillRect(
    (canvas.width - textWidth) / 2 - padding,
    canvas.height - padding - 24, // 24为行高补偿
    textWidth + padding,
    30
  )

  // 绘制页码文字
  ctx.fillStyle = '#333'
  ctx.fillText(
    pageText,
    canvas.width / 2, // X坐标：右侧留20px
    canvas.height - padding // Y坐标：底部留20px
  )
  // 恢复原始画布状态
  ctx.restore()
}
