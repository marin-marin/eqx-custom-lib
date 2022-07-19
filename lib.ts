// import CompService from "./service/comp.service"
import PageService from "./service/page.service"
import ControlService from "./service/control.service"
import DialogService from "./service/dialog.service";
import ListenerService from "./service/listener.service"
import { EqxScene } from "./types";
import CompService from "./service/comp.service";

export default class EqxCustomManager {
    constructor () {
        this.listenerService = new ListenerService()
        this.DialogService = new DialogService()
        this.initGlobalObj()
    }

    private _id : string|number = ''

    public listenerService: ListenerService
    // public compService: CompService | null = null
    public PageService: PageService | null = null
    public DialogService: DialogService
    public compService: CompService | null = null
    public controlService: ControlService | null = null

    public init = (eqxScene: EqxScene) => {
        // this.compService = new CompService(eqxScene)
        this.PageService = new PageService(eqxScene)
        this.controlService = new ControlService(eqxScene)
        this.listenerService.initScene(eqxScene)

        this.initGlobalObj()
        this.initPostMsg()

        this._id = `Eqx_Cus_Mgr_#${Date.now().toString(16).substr(-4)}`
    }


    private initGlobalObj = () => {
        window['_EqxCustomManager'] = this
    }

    /**
     * 初始化 frame 嵌入的情况下的 srv 调用
     */
    private initPostMsg = () => {
        window.addEventListener('message', (e) => {
            switch (e.data.event) {
                case '':
                    break
            }
        })
    }
}