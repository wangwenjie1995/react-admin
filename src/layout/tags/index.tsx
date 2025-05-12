import type { MenuProps } from 'antd'
import type { RouteObject } from '@/router/types'
import { type FC, type WheelEvent, useState, useEffect, useRef } from 'react'
import { Button, Dropdown } from 'antd'
import {
  LeftOutlined,
  RightOutlined,
  ExpandOutlined,
  CompressOutlined,
  CloseOutlined,
  RedoOutlined
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFullscreen } from 'ahooks'
import { TagItem } from './components'
import useTagsStore from '@/stores/modules/tags'
import { searchRoute } from '@/utils'
import classNames from 'classnames'
import styles from './index.module.less'
import useUserStore from '@/stores/userStore'

const LayoutTags: FC = () => {
  const visitedTags = useTagsStore((state) => state.visitedTags);
  const addVisitedTags = useTagsStore((state) => state.addVisitedTags);
  const closeAllTags = useTagsStore((state) => state.closeAllTags);
  const closeTagByKey = useTagsStore((state) => state.closeTagByKey);
  const closeTagsByType = useTagsStore((state) => state.closeTagsByType);
  const items: MenuProps['items'] = [
    { key: 'left', label: '关闭左侧' },
    { key: 'right', label: '关闭右侧' },
    { key: 'other', label: '关闭其它' },
    { key: 'all', label: '关闭所有' }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'all') {
      // @ts-ignore
      closeAllTags().then((payload) => {
        const lastTag = payload.slice(-1)[0]
        // 定义默认导航目标
        const targetPath = lastTag?.fullPath ?? '/';
        if (activeTag !== targetPath) {
          navigate(targetPath)
        }
      })
    } else {
      closeTagsByType(key, activeTag)
    }
  }

  const tagsMain = useRef<ElRef>(null)
  const tagsMainCont = useRef<ElRef>(null)

  const [canMove, setCanMove] = useState(false)
  const [tagsContLeft, setTagsContLeft] = useState(0)
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.querySelector('#mainCont')!)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [activeTag, setActiveTag] = useState(pathname)
  const permissions = useUserStore((state) => state.permissions);
  useEffect(() => {
    const affixTags = initAffixTags(permissions)
    for (const tag of affixTags) {
      addVisitedTags(tag)
    }
  }, [])

  useEffect(() => {
    const currRoute = searchRoute(pathname, permissions)
    if (currRoute) {
      addVisitedTags(currRoute)
    }
    setActiveTag(pathname)
  }, [pathname, permissions])

  useEffect(() => {
    const tagNodeList = tagsMainCont.current?.childNodes as unknown as Array<HTMLElement>
    const activeTagNode = Array.from(tagNodeList).find(item => item.dataset.path === activeTag)!

    moveToActiveTag(activeTagNode)
  }, [activeTag])

  useEffect(() => {
    const mainWidth = tagsMain.current?.offsetWidth!
    const mainContWidth = tagsMainCont.current?.offsetWidth!

    if (mainContWidth > mainWidth) {
      setCanMove(true)
    } else {
      setCanMove(false)
    }
  }, [visitedTags.length])

  const initAffixTags = (routes: RouteObject[], basePath: string = '/') => {
    let affixTags: RouteObject[] = []

    for (const route of routes) {
      if (route.meta?.affix) {
        const fullPath = route.path!.startsWith('/') ? route.path : basePath + route.path
        affixTags.push({
          ...route,
          path: fullPath
        })
      }
      if (route.children && route.children.length) {
        affixTags = affixTags.concat(initAffixTags(route.children, route.path))
      }
    }

    return affixTags
  }

  const moveToActiveTag = (tag: any) => {
    let leftOffset: number = 0
    const mainContPadding = 4
    const mainWidth = tagsMain.current?.offsetWidth!
    const mainContWidth = tagsMainCont.current?.offsetWidth!

    if (mainContWidth < mainWidth) {
      leftOffset = 0
    } else if (tag?.offsetLeft! < -tagsContLeft) {
      // 标签在可视区域左侧 (The active tag on the left side of the layout_tags-main)
      leftOffset = -tag?.offsetLeft! + mainContPadding
    } else if (tag?.offsetLeft! > -tagsContLeft && tag?.offsetLeft! + tag?.offsetWidth! < -tagsContLeft + mainWidth) {
      // 标签在可视区域 (The active tag on the layout_tags-main)
      leftOffset = Math.min(0, mainWidth - tag?.offsetWidth! - tag?.offsetLeft! - mainContPadding)
    } else {
      // 标签在可视区域右侧 (The active tag on the right side of the layout_tags-main)
      leftOffset = -(tag?.offsetLeft! - (mainWidth - mainContPadding - tag?.offsetWidth!))
    }
    setTagsContLeft(leftOffset)
  }

  const handleMove = (offset: number) => {
    let leftOffset: number = 0
    const mainWidth = tagsMain.current?.offsetWidth!
    const mainContWidth = tagsMainCont.current?.offsetWidth!

    if (offset > 0) {
      leftOffset = Math.min(0, tagsContLeft + offset)
    } else {
      if (mainWidth < mainContWidth) {
        if (tagsContLeft >= -(mainContWidth - mainWidth)) {
          leftOffset = Math.max(tagsContLeft + offset, mainWidth - mainContWidth)
        }
      } else {
        leftOffset = 0
      }
    }
    setTagsContLeft(leftOffset)
  }

  const handleScroll = (e: WheelEvent) => {
    const type = e.type
    let distance: number = 0

    if (type === 'wheel') {
      distance = e.deltaY ? e.deltaY * 2 : -(e.detail || 0) * 2
    }

    handleMove(distance)
  }

  const handleCloseTag = (path: string) => {
    // @ts-ignore
    closeTagByKey(path).then((payload) => {
      let currTag: RouteObject
      const { tagIndex, tagsList } = payload
      const tagLen = tagsList.length
      if (path === activeTag) {
        if (tagIndex <= tagLen - 1) {
          currTag = tagsList[tagIndex]
        } else {
          currTag = tagsList[tagLen - 1]
        }
        navigate(currTag?.fullPath!)
      }
    })
  }

  const handleClickTag = (path: string) => {
    setActiveTag(path)
    navigate(path)
  }
  const getKey = () => {
    return new Date().getTime().toString()
  }
  const handleReload = () => {
    // 刷新当前路由，页面不刷新
    const index = visitedTags.findIndex((tab: RouteObject) => tab.fullPath === activeTag)
    if (index >= 0) {
      // 这个是react的特性，key变了，组件会卸载重新渲染
      navigate(activeTag, { replace: true, state: { key: getKey() } })
    }
  }
  return (
    <div className={styles['layout_tags']}>
      <Button
        className={styles['layout_tags__btn']}
        icon={<LeftOutlined />}
        size='small'
        disabled={!canMove}
        onClick={() => handleMove(200)}
      />
      <div ref={tagsMain} className={styles['layout_tags__main']} onWheel={handleScroll}>
        <div ref={tagsMainCont} className={styles['layout_tags__main-cont']} style={{ left: tagsContLeft + 'px' }}>
          {visitedTags.map((item: RouteObject) => (
            <span key={item.fullPath} data-path={item.fullPath}>
              <TagItem
                name={item.title!}
                active={activeTag === item.fullPath}
                fixed={item.meta?.affix}
                onClick={() => handleClickTag(item.fullPath!)}
                closeTag={() => handleCloseTag(item.fullPath!)}
              />
            </span>
          ))}
        </div>
      </div>
      <Button
        className={styles['layout_tags__btn']}
        icon={<RightOutlined />}
        size='small'
        disabled={!canMove}
        onClick={() => handleMove(-200)}
      />
      <Button
        className={classNames(styles['layout_tags__btn'], styles['layout_tags__btn-space'])}
        icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
        size='small'
        onClick={() => toggleFullscreen()}
      />
      <Button
        className={classNames(`${styles.layout_tags}__btn`, `${styles.layout_tags}__btn-space`)}
        icon={<RedoOutlined />}
        size='small'
        onClick={() => handleReload()}
      />
      <Dropdown menu={{ items, onClick }} placement='bottomLeft'>
        <Button
          className={classNames(styles['layout_tags__btn'], styles['layout_tags__btn-space'])}
          icon={<CloseOutlined />}
          size='small'
        />
      </Dropdown>
    </div>
  )
}

export default LayoutTags
