import EqxCustomMgrServ from "./base.service"

export default class ControlService extends EqxCustomMgrServ {
    public execCmd = (cmdName: string, args: any) => {
      this.scene?.execCustomCmd(cmdName, args)
    }

    /**
     * 翻页命令
     * @param toPage 
     */
    private scrollPage = (toPage: number) => {
      this.scene?.cmdList.includes('toPage') && this._eqxScene.pageScroll.asyncGoToPageByIndex(toPage - 1)
    }

    // TODO: 其他类型命令 (开始游戏/前一页/后一页等)
  }