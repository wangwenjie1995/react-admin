import type { FC } from 'react'
import { Space } from 'antd'
import { useAppSelector } from '@/stores'
import classNames from 'classnames'
import styles from './app-logo.module.less'
import logoImg from '@/assets/images/logo.png'
import logoName from '@/assets/images/name_white.png'

const AppLogo: FC = () => {
  const getMenuFold = useAppSelector(state => state.app.appConfig?.menuSetting?.menuFold)

  return (
    <div className={classNames('anticon', styles['app-logo'])}>
      <Space>

        <img className={styles['logo-img']} src={logoImg} alt='logo' />
        <div style={{ 'color': 'white', fontSize: '28px', marginLeft: '8px' }}
          className={classNames(styles['logo-name'], { [styles['hidden']]: getMenuFold })}>BIGOC</div>
      </Space >
    </div >
  )
}

export default AppLogo
