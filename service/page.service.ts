import EqxCustomMgrServ from "./base.service"
import CompService from "./comp.service"
import { EqxScene, EqxPage } from '../types'

class customPage {
  constructor(oriPage: EqxPage) {
    this._oriPage = oriPage
    this.compService = new CompService(oriPage)
    this._isRenderSuccess = oriPage.eqxLayerList.length > 0
  }
  private _oriPage: EqxPage
  // pageId
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
  // 设置page渲染成功标志
  public setPageRenderSign(v: Boolean) {
    this._isRenderSuccess = v
  }
  // 设置页面的原有comp
  handleSetPageOriginComp() {

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