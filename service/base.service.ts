import { CmdMap } from '../const/const'
import { EqxScene } from '../types'

class CustomScene {
  constructor(eqxScene: EqxScene) {
    this._eqxScene = eqxScene
  }
  protected _eqxScene: EqxScene = null

  // 场景基础信息
  get sceneType() {
    return this._eqxScene.meta.type
  }
  get sceneId() {
    return this._eqxScene.meta.id
  }
  get sceneCode() {
    return this._eqxScene.meta.code
  }
  get cmdList () {
    return CmdMap.get(this.sceneType) || []
  }

  // TODO: 分化不同编辑器的能力
  execCustomCmd (cmdName: string) {
    if (cmdName in this.cmdList) {
      this._eqxScene.execCmd(cmdName)
    } else {
      console.warn('[EqxCustomManager] Cmd Not Supported!')
    }
  }
}

export default class EqxCustomMgrServ {
  constructor(eqxScene?: EqxScene) {
    eqxScene && this.initScene(eqxScene)
  }
  protected scene: CustomScene | null = null
  protected _eqxScene: EqxScene

  public initScene = (eqxScene: EqxScene) => {
    this._eqxScene = eqxScene
    this.scene = new CustomScene(eqxScene)
  }
}
