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
  ctx.beginPath();
  ctx.moveTo(startX, startY);

  //直线用lineTo比较好
  ctx.lineTo(endX, endY);
  // 曲线使用二次贝塞尔曲线绘制比较好,可以跟平滑点
  // 计算控制点，这里可以使用上一个位置和当前鼠标位置的中点作为控制点
  // const controlX = (lastX + x) / 2
  // const controlY = (lastY + y) / 2
  // ctx!.quadraticCurveTo(controlX, controlY, x, y)
  ctx.stroke();
}
// 计算椭圆或圆形的相关数据
const calculateEllipseData = (startX: number, startY: number, endX: number, endY: number) => {
  const centerX = (startX + endX) / 2
  const centerY = (startY + endY) / 2
  const width = Math.abs(endX - startX)
  const height = Math.abs(endY - startY)

  return { centerX, centerY, width, height };
}
export const drawEllipse = (ctx: CanvasRenderingContext2D, ellipseData: EllipseData) => {
  const { startX, startY, endX, endY } = ellipseData
  const { centerX, centerY, width, height } = calculateEllipseData(startX, startY, endX, endY)
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();
}
