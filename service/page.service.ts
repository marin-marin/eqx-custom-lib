import EqxCustomMgrServ from "./base.service"
import CompService from "./comp.service"
import ListenerService from "./listener.service"
import { EqxScene, EqxPage } from '../types'

class CustomPage {
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
  public get pageId() {
    return this._oriPage.pageJson.id
  }
  // pageName
  private get pageName() {
    return this._oriPage.pageJson.name
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
  private _pageList: EqxPage = []

  /**
   * 初始化pageList
   */
  private initPageList() {
    this._eqxScene?.eqxPageList?.forEach((page: any= {}) => {
      this._pageList.push(new CustomPage(page))
    })
  }
  /**
   * 获取页面列表
   * @returns 
   */
  public getPageList = () => {
    return this._pageList
  }
  /**
   * 根据id获取页面
   */
  public getPageById = (id: number) => {
    if(!id) throw new Error("页面ID必传")
    return this._pageList.find((page: CustomPage) => page.pageId === id)
  }
}