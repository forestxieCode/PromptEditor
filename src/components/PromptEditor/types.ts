import type {
  Node as ReactFlowNode,
} from 'reactflow'

export type ToolDefaultValue = {
  provider_id: string
  provider_type: string
  provider_name: string
  tool_name: string
  tool_label: string
  title: string
}

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  VariableAggregator = 'variable-aggregator',
  Tool = 'tool',
  ParameterExtractor = 'parameter-extractor',
  Iteration = 'iteration',
}

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export type Branch = {
  id: string
  name: string
}

export type CommonNodeType<T = {}> = {
  _connectedSourceHandleIds?: string[]
  _connectedTargetHandleIds?: string[]
  _targetBranches?: Branch[]
  _isSingleRun?: boolean
  _runningStatus?: NodeRunningStatus
  _singleRunningStatus?: NodeRunningStatus
  _isCandidate?: boolean
  _isBundled?: boolean
  _children?: string[]
  _isEntering?: boolean
  _showAddVariablePopup?: boolean
  _holdAddVariablePopup?: boolean
  _iterationLength?: number
  _iterationIndex?: number
  isIterationStart?: boolean
  isInIteration?: boolean
  iteration_id?: string
  selected?: boolean
  title: string
  desc: string
  type: BlockEnum
  width?: number
  height?: number
} & T & Partial<Pick<ToolDefaultValue, 'provider_id' | 'provider_type' | 'provider_name' | 'tool_name'>>

export type Var = {
  variable: string
  type: VarType
  children?: Var[] // if type is obj, has the children struct
  isParagraph?: boolean
  isSelect?: boolean
  options?: string[]
  required?: boolean
}

export enum VarType {
  string = 'string',
  number = 'number',
  secret = 'secret',
  boolean = 'boolean',
  object = 'object',
  array = 'array',
  arrayString = 'array[string]',
  arrayNumber = 'array[number]',
  arrayObject = 'array[object]',
  arrayFile = 'array[file]',
  any = 'any'
}

export type ValueSelector = string[]

export type Node<T = {}> = ReactFlowNode<CommonNodeType<T>>

export type NodeOutPutVar = {
  nodeId?: string
  title?: string
  vars?: Var[]
  isStartNode?: boolean

  // 新增的属性
  id?: string
  name: string
  type?: string
  variables?: NodeVariables[]
}

export type Option = {
  value: string
  name: string
}

export type ExternalToolOption = {
  name: string
  variableName: string
  icon?: string
  icon_background?: string
}

export type WorkflowVariableBlockType = {
  show?: boolean
  variables?: NodeOutPutVar[]
  workflowNodesMap?: Record<string, Pick<Node['data'], 'title' >>
  onInsert?: () => void
  onDelete?: () => void
}

export type MenuTextMatch = {
  leadOffset: number
  matchingString: string
  replaceableString: string
}

export enum InputVarType {
  textInput = 'text-input',
  paragraph = 'paragraph',
  select = 'select',
  number = 'number',
  url = 'url',
  files = 'files',
  json = 'json', // obj, array
  contexts = 'contexts', // knowledge retrieval
  iterator = 'iterator', // iteration input
}

export enum VarKindType {
  variable = 'variable',
  constant = 'constant',
  mixed = 'mixed',
}

export type Variable = {
  variable: string
  label?: string | {
    nodeType: BlockEnum
    nodeName: string
    variable: string
  }
  value_selector: ValueSelector
  variable_type?: VarKindType
  value?: string
  options?: string[]
  required?: boolean
  isParagraph?: boolean
}

// new Type 
export type NodeVariables = {
  id?: string
  name: string
  type?: string
  variables?: NodeVariables[]
}








