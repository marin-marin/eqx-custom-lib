import { DialogOptions } from '../types'
import EqxCustomMgrServ from './base.service'
import '../component/dialog/dialog.scss'

// 关闭SVG
const strCloseSvg =
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><path d="M116.152,99.999l36.482-36.486c2.881-2.881,2.881-7.54,0-10.42 l-5.215-5.215c-2.871-2.881-7.539-2.881-10.42,0l-36.484,36.484L64.031,47.877c-2.881-2.881-7.549-2.881-10.43,0l-5.205,5.215 c-2.881,2.881-2.881,7.54,0,10.42l36.482,36.486l-36.482,36.482c-2.881,2.881-2.881,7.549,0,10.43l5.205,5.215 c2.881,2.871,7.549,2.871,10.43,0l36.484-36.488L137,152.126c2.881,2.871,7.549,2.871,10.42,0l5.215-5.215 c2.881-2.881,2.881-7.549,0-10.43L116.152,99.999z"/></svg>'

class CusDialog {
  constructor(options: DialogOptions) {
    this.init(options)
  }

  private closeMode = 'hide'
  private mounted = false
  private options:DialogOptions = { content: '弹窗' }

  public element: {
    [key: string]: HTMLElement
  } = {}
  public params: DialogOptions = { content: '弹窗' }
  public callback: {
    show?: Function
    hide?: Function
    remove?: Function
  } = {}
  public display: boolean = false

  init(options: DialogOptions) {
    const defaults = {
      title: '',
      // 不同类别的内容类型
      content: '',
      // 弹框的宽度
      width: '',
      // 弹框高度
      height: 'auto',
      showClose: false,
      animation: true,
      // 不同类别的默认按钮
      buttons: [
        {
          value: '确定',
          events: {
            click: () => {
              this.hide()
            },
          },
        },
      ],
      // 弹框显示、隐藏、移除的回调
      onShow: function () {},
      onHide: function () {},
      onRemove: function () {},
    }
    const opt = Object.assign({}, defaults, options)
    this.options = opt
    const $dialog = document.createElement('dialog')
    $dialog.open = false
    $dialog.classList.add('cus-dialog')
    // 弹框主体
    const eleDialog = document.createElement('div')
    eleDialog.classList.add('cus-dialog__wrap')
    // 设置尺寸和键盘访问特性
    // 如果宽度设置的是纯数值，则认为是px单位
    if (/^\d+$/.test(opt.width)) {
      eleDialog.style.width = opt.width + 'px'
    } else {
      eleDialog.style.width = opt.width
    }
    // 高度
    if (/^\d+$/.test(opt.height)) {
      eleDialog.style.height = opt.height + 'px'
    } else if (opt.height == 'stretch') {
      eleDialog.classList.add('cus-dialog__wrap-stretch')
    } else if (opt.height != 'auto') {
      eleDialog.style.height = opt.height
    }

    // 标题
    const eleTitle = document.createElement('h4')
    eleTitle.classList.add('cus-dialog__title')
    eleTitle.innerHTML = opt.title

    // 关闭按钮
    // 随机id，ESC快捷键关闭弹框用到
    const strIdClose = ('cus-dialog_' + Math.random()).replace('0.', '')
    // 关闭按钮元素创建
    const eleClose = document.createElement('button')
    eleClose.setAttribute('id', strIdClose)
    eleClose.classList.add('cus-dialog__close')
    eleClose.classList.add('ESC')
    eleClose.innerHTML = strCloseSvg
    opt.showClose && eleDialog.appendChild(eleClose)

    // 主体内容
    const dataContent = opt.content

    // 基于内容的数据类型，使用不同的默认的弹框关闭方式
    this.closeMode = 'hide'

    // 主体内容元素
    const eleBody = document.createElement('div')
    eleBody.classList.add('cus-dialog__body')

    eleBody.innerHTML = dataContent

    // 底部元素
    const eleFooter = document.createElement('div')
    eleFooter.classList.add('cus-dialog__footer')

    // 头部icon
    const eleHeaderIcon = document.createElement('div')
    if (opt.iconType) {
      const iconMap = {
        success: `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
        </svg>`,
        error: `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
          <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
        </svg>`,
        warning: `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
          <path d="M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"></path>
        </svg>`,
        default: `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
          <path d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"></path>
        </svg>`
      }
      eleHeaderIcon.classList.add('cus-dialog__icon')
      eleHeaderIcon.classList.add(opt.iconType)
      eleHeaderIcon.innerHTML = iconMap[opt.iconType] || ''
    } else {
      eleHeaderIcon.hidden = true
    }

    // 组装
    eleDialog.appendChild(eleHeaderIcon)
    eleDialog.appendChild(eleTitle)
    eleDialog.appendChild(eleBody)
    eleDialog.appendChild(eleFooter)

    $dialog.appendChild(eleDialog)
    // 暴露元素
    this.element = {
      container: $dialog,
      dialog: eleDialog,
      title: eleTitle,
      body: eleBody,
      footer: eleFooter,
    }
    opt.showClose && (this.element['close'] = eleClose)
    // 暴露一些参数
    this.params = {
      title: opt.title,
      width: opt.width,
      buttons: opt.buttons,
      content: dataContent,
    }

    this.callback = {
      show: opt.onShow,
      hide: opt.onHide,
      remove: opt.onRemove,
    }

    this.display = false

    // 按钮处理
    this.button()

    // 事件
    this.events()

    if (dataContent) {
      this.show()
    }
  }

