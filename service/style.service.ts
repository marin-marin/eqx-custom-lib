import { EqxComp } from '../types'
import { compType, COMP_CONTAINER_STYLES, COMP_ELEMENT_BOX_STYLES } from '../const/h5'

export default class CustomStyle {
  constructor(customComp: any = {}) {
    this._customComp = customComp;
  }
  private _customComp: any = {}
  
  private get _oriComp() {
    return this._customComp._oriComp
  }

  private get type() {
    return this._oriComp.type
  }

  private handleSeperateStyle(style: any = {}) {
      // 暂时只分离组件最外层$li和最内层元素的样式
      const containerStyle:any = {}
      const elementBoxStyle:any = {}
      const contentStyle:any = {}

      Object.keys(style).forEach((key: string) => {
        if (COMP_CONTAINER_STYLES.includes(key)) {
          containerStyle[key] = style[key]
        } else if (COMP_ELEMENT_BOX_STYLES.includes(key)) {
          elementBoxStyle[key] = style[key]
        }
        else {
          contentStyle[key] = style[key]
        }
      })

      return { containerStyle, elementBoxStyle, contentStyle }
    }

  public updateStyle(style: object) {
    const { containerStyle, elementBoxStyle, contentStyle } = this.handleSeperateStyle(style)
    // 处理$li样式
    Object.keys(containerStyle).length && this._oriComp?.update$li(containerStyle)
    // 处理element-box样式
    Object.keys(elementBoxStyle).length && this._oriComp?.update$boxDiv(elementBoxStyle)

    // 处理element样式
    this._updateElementStyle(style, contentStyle)
  }

  // 更新元素样式
  private _updateElementStyle(allStyle: any = {}, contentStyle: any = {}) {
    // 文本组件处理
    const handleEqxNewTextStyle = (allStyle: any = {}, contentStyle: any = {}) => {
      if(!Object.keys(contentStyle).length) return
      this._oriComp?.update$ContentTextCss?.(contentStyle)
    }
    
    
    // 图片组件样式处理
    const handleImageStyle = (allStyle: any = {}, contentStyle: any = {}) => {
      // 存在width和height属性, 赋值到contentStyle
      if(allStyle.width || allStyle.height) {
        Object.assign(contentStyle, {width: allStyle.width, height: allStyle.height})
      }

      if(!Object.keys(contentStyle).length) return
      const oldStyle = {}
      this._oriComp?.updateSize?.(oldStyle, contentStyle)
    }

    const action = {
      [compType.EqxNewText]: handleEqxNewTextStyle,
      [compType.EqxImage]: handleImageStyle,
      // [compType.EqxInteractiveVideo]: handleImageStyle,
    }
    action?.[this.type]?.(allStyle, contentStyle) 
  }
}

