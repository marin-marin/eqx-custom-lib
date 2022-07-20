import StyleService from './style.service'
import '../types.ts'
import { EqxComp, EqxScene, EqxCompJson, EqxPage } from '../types'
import { compType, EQX_FORM_COMP_TYPE } from '../const/h5'
import { PRODUCT_TYPE } from '../const/const'

/**
 * 定制Comp
 */
class CustomComp {
  constructor(c: EqxComp | object, eqxPage: EqxPage) {
    // 如果当前的c存在compJson，则当前是完整的组件对象， 否则当前是compJson对象
    if(c && c.compJson) {
      this._oriComp = c
      this._oriJson = c.compJson
    }else {
      this._oriJson = c
    }

    this._eqxPage = eqxPage
    this._styleService = new StyleService(this)
  }
  private _oriComp: EqxComp = {}
  private _oriJson: any = {}
  private _eqxPage: EqxPage
  private _styleService: StyleService

  private get id() {
    return this._oriComp?.id || this._oriJson.id
  }
  private get type() {
    return this._oriComp?.type || this._oriJson.type
  }
  // 暂未使用
  private get editorType () {
    return this._oriComp?.eqxScene?.meta?.type || PRODUCT_TYPE.h5
  }
  // 设置originComp
  public handleSetOriginComp(oriComp: EqxComp) {
    this._oriComp = oriComp
  }
  /**
   * 更新组件内容
   * @param compJson 用户传递组件属性 @params: Object
   */
  public update(compJson: EqxCompJson): any {
    // 1. 当前页面没有渲染成功， 缓存后续执行
    if(!this._eqxPage.getPageRenderSign()){
      return this._eqxPage.listenerService.registerDep(this._eqxPage.pageId, this.update.bind(this, compJson));
    }

    // compJson.css && this.updateCompJsonCss(compJson.css)
    // compJson.properties && this.updateCompJsonAttr(compJson.properties)

    this.updateContent(compJson)
    // this.updateStyle(compJson.css)
    compJson.css && this._styleService.updateStyle(compJson.css)

    compJson.properties && this.updateAttr(compJson.properties)
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
      if(!compJson.choices) return;

      // 更新组件compJson的choices
      this._oriComp?.updateCompJsonChoicesOptions?.(compJson.choices)
      this._oriComp?.changeOption?.()
    }

    // 单选框和多选框按钮组件更新
    const handleEqxRadio = (compJson: EqxCompJson) => {
      if(!compJson.choices) return

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

    const handleEqxNewTextStyle = (style: any = {}) => {
      // 暂不兼容height 和 lineHeight 和 position等属性处理
      this._oriComp?.update$ContentCss?.(style)
    }

    const handleImageStyle = (style: any = {}) => {
      const oldStyle = {}
      this._oriComp?.updateSize?.(oldStyle, style)
    }

    const action = {
      [compType.EqxNewText]: handleEqxNewTextStyle,
      [compType.EqxImage]: handleImageStyle,
      [compType.EqxInteractiveVideo]: handleImageStyle,
    }

    action?.[this.type]?.(style) 
  }

  // 更新属性
  public updateAttr(prop: object) {
    const updateFormValidateRule = (prop: object) => {
      // 1. 更改是否必填校验
     Object.assign(this._oriComp, prop);
     // 2，处理disabled
     const _c = prop.hasOwnProperty('disabled') && this._oriComp.handleSetContextDisabled
     _c && this._oriComp.handleSetContextDisabled()
    }

    const isFormComp = () => {
      return Object.values(EQX_FORM_COMP_TYPE)?.includes(this.type)
    }

    if(isFormComp()) {
      return updateFormValidateRule(prop)
    }
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

export default class CompService {
  constructor (eqxPage: EqxPage) {
    this._eqxPage = eqxPage

    if(eqxPage.getPageRenderSign()) {
      this.transH5CompsByLayerList(eqxPage.getOriginPage())
    }else {
      this.transH5CompsByPageJson(eqxPage.getOriginPage())
    }
  }
  private _eqxPage: EqxPage
  public compList: CustomComp[] = []

  public transH5CompsByLayerList = (eqxPage: EqxPage) => {
    if(eqxPage.eqxScene?.meta?.type !== PRODUCT_TYPE.h5) return
    
    eqxPage.eqxLayerList.forEach((layer: any) => {
      layer.eqxItems.forEach((comp: EqxComp) => {
            this.transAndSave(comp)
        })
    })
  }

  public transH5CompsByPageJson = (eqxPage: EqxPage) => {
    if(eqxPage.eqxScene?.meta?.type !== PRODUCT_TYPE.h5) return
    
    eqxPage.pageJson && eqxPage.pageJson.elements.forEach((compJson: any = {}) => {
      this.transAndSave(compJson)
    })
  }

  /**
   * 在compService中的comp组件存储 源comp(h5作品对应的comp)
   * @param eqxPage 
   */
  public saveEqxSourceComp(eqxPage: EqxPage) {
    return new Promise((resolve, reject) => {
      // 获取eqx的page
      const eqxSourcePage =  eqxPage.getOriginPage()
      if(!eqxSourcePage) {
        reject(new Error('未挂载源页面'))
      } 
      
      eqxSourcePage.eqxLayerList.forEach((layer: any) => {
        layer.eqxItems.forEach((comp: EqxComp, index: number) => {
            // 数组一一映射  
            this.compList?.[index]?.handleSetOriginComp(comp)
          })
      })
      resolve(true)
    })
  }

  /**
   * 将 Eqx组件 转化为 CustomComp 的方法
   * @param oriComp
   * @returns
   */
  private _transComp: (EqxComp: EqxComp) => CustomComp = oriComp => {
    return new CustomComp(oriComp, this._eqxPage)
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
   * 
   * 更新组件内容
   * @param ids string | string[]
   * @param compJson EqxCompJson
   *
   */
  public update(ids: string | string[], compJson: EqxCompJson) {
    // 1. 当前页面渲染成功， 直接执行
    if(this._eqxPage.getPageRenderSign()){
      return this.updateCompsContent(ids, compJson);
    }
    // 2. 缓存用户的update函数， 等渲染成功之后再执行
    this._eqxPage.listenerService.registerDep(this._eqxPage.pageId, this.update.bind(this, ids, compJson));
  }
  /**
   * 更新组件内容
   * @param ids 
   * @param compJson 
   */
  private updateCompsContent = (ids: string | string[], compJson: EqxCompJson) => {
    // 多个组件批量更新
    if(Array.isArray(ids)){
      return this.compList.forEach((comp: any = {}) => {
        ids.includes(comp.id) && (comp.update(compJson))
      })
    }
    // 单个组件更新
    const targetComp = this.compList.find((x: any = {}) => x.id === ids)
    targetComp && targetComp.update(compJson)
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