  button() {
    this.params.buttons?.forEach((objButton, numIndex) => {
      // objButton可能是null等
      objButton = objButton || {}

      // 按钮类型和值的处理
      let strType = objButton.type
      let strValue = objButton.value

      if (strType == 'remind' || (!strType && numIndex == 0)) {
        strType = 'primary'
      }

      if (!strValue) {
        strValue = ['确定', '取消'][numIndex]
      }

      const eleButton = document.createElement('button')
      // 自定义的类名
      if (objButton.className) {
        eleButton.className = objButton.className
      }
      // 按钮样式
      eleButton.classList.add('cus-dialog__button')
      if (strType) {
        eleButton.setAttribute('data-type', strType)
      }
      // 按钮内容
      eleButton.innerHTML = strValue

      // 放在底部元素中
      this.element.footer?.appendChild(eleButton)

      // 对外暴露
      this.element['button' + numIndex] = eleButton

      let objEvents = objButton.events || {
        click: function () {}.bind(this),
      }

      if (typeof objEvents == 'function') {
        objEvents = {
          click: objEvents,
        }
      }

      for (let strEventType in objEvents) {
        eleButton.addEventListener(strEventType, (event: any) => {
          // 把实例对象传入
          event.dialog = this
          // 事件执行
          objEvents[strEventType](event)
        })
      }
    })
  }
  events() {}
  show() {
    this.element.container.classList.add('cus-dialog-animation')
    this.element.container.setAttribute('open', '1')
    if (!this.mounted) {
      document.body.appendChild(this.element.container)
      this.element.container.addEventListener('animationend', () => {
        this.element.container.classList.remove('cus-dialog-animation')
        this.element.container.classList.remove('cus-dialog-animation__close')
      })
      this.mounted = true
    }
    this.callback.show?.()
  }
  hide(cb = true) {
    if (this.options.animation) {
      this.element.container.classList.add('cus-dialog-animation__close')
      setTimeout(() => {
        this.element.container.removeAttribute('open')
      }, 200);
    } else {
      this.element.container.removeAttribute('open')
    }
    cb && this.callback.hide?.()
  }
  destroy() {
    this.mounted = false
    this.hide(false)
    if (this.options.animation) {
      setTimeout(() => {
        document.body.removeChild(this.element.container)
      }, 200)
    } else {
      document.body.removeChild(this.element.container)
    }
    this.callback.remove?.()
  }
}

export default class DialogService extends EqxCustomMgrServ {
  constructor() {
    super()
  }
  private dialogStack: CusDialog[] = []
  public showDialog(options: DialogOptions) {
    const d = new CusDialog(options)
    this.dialogStack.push(d)
    return d
  }
  public closeDialog(destroy: boolean) {
    this.dialogStack.forEach(d => {
      destroy ? d.destroy() : d.hide()
    })
    destroy && this.dialogStack.splice(0, this.dialogStack.length)
  }
}
