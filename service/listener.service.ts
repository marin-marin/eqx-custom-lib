import { EqxLifeCycleEventName } from "../types"
import EqxCustomMgrServ from "./base.service"
export default class ListenerService extends EqxCustomMgrServ {
  // 监听收集
  private _deps: Map<EqxLifeCycleEventName, Function[]> = new Map()

  // 注册生命周期事件监听
  /*
        需要在编辑器中调用该方法注册
      */
  public registerDep = (event: EqxLifeCycleEventName, fn: any = () => {}) =>{
    let events = this._deps.get(event) || []
    events.push(fn)
    this._deps.set(event, events)
    console.log('_deps',  this._deps)
    return true
  }

  /**
   * Eqx作品调用触发事件通知
   * @param event
   */
  public notifyDep = (event: EqxLifeCycleEventName, arg: any={}) => {
    const fns = this._deps.get(event) || []
    fns.forEach(fn => {
      fn instanceof Function
        ? fn(arg)
        : console.warn('Callback must be a function.')
    })
  }
  /**
   * 注销事件 
   * @param event 
   */
  public destroyDep = (event: EqxLifeCycleEventName) => {
    this._deps.delete(event)
  }
}
