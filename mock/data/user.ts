import type { MockMethod } from 'vite-plugin-mock'
import { type requestParams, resultSuccess, resultError, getRequestToken } from '../_utils'

export function createFakeUserList() {
  return [
    {
      userId: '10000',
      username: 'admin',
      realName: 'react admin design',
      avatar: 'https://cdn.jsdelivr.net/gh/baimingxuan/media-store/images/avatar.jpeg',
      desc: 'super admin',
      password: '123456',
      token: 'fakeToken',
      homePath: '/home',
      permissions: [
        {
          name: 'Home',
          title: '首页',
          path: '/home',
          meta: {
            affix: true
          }
        },
        {
          name: 'Cesium',
          title: 'Cesium',
          path: '/cesium',
          children: [
            {
              name: 'CesiumMap',
              path: '/cesium-map',
              title: '地球'
            }
          ]
        },
        {
          name: 'ThreeJs',
          title: 'ThreeJs',
          path: '/threeJs',
          children: [
            {
              name: 'Gobang',
              path: '/gobang',
              title: '五子棋'
            }
          ]
        },
        {
          name: 'Compo',
          title: '组件',
          path: '/compo',
          children: [
            {
              name: 'ImageUpload',
              title: '图片上传',
              path: '/image-upload'
            },
            {
              name: 'Drag',
              title: '拖拽',
              path: '/drag',
              children: [
                {
                  name: 'DragList',
                  title: '列表拖拽',
                  path: '/drag-list'
                },
                {
                  name: 'DragResize',
                  title: '组件拖拽',
                  path: '/drag-resize'
                }
              ]
            },
            {
              name: 'Transfer',
              path: '/transfer',
              title: '穿梭框'
            },
            {
              name: 'CountUp',
              path: '/count-up',
              title: '数字滚动'
            },
            {
              name: 'WaterfallDemo',
              path: '/waterfall-demo',
              title: '瀑布流'
            }
          ]
        },
        {
          name: 'Pdf',
          title: 'PDF',
          path: '/pdf',
          children: [
            {
              name: 'SinglePdf',
              title: '单页渲染/切换',
              path: '/single-pdf'
            },
            {
              name: 'AllPdf',
              title: '渲染全部',
              path: '/all-pdf'
            }
          ]
        },
        {
          name: 'Draw',
          path: '/draw',
          title: '图画',
          children: [
            {
              name: 'CanvasDraw',
              path: '/canvas-draw',
              title: 'canvas画图'
            }
          ]
        },
        {
          name: 'Excel',
          path: '/excel',
          title: 'Excel',
          children: [
            {
              name: 'Handsontable',
              path: '/handsontable',
              title: 'Handsontable'
            },
            {
              name: 'ExportExcel',
              path: '/export-excel',
              title: '导出Excel'
            },
            {
              name: 'ImportExcel',
              path: '/import-excel',
              title: '导入Excel'
            }
          ]
        },
        {
          name: 'ExceptionPage',
          path: '/exception',
          title: '异常页面',
          children: [
            {
              name: 'Page403',
              path: '/page-403',
              title: '403页面'
            },
            {
              name: 'Page404',
              path: '/page-404',
              title: '404页面'
            },
            {
              name: 'Page500',
              path: '/page-500',
              title: '500页面'
            }
          ]
        },
        {
          name: 'FlowEditor',
          path: '/flow-editor',
          title: '流程图编辑器',
          children: [
            {
              name: 'FlowApprove',
              path: '/flow-approve',
              title: '审批流程图'
            },
            {
              name: 'FlowBpmn',
              path: '/flow-bpmn',
              title: 'BPMN流程图'
            }
          ]
        },
        {
          name: 'Form',
          path: '/form',
          title: '表单',
          children: [
            {
              name: 'BasicForm',
              path: '/basic-form',
              title: '基础表单'
            }
          ]
        },
        {
          name: 'Image',
          path: '/image',
          title: '图片处理',
          children: [
            {
              name: 'ImageCropper',
              path: '/image-cropper',
              title: '图片裁剪'
            },
            {
              name: 'ImageCompress',
              path: '/image-compress',
              title: '图片压缩'
            },
            {
              name: 'ImageComposition',
              path: '/image-composition',
              title: '图片合成'
            }
          ]
        },
        {
          name: 'Table',
          path: '/table',
          title: '表格',
          children: [
            {
              name: 'TableBasic',
              path: '/table-basic',
              title: '基础表格'
            },
            {
              name: 'TableEditRow',
              path: '/table-edit-row',
              title: '可编辑行表格'
            }
          ]
        },
        {
          name: 'Editor',
          path: '/editor',
          title: '文本编辑器',
          children: [
            {
              name: 'Markdown',
              path: '/markdown',
              title: 'Markdown编辑器'
            },
            {
              name: 'RichText',
              path: '/rich-text',
              title: '富文本编辑器'
            },
            {
              name: 'CodeEditor',
              path: '/code-editor',
              title: '代码编辑器'
            }
          ]
        },
        {
          name: 'Tree',
          path: '/tree',
          title: '树形结构',
          children: [
            {
              name: 'OrgTree',
              path: '/org-tree',
              title: '组织树'
            },
            {
              name: 'AntdTree',
              path: '/antd-tree',
              title: '控件树'
            }
          ]
        },
        {
          name: 'Video',
          path: '/video',
          title: '视频处理',
          children: [
            {
              name: 'VideoPlayer',
              path: '/video-player',
              title: '视频播放器'
            },
            {
              name: 'VideoWatermark',
              path: '/video-watermark',
              title: '视频水印'
            }
          ]
        }
      ]
    }
  ]
}

// Mock user login
export default [
  {
    url: '/api/login',
    timeout: 500,
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createFakeUserList().find(item => item.username === username && password === item.password)
      if (!checkUser) {
        return resultError('Incorrect account or password!')
      }
      const { userId, username: _username, token, realName, desc } = checkUser
      return resultSuccess({
        userId,
        username: _username,
        token,
        realName,
        desc
      })
    }
  },
  {
    url: '/api/getUserInfo',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token!')
      const checkUser = createFakeUserList().find(item => item.token === token)
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!')
      }
      return resultSuccess(checkUser)
    }
  },
  {
    url: '/api/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token!')
      const checkUser = createFakeUserList().find(item => item.token === token)
      if (!checkUser) {
        return resultError('Invalid token!')
      }
      return resultSuccess(undefined, { message: 'Token has been destroyed!' })
    }
  }
] as MockMethod[]
