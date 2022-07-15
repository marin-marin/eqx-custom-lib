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
   * @param compJson 用户传递组件属性 @params: Object
   */
  public updateCompContent(compJson: EqxCompJson) {
    // 1. 存在css属性， 则融合css样式，不是替代
    compJson.css && this.updateCompJsonCss(compJson.css)
    // 更新组件properties
    compJson.properties && this.updateCompJsonAttr(compJson.properties)

    this.updateContent(compJson)
    this.updateStyle(compJson.css)
  }
  private updateCompJsonCss(css: any = {}) {
    this._oriComp?.updateCompJsonCss(css)
  }
  private updateCompJsonAttr (prop: any = {}) {
    this._oriComp?.updateCompJsonProperties(prop)
  }

  // 更新内容
  private updateContent(compJson: EqxCompJson): void {
    // ...
    const defaultAction = () => {console.warn('no update content method!')}
    
    // 文本组件处理
    const handleEqxNewText = (compJson: EqxCompJson) => {
      if(!compJson.content) return
      this._oriComp.updateContent?.(compJson.content) || defaultAction
    }

    // 图片组件处理
    const handleEqxImage = (compJson: EqxCompJson) => {
      if(!compJson.src) return
      const imageProp = {
        src: compJson?.src || '',
        originSrc: this._oriJson?.properties?.src
      }
      this._oriComp.editImage?.(imageProp) || defaultAction
    }

    // 视频组件处理
    const handleEqxInteractiveVideo = (compJson: EqxCompJson) => {
      if(!compJson.src) return
      const video = {
        src: compJson?.src || '',
      }
      this._oriComp.updateVideoSource?.(video) || defaultAction
    }

    // 下拉框组件处理
    const handleEqxDropDownList = (compJson: EqxCompJson) => {
      // 更新组件compJson的choices
      this._oriComp?.updateCompJsonChoicesOptions?.(compJson.choices)
      this._oriComp?.changeOption?.()
    }

    // 单选框和多选框按钮组件更新
    const handleEqxRadio = (compJson: EqxCompJson) => {
      // 更新组件compJson的choices
      this._oriComp?.updateCompJsonChoicesOptions?.(compJson.choices)
      this._oriComp?.updateOptions?.()
    }

    const action = {
      [compType.EqxNewText]: handleEqxNewText,
      [compType.EqxImage]: handleEqxImage,
      [compType.EqxInteractiveVideo]: handleEqxInteractiveVideo,
      [compType.EqxDropDownList]: handleEqxDropDownList,
      [compType.EqxRadio]: handleEqxRadio,
      [compType.EqxCheckbox]: handleEqxRadio,
    }

    action?.[this.type]?.(compJson)
  }
  // 更新样式
  public updateStyle(style: object): void {
    const defaultAction = () => {console.warn('no update css method!');}

    const handleEqxNewTextStyle = (style: any = {}) => {
      this._oriComp?.update$ContentCss?.(style)
    }

    const handleImageStyle = (style: any = {}) => {
      const oldStyle = {}
      this._oriComp?.updateSize?.(oldStyle, style)
    }

    const action = {
      [compType.EqxNewText]: handleEqxNewTextStyle,
      [compType.EqxImage]: handleImageStyle,
    }

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
  /**
   * 更新组件内容
   * @param ids 
   * @param compJson 
   */
  public updateCompsContent = (ids: string | string[], compJson: EqxCompJson) => {
    // 多个组件批量更新
    if(Array.isArray(ids)){
      return this.compList.forEach((comp: any = {}) => {
        ids.includes(comp.id) && (comp.updateCompContent(compJson))
      })
    }
    // 单个组件更新
    const targetComp = this.compList.find((x: any = {}) => x.id === ids)
    targetComp && targetComp.updateCompContent(compJson)
  }
  /**
   * 绑定组件事件
   * @param ids 
   * @param eventName 
   * @param fn 
   * @param isReset 
   */
  public bindCompsEvent = (ids: string | string[], eventName: string, fn: Function, isReset: boolean = false) => {
      // 多个组件批量更新
      if(Array.isArray(ids)){
        return this.compList.forEach((comp: any = {}) => {
          ids.includes(comp.id) && (comp.bindEvent(eventName, fn, isReset))
        })
      }
      // 单个组件更新
      const targetComp = this.compList.find((x: any = {}) => x.id === ids)
      targetComp && targetComp.bindEvent(eventName, fn, isReset)
  }
}
