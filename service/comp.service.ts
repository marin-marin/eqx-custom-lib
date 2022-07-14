import EqxCustomMgrServ from './base.service'
import '../types.ts'
import { EqxComp, EqxScene, EqxCompJson } from '../types'
import { compType } from '../const/h5'

/**
 * 定制Comp
 */
class CustomComp {
  constructor(oriComp: EqxComp) {
    this._oriComp = oriComp
  }
  private _oriComp: EqxComp
  private get _oriJson() {
    return this._oriComp.compJson
  }
  private get id() {
    return this._oriComp.id
  }
  private get type() {
    return this._oriComp.type
  }
  private get editorType () {
    return this._oriComp.eqxScene.meta.type
  }
  /**
   * 更新组件内容
   * @param compJson 组件属性 @params: Object
   */
  public updateCompContent(compJson: EqxCompJson) {
    if(compJson.hasOwnProperty('content')) {
      this.updateContent(compJson.content)
    }
    if(compJson.hasOwnProperty('css')) {
      this.updateStyle(compJson.css)
    }
    if(compJson.hasOwnProperty('properties')) {
      const prop = compJson['properties']
      prop.src && this.updateContent(prop.src)
    }
    if(this.type === compType.EqxInteractiveVideo){
      compJson.hasOwnProperty('src') && this.updateContent(compJson.src)
    }

  }

  // 更新内容
  updateContent(content: string | undefined): void {
    // ...
    const defaultAction = () => {console.warn('no update content method!')}
    const action = {
      [compType.EqxNewText]: this._oriComp.updateContent?.bind(this._oriComp) || defaultAction,
      [compType.EqxImage]: this._oriComp.replaceImageSrc?.bind(this._oriComp) || defaultAction,
      [compType.EqxInteractiveVideo]: this._oriComp.replaceImageSrc?.bind(this._oriComp) || defaultAction,
    }
    // const oriUpdateContent = this._oriComp.updateContent.bind(this._oriComp) || (() => {console.warn('no update content method!')})
    // oriUpdateContent(content)
    action?.[this.type]?.(content)
  }
  updateAttr () {}
  // 更新样式
  updateStyle(style: any = {}) {
    const defaultAction = () => {console.warn('no update css method!');}
    const action = {
      [compType.EqxNewText]: this._oriComp.update$ContentCss.bind(this._oriComp) || defaultAction,
      [compType.EqxImage]: (style: any = {}) => {
        const oriUpdateCss = this._oriComp.updateSize?.bind(this._oriComp) || defaultAction
        const oldStyle = {}
        oriUpdateCss(oldStyle, style)
      },
    }
    // // ...
    // const oriUpdateCss = this._oriComp.update$ContentCss.bind(this._oriComp) || (() => {
    //   console.warn('no update css method!');
    // });
    // oriUpdateCss(style);
    action?.[this.type]?.(style)
  }
  /**
   * 绑定事件
   * @param eventName
   * @param fn
   * @param {boolean} isReset 是否清除已有(之前用户自己绑过的)的事件
   */
  bindEvent(eventName: string, fn: Function, isReset: boolean = false) {
    // ...
    const $li = this._oriComp.$li
    if (!$li) return
    if (isReset) $li.unbind(eventName)
    $li.bind(eventName, fn)
  }
}

export default class CompService extends EqxCustomMgrServ {
  constructor (eqxScene: EqxScene) {
    super(eqxScene)
    
    // TODO: 区分不同编辑器的组件转化
    // page -> layer -> comp 转化
    this._eqxScene.eqxPageList.forEach((page: any) => {
        page.eqxLayerList.forEach((layer: any) => {
            layer.eqxItems.forEach((comp: EqxComp) => {
                this.transAndSave(comp)
            })
        })
    })
  }

  public compList: CustomComp[] = []

  /**
   * 将 Eqx组件 转化为 CustomComp 的方法
   * @param oriComp
   * @returns
   */
  private _transComp: (EqxComp: EqxComp) => CustomComp = oriComp => {
    return new CustomComp(oriComp)
  }

  public transAndSave = (oriComp: EqxComp) => {
    this.compList.push(this._transComp(oriComp))
  }
  /**
   * 获取组件列表
   * @returns 
   */
  public getCompList = () => {
    return this.compList
  }
}
