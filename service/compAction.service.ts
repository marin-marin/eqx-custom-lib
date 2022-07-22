import { EqxComp, EqxCompJson } from '../types';
import { compType, EQX_FORM_COMP_TYPE } from '../const/h5';

const defaultAction = () => {
    console.warn('no update content method!');
};

export default class CustomCompAction {
    constructor(customComp: any = {}) {
        this._customComp = customComp;
    }
    private _customComp: any = {}
    
    private get _oriComp() {
      return this._customComp._oriComp
    }

    private get type() {
        return this._oriComp?.type;
    }
    private get _oriJson() {
        return this._oriComp?.compJson || {};
    }

    // 文本组件处理
    private handleEqxNewText(compJson: EqxCompJson) {
        // if (!compJson.content) return;
        this._oriComp?.updateContent?.(compJson.content) || defaultAction;
    }

    // 图片组件处理
    private handleEqxImage(compJson: EqxCompJson) {
        if (!compJson.src) return;
        const imageProp = {
            src: compJson?.src || '',
            originSrc: this._oriJson?.properties?.src,
        };
        this._oriComp?.editImage?.(imageProp) || defaultAction;
    }

    // 视频组件处理
    private handleEqxInteractiveVideo(compJson: EqxCompJson) {
        if (!compJson.src) return;
        const video = {
            src: compJson?.src || '',
        };
        this._oriComp?.updateVideoSource?.(video) || defaultAction;
    }

    // 下拉框组件处理
    private handleEqxDropDownList(compJson: EqxCompJson) {
        if (!compJson.choices) return;

        // 更新组件compJson的choices
        this._oriComp?.updateCompJsonChoicesOptions?.(compJson.choices);
        this._oriComp?.changeOption?.();
    }

    // 单选框和多选框按钮组件更新
    private handleEqxRadio(compJson: EqxCompJson) {
        if (!compJson.choices) return;

        // 更新组件compJson的choices
        this._oriComp?.updateCompJsonChoicesOptions?.(compJson.choices);
        this._oriComp?.updateOptions?.();
    }
    // 更新内容
    public updateContent(compJson: EqxCompJson): void {
        const action = {
            [compType.EqxNewText]: this.handleEqxNewText.bind(this),
            [compType.EqxImage]: this.handleEqxImage.bind(this),
            [compType.EqxInteractiveVideo]: this.handleEqxInteractiveVideo.bind(
                this
            ),
            [compType.EqxDropDownList]: this.handleEqxDropDownList.bind(this),
            [compType.EqxRadio]: this.handleEqxRadio.bind(this),
            [compType.EqxCheckbox]: this.handleEqxRadio.bind(this),
        };
        action?.[this.type]?.(compJson);
    }

    // 更新表单规则
    private updateFormValidateRule(prop: object) {
        // 1. 更改是否必填校验
        Object.assign(this._oriComp, prop);
        // 2，处理disabled
        const _c =
            prop.hasOwnProperty('disabled') &&
            this._oriComp?.handleSetContextDisabled;
        _c && this._oriComp?.handleSetContextDisabled();
    }

    // 更新视频封面啊
    private updateVideoProp(prop: object) {
        prop.hasOwnProperty('coverImg') && this._oriComp?.updatePosterImg(prop);
    }

    // 更新属性
    public updateAttr(prop: object) {
        const isFormComp = () => {
            return Object.values(EQX_FORM_COMP_TYPE)?.includes(this.type);
        };

        if (isFormComp()) {
            return this.updateFormValidateRule(prop);
        }
        const action = {
            [compType.EqxInteractiveVideo]: this.updateVideoProp.bind(this),
        };
        action?.[this.type]?.(prop);
    }
}
