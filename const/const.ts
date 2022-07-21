export const CmdMap = new Map([
    ['h5', ['toPage', 'nextPage', 'prevPage']],
    ['hd', ['toPage', 'startGame', ]],
    ['form', ['toCover', 'toResult', 'scroll']],
    ['lp', ['scroll']]
])

// h5作品 本地接口meta.type为h5, test或product环境frameMarker注入的为101
const h5_dev = 'h5'
const h5_pro = 101
// 互动作品
const hd = 'hd'
export const PRODUCT_TYPE = {
    h5: [h5_pro, h5_dev],
    hd
}