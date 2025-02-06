import SvgIcon from '@/components/SvgIcon'
import style from './index.module.less'
import classNames from 'classnames'
import useAppStore from '@/stores/modules/appStore'
import { MenuSetting } from '@/types/config'

export default function FoldTrigger() {
  const appConfig = useAppStore(state => state.appConfig)
  const getMenuFold = appConfig?.menuSetting?.menuFold
  const setAppConfig = useAppStore(state => state.setAppConfig)

  function toggledMenuFold() {
    setAppConfig?.({ menuSetting: { menuFold: !getMenuFold } as MenuSetting })
  }

  return (
    <span
      className={classNames(style['compo_fold-trigger'], { [style['unfold']]: !getMenuFold })}
      onClick={toggledMenuFold}
    >
      <SvgIcon name='unfold' size={20} />
    </span>
  )
}
