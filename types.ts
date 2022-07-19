export type EqxScene = any
export type EqxComp = any
export type EqxPage = any
export type EqxLifeCycleEventName = string

export interface EqxCompJson {
  'id'?: string, 
  'type'?: string,
  'choices'?: any,
  'content'?: string,
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
