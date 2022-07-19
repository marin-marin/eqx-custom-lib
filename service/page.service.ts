import EqxCustomMgrServ from "./base.service"
import CompService from "./comp.service"
import ListenerService from "./listener.service"
import { EqxScene, EqxPage } from '../types'

class customPage {
  constructor(oriPage: EqxPage) {
    this._oriPage = oriPage
    // _isRenderSuccess必须在compService前渲染
    this._isRenderSuccess = oriPage.eqxLayerList.length > 0 

    this.compService = new CompService(this)
    this.listenerService = new ListenerService()
  }
  private _oriPage: EqxPage
  public listenerService: ListenerService
  
  // pageId`u
  private get pageId() {
    return this._oriPage.pageJson.id
  }
  // pageName
  private get pageName() {
    return this._oriPage.pageJson.name
  } 
  // pageList中的页面索引， 从0开始计算
  private get pageIndex() {
    return this._oriPage.pageJson.num - 1
  }
  public compService: CompService | null = null
  // 渲染成功标志
  private _isRenderSuccess: Boolean = false

  public getPageRenderSign() {
    return this._isRenderSuccess
  }

  // 设置page渲染成功标志
  public setPageRenderSign(v: Boolean) {
    this._isRenderSuccess = v
  }

  public getOriginPage() {
    return this._oriPage
  }

  /**
   * 1.因为页面是异步渲染的， 页面渲染成功后当前库的组件要挂载的源eqxComp
   * 2. 执行用户更改事件
   * @returns 
   */
  handleSetCompServiceOriginComp() {
    if(this.getPageRenderSign()) return;

    // 1. 处理comp组件挂载源eqxComp
    this.compService?.saveEqxSourceComp(this).then(res => {
      console.log('处理comp组件挂载源eqxComp成功')
      this.setPageRenderSign(true)

      this.listenerService.notifyDep(this.pageId)
    }).catch(err => {

    })
  }
}

export default class PageService extends EqxCustomMgrServ {
  constructor (eqxScene: EqxScene) {
    super(eqxScene)

    this.initPageList()
  }
  public pageList: EqxPage = []

  /**
   * 初始化pageList
   */
  private initPageList() {
    this._eqxScene?.eqxPageList?.forEach((page: any= {}) => {
      this.pageList.push(new customPage(page))
    })
  }
  /**
   * 获取页面列表
   * @returns 
   */
    public getPageList = () => {
      return this.pageList
    }
}