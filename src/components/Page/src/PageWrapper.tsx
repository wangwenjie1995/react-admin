import pageWrapperStyle from './pageWrapper.module.less'

interface PluginProp {
  name?: string
  desc?: string
  url?: string
}

interface PageProp {
  plugin?: PluginProp
  children: JSX.Element
}

const PageWrapper = (props: PageProp) => {
  return (
    <div className={pageWrapperStyle['page-wrapper']}>
      <div className={pageWrapperStyle['page-content']}>{props.children}</div>
    </div>
  )
}

export default PageWrapper
