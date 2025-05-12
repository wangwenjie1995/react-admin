// 导入必要的库
// @react-three/fiber: React 的 Three.js 渲染器，让我们可以用 React 组件的方式写 Three.js
// @react-three/drei: 提供了一些有用的 Three.js 组件和 hooks
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useRef, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { Button } from 'antd';
import styles from './gobang.module.less'

// 定义棋子接口，用于类型检查
interface Piece {
  x: number;  // 棋子在棋盘上的 x 坐标
  y: number;  // 棋子的高度（y轴）
  z: number;  // 棋子在棋盘上的 z 坐标
  color: string;  // 棋子颜色（黑/白）
}

// 棋盘组件：渲染 3D 棋盘和网格线
const Board = ({ size, gridSize }: { size: number, gridSize: number }) => {
  // 使用缓存生成棋盘线
  const gridLines = useMemo(() => {
    return Array.from({ length: size + 1 }).map((_, i) => ({
      horizontal: i * gridSize - size / 2,
      vertical: i * gridSize - size / 2
    }));
  }, [size, gridSize]);
  return (
    <group>  {/* group 用于将多个 3D 对象组合在一起 */}
      {/* 棋盘底板：一个扁平的盒子 */}
      <mesh position={[0, -0.1, 0]}>  {/* mesh 是 Three.js 中的基本渲染单元，由几何体和材质组成 */}
        <boxGeometry args={[size * gridSize, 0.2, size * gridSize]} />  {/* 创建一个盒子几何体：宽x轴、高y轴、深z轴 */}
        <meshStandardMaterial color="#d4a373" />  {/* 标准材质，模拟真实物体的光照效果 */}
      </mesh>
      {/* 新增：中心红色标记 */}
      <mesh position={[0, 0.1, 0]}> {/* Y轴位置高于底板 */}
        <sphereGeometry args={[0.15, 32, 32]} /> {/* 半径0.15，足够显眼 */}
        <meshBasicMaterial color="red" /> {/* 不受光照影响 */}
      </mesh>

      {/* 绘制网格线：使用细长的盒子作为线条 */}
      {gridLines.map((_, i) => (
        <group key={i}>
          {/* 横线：细长的盒子，水平放置 */}
          <mesh position={[0, 0, i * gridSize - size / 2]}>
            <boxGeometry args={[size * gridSize, 0.01, 0.05]} />  {/* 细长的盒子作为线条 */}
            <meshStandardMaterial color="black" />
          </mesh>
          {/* 竖线：细长的盒子，垂直放置 */}
          <mesh position={[i * gridSize - size / 2, 0, 0]}>
            <boxGeometry args={[0.05, 0.01, size * gridSize]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// 红圈提示组件：显示可落子位置
const PositionHint = ({ position }: { position: [number, number, number] }) => {
  return (
    <mesh position={[position[0], 0.01, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.35, 0.4, 32]} />  {/* 内径、外径、分段数 */}
      <meshBasicMaterial color="red" transparent opacity={0.6} />
    </mesh>
  )
}

// 棋子组件：渲染一个圆柱体作为棋子
const Piece = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />  {/* 上半径、下半径、高度、分段数 */}
      <meshStandardMaterial
        color={color}
        metalness={0.1}
        roughness={0.2}
      />
    </mesh>
  )
}

// 预览棋子组件：跟随鼠标移动
// 在组件外创建共享几何体和材质（避免重复实例化）
const pieceGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 32);
const previewMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0.6
})
const PreviewPiece = ({ position, color }: { position: [number, number, number], color: string }) => {
  previewMaterial.color.set(color); // 仅更新颜色属性
  return <mesh geometry={pieceGeometry} material={previewMaterial} position={position} />;
}

// 主五子棋组件
const Gobang3D = () => {
  // 棋盘尺寸
  const size = 30  // 棋盘尺寸
  const gridSize = 1  // 每个格子的大小（单位：1）

  // 状态管理：存储所有棋子的位置和颜色
  const [pieces, setPieces] = useState<Piece[]>([])
  const [isBlack, setIsBlack] = useState(true)  // 当前落子方（黑/白）
  const [history, setHistory] = useState<Piece[][]>([]); // 历史记录
  const [winner, setWinner] = useState<string | null>(null); // 胜利方
  // 修改状态名称以更好地表达其用途
  const [mousePosition, setMousePosition] = useState<[number, number, number] | null>(null)
  const [validPosition, setValidPosition] = useState<[number, number, number] | null>(null)

  // 胜利判断算法
  const checkWin = useCallback((newPiece: Piece) => {
    const directions = [
      [1, 0],  // 水平
      [0, 1],  // 垂直
      [1, 1],  // 正对角线
      [1, -1]  // 反对角线
    ];

    for (const [dx, dz] of directions) {
      let count = 1;

      // 向两个方向检查
      for (let dir = -1; dir <= 1; dir += 2) {
        for (let step = 1; step <= 4; step++) {
          const x = newPiece.x + dx * step * dir;
          const z = newPiece.z + dz * step * dir;

          if (pieces.some(p => p.x === x && p.z === z && p.color === newPiece.color)) {
            count++;
          } else {
            break;
          }
        }
      }

      if (count >= 5) return true;
    }
    return false;
  }, [pieces]);
  // 处理鼠标移动事件
  const handleMouseMove = (event: ThreeEvent<MouseEvent>) => {
    if (winner) return;
    const { point } = event
    // 更新鼠标位置（用于预览棋子）
    setMousePosition([point.x, 0.2, point.z])  // 调整高度以匹配新的棋子形状

    // 计算最近的格点位置
    const halfSize = Math.floor(size / 2)  // 使用 Math.floor 确保得到正确的边界
    const x = Math.round(point.x)
    const z = Math.round(point.z)

    // 检查是否在棋盘范围内
    if (Math.abs(x) <= halfSize && Math.abs(z) <= halfSize) {
      // 检查该位置是否已有棋子
      const hasPiece = pieces.some(p => p.x === x && p.z === z)
      if (!hasPiece) {
        setValidPosition([x, 0, z])
      } else {
        setValidPosition(null)
      }
    } else {
      setValidPosition(null)
    }
  }

  // 处理鼠标离开棋盘事件
  const handleMouseLeave = () => {
    setMousePosition(null)
    setValidPosition(null)
  }

  // 处理落子事件
  const handlePlacePiece = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (!validPosition) return  // 如果不在有效位置，不执行落子
    if (winner) return;
    const [x, _, z] = validPosition
    // 确保落子位置在有效范围内
    const halfSize = Math.floor(size / 2)
    if (Math.abs(x) > halfSize || Math.abs(z) > halfSize) return
    console.log(x, z)
    const newPiece = {
      x,
      y: 0,
      z,
      color: isBlack ? '#1a1a1a' : '#ffffff'
    }
    const newPieces = [...pieces, newPiece];
    // 保存历史
    setHistory(prev => [...prev, pieces]);

    // 检查胜利
    if (checkWin(newPiece)) {
      setWinner(isBlack ? '黑棋' : '白棋');
    } else {
      setIsBlack(!isBlack);
    }
    setPieces(newPieces)
  }

  // 回退功能
  const undo = () => {
    if (history.length === 0) return;

    const prevPieces = history[history.length - 1];
    setPieces(prevPieces);
    setHistory(prev => prev.slice(0, -1));
    setIsBlack(history.length % 2 === 1);
    setWinner(null);
  };

  // 重新开始
  const resetGame = () => {
    setPieces([]);
    setHistory([]);
    setIsBlack(true);
    setWinner(null);
  };
  // 使用 useMemo 优化胜利判断
  const gameStatus = useMemo(() => {
    return winner ? `${winner} 已胜利!` : `${isBlack ? '黑' : '白'}方回合`;
  }, [winner, isBlack]);
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className={styles['controls-panel']}>
        <div className="mb-2">当前玩家：{isBlack ? '黑棋' : '白棋'}</div>
        {winner && <div style={{ color: 'red' }} className="mb-2">{winner} 胜利！</div>}
        <Button
          onClick={undo}
          disabled={history.length === 0}
          className="mr-2.5"
        >
          悔棋
        </Button>
        <Button onClick={resetGame}>
          重新开始
        </Button>
      </div>
      <Canvas
        camera={{ position: [0, 15, 0], fov: 50 }}
        frameloop="demand" // 非激活状态暂停渲染
        gl={{
          antialias: false, // 关闭抗锯齿
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.4} />
        <OrbitControls />

        <Board size={size} gridSize={gridSize} />

        {/* 渲染所有已放置的棋子 */}
        {pieces.map((piece, i) => (
          <Piece
            key={i}
            position={[piece.x, piece.y, piece.z]}
            color={piece.color}
          />
        ))}

        {/* 渲染红圈提示 */}
        {validPosition && <PositionHint position={validPosition} />}

        {/* 渲染跟随鼠标的预览棋子 */}
        {mousePosition && (
          <PreviewPiece
            position={mousePosition}
            color={isBlack ? '#1a1a1a' : '#ffffff'}
          />
        )}

        {/* 用于检测鼠标移动和点击的透明平面 */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={handlePlacePiece}
          onPointerMove={handleMouseMove}
          onPointerLeave={handleMouseLeave}
          position={[0, 0, 0]}  // 确保平面在正确的位置
        >
          <planeGeometry args={[size, size]} />  {/* 使用实际的棋盘尺寸 */}
          <meshStandardMaterial visible={false} />
        </mesh>
      </Canvas>
    </div>
  )
}

export default Gobang3D
