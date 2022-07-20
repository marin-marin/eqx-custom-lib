export type EqxScene = any
export type EqxComp = any
export type EqxPage = any
export type EqxLifeCycleEventName = string

export interface EqxContainerStyle {
  zIndex?: number,
  width?: number,
  height?: number,
  opacity?: number,
  top?: number,
  left?: number,
  transform?: string,
}


export interface EqxProperties {
  required?: boolean,
  disabled?: boolean
}

export interface EqxCompJson {
  'id'?: string, 
  'type'?: string,
  'choices'?: any,
  'content'?: string,
  'css'?: any,
  'properties'?: EqxProperties,
  'src'?: string
}

export type PostMsgCmd =
  | 'COMP_STYLE'
  | 'COMP_CONTENT'
  | 'COMP_BIND_EVENT'
  | 'CONTROL_EXEC'
  | ''

declare global {
  interface Window {
    EqxCustomManager: any
    _EqxCustomManager: any
  }
}

// 弹窗实例配置项
export type DialogOptions = {
    title?: string
    // 不同类别的内容类型
    content: string
    // 弹框的宽度
    width?: string | number
    // 弹框高度
    height?: string | number
    // 使用html片段
    useDangerousHtmlString?: boolean
    iconType?: 'default' | 'success' | 'warning' | 'error'
    // 不同类别的默认按钮
    buttons?: any[]
    // 显示右上角关闭icon
    showClose?: boolean
    // 是否使用动画效果
    animation?: boolean
    // 弹框显示、隐藏、移除的回调
    onShow?: Function
    onHide?: Function
    onRemove?: Function
}

export type ListenerFnObj = {fn: Function, once?: boolean}