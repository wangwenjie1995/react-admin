declare type Nullable<T> = T | null
declare type Recordable<T = any> = Record<string, T>
declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
declare global {
  export interface SetAction<T> {
    type: string
    payload: T
  }
}
