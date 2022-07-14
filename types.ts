export type EqxScene = any
export type EqxComp = any
export type EqxLifeCycleEventName = string

export type EqxCompType = {
  'EqxNewText': null | 'string', 
  'EqxImage': null | 'string',
  'EqxInteractiveVideo': null | 'string',
}
export interface EqxCompJson {
  'content'?: 'string',
  'css'?: any,
  'properties'?: any,
  'src'?: string
}


export type PostMsgCmd = 
    'COMP_STYLE' |
    'COMP_CONTENT' |
    'COMP_BIND_EVENT' |
    'CONTROL_EXEC' |
    ''

    declare global {
        interface Window { EqxCustomManager: any; _EqxCustomManager: any; }
      }
