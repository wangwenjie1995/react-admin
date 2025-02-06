import type { FC } from 'react'
import { Space } from 'antd'
import classNames from 'classnames'
import styles from './app-logo.module.less'
import logoImg from '@/assets/images/logo.png'
import useAppStore from '@/stores/modules/appStore'

const AppLogo: FC = () => {
  const appConfig = useAppStore(state => state.appConfig)
  const getMenuFold = appConfig?.menuSetting?.menuFold
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
