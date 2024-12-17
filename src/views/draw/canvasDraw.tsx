import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Row, Col, ColorPicker, Radio, Upload } from "antd"
import { PageWrapper } from '@/components/Page'
import styles from './canvasDraw.module.less'
import { onMove, onMoveRequestAnimation } from '@/utils'
import { RadioChangeEvent } from 'antd/lib'
import { drawEllipse, drawLine } from '@/utils/canvas'
import { UploadChangeParam } from 'antd/es/upload';

const CanvasDraw: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const imgCanvas = useRef<HTMLCanvasElement>(null)
  const saveCanvas = useRef<HTMLCanvasElement>(null)
  let [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  let [imgCtx, setImgCtx] = useState<CanvasRenderingContext2D | null>(null)
  let [saveCtx, setSaveCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const [activtBtn, setActiveBtn] = useState('thin')
  const [color, setColor] = useState('#000')
  let animationFrameId = useRef<number | null>(null)
  const [isBlockMove, setIsBlockMove] = useState(false)
  const [mode, setMode] = useState<'line' | 'circle'>('line')

  const changeMode = (e: RadioChangeEvent) => {
    setMode(e.target.value)
  }

  const onClear = () => {
    ctx!.clearRect(0, 0, canvas.current!.width, canvas.current!.height)
    imgCtx!.clearRect(0, 0, canvas.current!.width, canvas.current!.height)
    saveCtx!.clearRect(0, 0, canvas.current!.width, canvas.current!.height)
  }
  const onBold = () => {
    ctx!.globalCompositeOperation = 'source-over'
    ctx!.lineWidth = 20
    setActiveBtn('bold')
  }
  const onThin = () => {
    ctx!.globalCompositeOperation = 'source-over'
    ctx!.lineWidth = 1
    setActiveBtn('thin')
  }
  const onEraser = () => {
    ctx!.globalCompositeOperation = 'destination-out'
    ctx!.lineWidth = 30
    setActiveBtn('eraser')
  }
  const onColorChange = (color: string) => {
    setColor(color)
    ctx!.strokeStyle = color
  }
  const onSave = () => {
    // 将主画布和背景画布内容合并
    const imgCtxData = imgCtx!.getImageData(0, 0, imgCanvas.current!.width, imgCanvas.current!.height)
    saveCtx!.putImageData(imgCtxData, 0, 0);
    saveCtx!.drawImage(
      canvas.current!,
      0,
      0,
      canvas.current!.width,
      canvas.current!.height
    );
    // setWhiteBg()
    let dataUrl = saveCanvas.current!.toDataURL()
    const elem = window.document.createElement('a')
    elem.href = dataUrl;
    elem.download = '签名.png'
    elem.click()
  }
  const onCreateArc = () => {
    ctx?.beginPath();
    //arc(x, y, r, 开始角度, 借宿角度)
    //Math.PI表示半圆;
    //这个弧将从0度（3点钟方向）开始，并顺时针绘制到360度
    ctx?.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx?.stroke();
    ctx?.fill()
  }
  const handleUploadChange = (info: UploadChangeParam) => {
    const file = info.file.originFileObj;
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target!.result as string
      img.onload = () => {
        const canvasWidth = canvas.current!.width
        const canvasHeight = canvas.current!.height
        const imgCanvasCtx = imgCanvas.current!.getContext('2d')
        imgCanvasCtx!.drawImage(img, 0, 0, canvasWidth, canvasHeight)
        // // 保存当前画布状态
        // const savedState = ctx!.getImageData(0, 0, canvas.current!.width, canvas.current!.height);
        // // 清除画布内容，保留背景

        // ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
        // 绘制背景图到最底层
        // ctx!.drawImage(img as HTMLImageElement, 0, 0, canvasWidth, canvasHeight);
        // ctx!.save();
        // // 恢复之前的绘制内容
        // ctx!.putImageData(savedState, 0, 0);
      }
    }
    reader.readAsDataURL(file); // 读取文件
  }
  const setWhiteBg = () => {
    let imgData = ctx!.getImageData(0, 0, canvas.current!.width, canvas.current!.height)
    for (let i = 0; i < imgData.data.length; i += 4) {
      // 当该像素是透明的,则设置成白色
      if (imgData.data[i + 3] == 0) {
        imgData.data[i] = 255
        imgData.data[i + 1] = 255
        imgData.data[i + 2] = 255
        imgData.data[i + 3] = 255
      }
    }
    ctx!.putImageData(imgData, 0, 0)
  }
  let mouseEventRemove = () => { }

  const mouseDownHandle = (e: React.MouseEvent) => {
    if (!ctx) return
    //计算鼠标位置
    const rect = canvas.current!.getBoundingClientRect();
    let startX = (e.pageX - rect.left) / scaleX
    let startY = (e.pageY - rect.top) / scaleY
    let lastX = startX
    let lastY = startY

    if (mode === 'line') {
      // 用户按下鼠标 (mousedown) 时，开始记录鼠标的绘图路径
      mouseEventRemove = onMove((event) => {
        //鼠标移动时(onMove),根据鼠标位置不断添加新点(lineTo)并实时绘制路径(stoke())
        const { x, y } = getMousePostion(event)
        drawLine(ctx, {
          startX: lastX, startY: lastY, endX: x, endY: y
        })
        lastX = x
        lastY = y
      },
        () => {
          // 鼠标释放时,完成路径
          ctx!.closePath() //用于闭合当前路径，将路径的起点和终点连接起来，形成一个封闭的路径。
        })
    }

    if (mode === 'circle') {
      let currentEllipseData = { startX, startY, endX: startX, endY: startY };
      // 鼠标移动时更新椭圆的预览
      const mouseMoveHandle = (event: MouseEvent) => {
        const { x, y } = getMousePostion(event)
        currentEllipseData!.endX = x;
        currentEllipseData!.endY = y;
        // 清空画布，仅保留已绘制内容（只更新当前椭圆）
        onClear()
        // 恢复画布状态，清除之前绘制的椭圆
        ctx!.putImageData(savedState, 0, 0);
        //画椭圆
        drawEllipse(ctx, currentEllipseData!)
      }
      // 鼠标抬起时，完成椭圆的绘制
      const mouseUpHandle = () => {
        // 清除事件监听器
        window.removeEventListener('mousemove', mouseMoveHandle);
        window.removeEventListener('mouseup', mouseUpHandle);
      };

      // 保存当前画布状态（用于恢复）
      const savedState = ctx!.getImageData(0, 0, canvas.current!.width, canvas.current!.height);
      window.addEventListener('mousemove', mouseMoveHandle);
      window.addEventListener('mouseup', mouseUpHandle);
    }
  }

  //自适应缩放比
  const onResize = () => {
    let width = canvas.current!.offsetWidth
    let height = canvas.current!.offsetHeight

    setScaleX(width / 800)
    setScaleY(height / 600)
  }
  const clearAnimation = () => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }
  let step = useRef(5) //每一步的长度
  let xPosition = useRef(0) //x坐标
  const onMoveBlock = () => {
    const BLOCK_WIDTH = 150
    if (isBlockMove) return
    ctx?.clearRect(xPosition.current, 100, BLOCK_WIDTH, BLOCK_WIDTH)
    xPosition.current += step.current

    ctx!.fillStyle = "blue"; // 蓝色
    ctx!.fillRect(xPosition.current, 100, BLOCK_WIDTH, BLOCK_WIDTH)
    if (xPosition.current + BLOCK_WIDTH >= canvas.current!.width || xPosition.current <= 0) {
      step.current = -step.current
    }

    animationFrameId.current = requestAnimationFrame(() => {
      onMoveBlock()
    })
  }
  const handleStartPause = () => {
    if (isBlockMove) {
      onPauseMoveBlock()
    } else {
      onMoveBlock()
    }
    setIsBlockMove(prev => !prev)
  }
  function onPauseMoveBlock() {
    if (!isBlockMove) return
    clearAnimation()
  }
  const getMousePostion = (event: MouseEvent) => {
    const rect = canvas.current!.getBoundingClientRect();
    return {
      x: (event.pageX - rect.left) / scaleX,
      y: (event.pageY - rect.top) / scaleY,
    }
  }

  const init = () => {
    setCtx(() => {
      let ctx = canvas.current?.getContext('2d') as CanvasRenderingContext2D
      ctx!.fillStyle = "rgba(255, 255, 255, 0)";
      ctx!.imageSmoothingEnabled = true
      ctx!.lineJoin = 'round'
      ctx!.lineCap = 'round'
      ctx!.strokeStyle = color
      return ctx
    })
    setImgCtx(() => {
      let imgCtx = imgCanvas.current?.getContext('2d') as CanvasRenderingContext2D
      return imgCtx
    })
    setSaveCtx(() => {
      let saveCtx = saveCanvas.current?.getContext('2d') as CanvasRenderingContext2D
      return saveCtx
    })
  }
  useEffect(() => {
    if (!canvas.current?.getContext) {
      console.log('当前浏览器不支持canvas,请下载最新的浏览器')
    }
    onResize();
    window.addEventListener('resize', onResize)
    init()
    return () => {
      mouseEventRemove()
      window.removeEventListener('resize', onResize)
      clearAnimation()
    }
  }, [])

  return (
    <PageWrapper>
      <div className={styles['canvas-page']}>
        <div className={styles['canvas-tools']}>
          <Row align="middle" gutter={8} style={{ marginTop: 10, marginBottom: 10 }}>
            <Col>
              <Radio.Group value={mode} onChange={changeMode}>
                <Radio.Button value="line">线</Radio.Button>
                <Radio.Button value="circle">圆</Radio.Button>
              </Radio.Group>
            </Col>

            <Col>
              <Button onClick={onEraser} className={activtBtn === 'eraser' ? styles['active-btn'] : styles['default-btn']}>橡皮擦</Button>
            </Col>
            <Col>
              <Button onClick={onClear}>清除画布</Button>
            </Col>

            <Col>
              <Button onClick={handleStartPause}>{isBlockMove ? '方块暂停' : '方块移动'}</Button>
            </Col>
            <Col>
              <Upload
                accept="image/*"
                showUploadList={false}
                onChange={handleUploadChange}
              >
                <Button>绘制背景图片</Button>
              </Upload>
            </Col>
            <Col>
              <Button onClick={onSave}>保存</Button>
            </Col>
          </Row>
          <Row align="middle" gutter={8}>
            <Col>
              <ColorPicker
                onChange={(color) => onColorChange(color.toHexString())}
                value={color}
                presets={[
                  {
                    label: '快速选择',
                    colors: [
                      '#000000',
                      '#F5222D',
                      '#FA8C16',
                      '#FADB14',
                      '#8BBB11',
                      '#52C41A',
                      '#13A8A8',
                      '#1677FF',
                      '#2F54EB',
                      '#722ED1'
                    ]
                  }
                ]}
                showText
              />
            </Col>
            <Col>
              <Button onClick={onBold} className={activtBtn === 'bold' ? styles['active-btn'] : styles['default-btn']}>粗线条</Button>
            </Col>
            <Col>
              <Button onClick={onThin} className={activtBtn === 'thin' ? styles['active-btn'] : styles['default-btn']}>细线条</Button>
            </Col>
            <Col>
              <Button onClick={onCreateArc}>生成圆</Button>
            </Col>
          </Row>
        </div>
        <div className={styles['canvas-body']}>
          <div className={styles['canvas-wrap']}>
            <canvas
              ref={canvas}
              width={800}
              height={600}
              onMouseDown={mouseDownHandle}
              className={styles['main-canvas']}>
              当前浏览器不支持canvas,请下载最新的浏览器
              <a href="https://www.google.cn/chrome/index.html">立即下载</a>
            </canvas>
            <canvas
              ref={imgCanvas}
              width={800}
              height={600}
              className={styles['img-canvas']}
            ></canvas>
            <canvas
              ref={saveCanvas}
              width={800}
              height={600}
              className={styles['save-canvas']}
            ></canvas>
          </div>
        </div>
      </div>
    </PageWrapper >
  )
}

export default CanvasDraw

