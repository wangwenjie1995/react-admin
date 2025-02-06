import type { LoginParams, UserInfo } from '@/types'
import { type FC, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Checkbox, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import useUserStore from '@/stores/userStore'
import { loginApi, getUserInfo } from '@/api'
import logoIcon from '@/assets/images/logo_name.png'
import classNames from 'classnames'
import styles from './index.module.less'
import { addFullPath } from '@/router/helpers'

const LoginPage: FC = () => {
  const sessionTimeout = useUserStore((state) => state.sessionTimeout);
  const setToken = useUserStore((state) => state.setToken);
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const setPermissions = useUserStore((state) => state.setPermissions);
  const setSessionTimeout = useUserStore((state) => state.setSessionTimeout);
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleLogin = async (values: any) => {
    try {
      setLoading(true)
      const userInfo = await loginAction({
        username: values.username,
        password: values.password
      })
      if (userInfo) {
        message.success('登陆成功！')
      }
    } catch (error) {
      message.error((error as unknown as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const loginAction = async (
    params: LoginParams & {
      goHome?: boolean
    }
  ): Promise<UserInfo | null> => {
    try {
      const { goHome = true, ...loginParams } = params
      const data = await loginApi(loginParams)

      // 保存 Token
      setToken(data?.token)
      console.log('setToken', data?.token)
      return afterLoginAction(goHome)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const afterLoginAction = async (goHome?: boolean): Promise<UserInfo | null> => {
    const token = useUserStore.getState().token || ''
    if (!token) return null

    const userInfo = await getUserInfoAction()
    console.log(userInfo, sessionTimeout)
    if (sessionTimeout) {
      setSessionTimeout(false)
    } else {
      const redirect = searchParams.get('redirect')
      if (redirect) {
        navigate(redirect)
      } else {
        goHome && navigate(userInfo?.homePath || '/home')
      }
    }

    return userInfo
  }

  const getUserInfoAction = async (): Promise<UserInfo | null> => {
    const token = useUserStore.getState().token || ''
    if (!token) return null

    const userInfo = await getUserInfo()
    userInfo.permissions = addFullPath(userInfo.permissions)
    setUserInfo(userInfo)
    setPermissions(userInfo.permissions)

    return userInfo
  }

  return (
    <div className={styles['login-wrapper']}>
      <div className={styles['login-box']}>
        <div className={styles['login-box-title']}>
          <img src={logoIcon} alt='icon' />
          <p>账 号 登 录</p>
        </div>
        <Form
          form={form}
          initialValues={{
            username: 'admin',
            password: '123456',
            remember: true
          }}
          className={styles['login-box-form']}
          onFinish={handleLogin}
        >
          <Form.Item name='username' rules={[{ required: true, message: '请输入账号' }]}>
            <Input
              placeholder='请输入账号'
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input
              type='password'
              placeholder='请输入密码'
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' className={classNames('fl', styles['no-margin'])} valuePropName='checked'>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Form.Item className={classNames('fr', styles['no-margin'])}>
              <a href=''>忘记密码？</a>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className={styles['login-btn']} loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
