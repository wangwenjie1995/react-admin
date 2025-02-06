import type { Store } from 'redux'
// reduxjs/toolkit: 官方推荐编写Redux逻辑的方式，是一套工具的集合集，简化书写方式
import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
// React-Redux ：用来 链接 Redux 和 React 组件的中间件；React Redux 是 Redux 的官方 React UI 绑定层。它允许 React 组件从 Redux 存储中读取数据，并将操作调度到存储以更新状态。
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appSlice from './modules/app'
// import menuSlice from './modules/menu'
// import tagsSlice from './modules/tags'
// import userSlice from './modules/user'

const persistConfig = {
  key: 'redux-persist',
  storage
}
// export const store: Store = configureStore({
//   reducer: {
//     app: persistReducer(persistConfig, appSlice)
//   }
// })

export const store: Store = configureStore({
  reducer: {
    app: persistReducer(persistConfig, appSlice),
    // menu: persistReducer(persistConfig, menuSlice),
    // tags: persistReducer(persistConfig, tagsSlice),
    // user: persistReducer(persistConfig, userSlice)
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: true
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
