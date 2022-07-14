import { EqxLifeCycleEventName } from "../types"
import EqxCustomMgrServ from "./base.service"
export default class ListenerService extends EqxCustomMgrServ {
  // 监听收集
  private _deps: Map<EqxLifeCycleEventName, Function[]> = new Map()

  // 注册生命周期事件监听
  /*
        需要在编辑器中调用该方法注册
      */
  public registerDep = (event: EqxLifeCycleEventName) => {
    if (!this._deps.has(event)) {
      this._deps.set(event, [])
    }
    return this._deps.get(event)
  }

  /**
   * Eqx作品调用触发事件通知
   * @param event
   */
  public notifyDep = (event: EqxLifeCycleEventName) => {
    const fns = this._deps.get(event) || []
    fns.forEach(fn => {
      fn instanceof Function
        ? fn()
        : console.warn('Callback must be a function.')
    })
  }
}
