import { type FC, useEffect, useState, useRef } from 'react'
import { Row, Col, Space, Flex, Card, Button } from 'antd'
import CountUpCard from './components/CountUpCard'
import ChartsCard from './components/ChartsCard'
import { countUpData, pieOptions, ringOptions, radarOptions, barOptions, lineOptions } from './data'
import { number } from 'echarts'
interface ChildProps {
  initialValue: number
}
let intervalRef: any = null
const Parent: FC = () => {
  const [val, setVal] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count < 10) {
      intervalRef = setInterval(() => {
        console.log('before setcount', count)
        setCount(val => val + 1)
        console.log('after setcount', count)
      }, 1000)
    } else {
      clearInterval(intervalRef)
    }
    return () => clearInterval(intervalRef)
  }, [count])
  return (
    <>
      <Button onClick={() => setVal(val + 1)}>{val}</Button>
      <Child initialValue={val}></Child>
    </>
  )
}
const Child: FC<ChildProps> = ({ initialValue }) => {
  const [val, setVal] = useState(initialValue)
  return (
    <div>
      {val}|{initialValue}
    </div>
  )
}
const HomePage: FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  setTimeout(() => {
    setIsLoading(false)
  }, 1500)

  return (
    <>
      <Parent></Parent>
      <Space direction='vertical' size={12} style={{ display: 'flex' }}>
        <Row gutter={12}>
          {countUpData.map(item => {
            return (
              <Col flex={1} key={item.title}>
                <CountUpCard
                  loading={isLoading}
                  title={item.title}
                  color={item.color}
                  iconName={item.icon}
                  countNum={item.count}
                />
              </Col>
            )
          })}
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <ChartsCard loading={isLoading} options={pieOptions} height={300} />
          </Col>
          <Col span={8}>
            <ChartsCard loading={isLoading} options={ringOptions} height={300} />
          </Col>
          <Col span={8}>
            <ChartsCard loading={isLoading} options={radarOptions} height={300} />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <ChartsCard loading={isLoading} options={barOptions} height={350} />
          </Col>
          <Col span={12}>
            <ChartsCard loading={isLoading} options={lineOptions} height={350} />
          </Col>
        </Row>
      </Space>
    </>
  )
}

export default HomePage
