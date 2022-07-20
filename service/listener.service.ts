import { EqxLifeCycleEventName, ListenerFnObj } from '../types'
import EqxCustomMgrServ from './base.service'
export default class ListenerService extends EqxCustomMgrServ {
  // 监听收集
  private _deps: Map<EqxLifeCycleEventName, ListenerFnObj[]> = new Map()

  // 注册生命周期事件监听
  /*
        需要在编辑器中调用该方法注册
      */
  public registerDep = (
    event: EqxLifeCycleEventName,
    fn: Function = () => {},
    options: {
      once?: boolean
    } = {},
  ) => {
    let events = this._deps.get(event) || []
    events.push({fn: fn, once: options.once})
    this._deps.set(event, events)
    console.log('_deps',  this._deps)
    return true
  }

  /**
   * Eqx作品调用触发事件通知
   * @param event
   */
  public notifyDep = (event: EqxLifeCycleEventName, ...args: any[]) => {
    const fns = this._deps.get(event) || []
    const refreshFns: ListenerFnObj[] = []
    fns.forEach((fnObj) => {
      const fn = fnObj.fn
      fn instanceof Function
        ? fn(...args)
        : console.warn('[EqxCustomManager ListenerSrv] Callback must be a function.')
      if (!fnObj.once) {
        refreshFns.push(fnObj)
      }
    })
    this._deps.set(event, refreshFns)
  }
  /**
   * 注销事件 
   * @param event 
   */
  public destroyDep = (event: EqxLifeCycleEventName) => {
    this._deps.delete(event)
  }
}
