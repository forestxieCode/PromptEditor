import {
  memo,
  useEffect,
  useState,
} from 'react'
import {
  COMMAND_PRIORITY_EDITOR,
} from 'lexical'
import { mergeRegister } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  RiErrorWarningFill,
} from '@remixicon/react'
import { useSelectOrDelete } from '../../hooks'
import type { WorkflowNodesMap } from './node'
import { WorkflowVariableBlockNode } from './node'
import {
  DELETE_WORKFLOW_VARIABLE_BLOCK_COMMAND,
  UPDATE_WORKFLOW_NODES_MAP,
} from './index'
import cn from '@/components/PromptEditor/utils/classnames'
import TooltipPlus from '@/components/PromptEditor/components/tooltip-plus'

const IconSVG = () => <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.1145 5.44523L3.06046 1.88397H6.95559L7.90155 5.44523" stroke="#099250" />
  <path d="M4.11774 2.99695H5.89837" stroke="#099250" />
  <path d="M3.72824 4.27692H6.2879" stroke="#099250" />
  <path d="M5.95395 5.44507C5.95395 5.94587 5.50879 6.39103 5.00799 6.39103C4.50718 6.39103 4.06203 5.94587 4.06203 5.44507H1.55801V7.55957C1.55801 7.89344 1.83624 8.11602 2.11446 8.11602H7.95716C8.29103 8.11602 8.5136 7.83779 8.5136 7.55957V5.44507H5.95395Z" stroke="#099250" />
</svg>

type WorkflowVariableBlockComponentProps = {
  nodeKey: string
  variables: string[]
  workflowNodesMap: WorkflowNodesMap
}

const WorkflowVariableBlockComponent = ({
  nodeKey,
  variables,
  workflowNodesMap = {},
}: WorkflowVariableBlockComponentProps) => {

  const [editor] = useLexicalComposerContext()
  const [ref, isSelected] = useSelectOrDelete(nodeKey, DELETE_WORKFLOW_VARIABLE_BLOCK_COMMAND)

  if(variables.length<=1) return
  const varName = (
    () => {
      return variables[1]
    }
  )()

  const [localWorkflowNodesMap, setLocalWorkflowNodesMap] = useState<WorkflowNodesMap>(workflowNodesMap)
  const node = localWorkflowNodesMap![variables[0]]

  useEffect(() => {
    if (!editor.hasNodes([WorkflowVariableBlockNode]))
      throw new Error('WorkflowVariableBlockPlugin: WorkflowVariableBlock not registered on editor')

    return mergeRegister(
      editor.registerCommand(
        UPDATE_WORKFLOW_NODES_MAP,
        (workflowNodesMap: WorkflowNodesMap) => {
          setLocalWorkflowNodesMap(workflowNodesMap)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  const Item = (
    <div
      className={cn(
        'workflow-variable-block',
        isSelected ? 'workflow-variable-block__select' : 'workflow-variable-block__un_select',
        !node  && 'workflow-variable-block_error',
      )}
      ref={ref}
    >
      <div className='workflow-variable-block__title-front'>
        {node?.title &&  <IconSVG></IconSVG> } 
        <div className='workflow-variable-block__title' title={node?.title} style={{
        }}> {node?.title}</div>
        <div className='workflow-variable-block__title_line'>|</div>
      </div>
      
      <div className='workflow-variable-block__title-last'>
        <div className='workflow-variable-block__last-name' title={varName}>{varName}</div>
        {
          !node && (
            <RiErrorWarningFill className='workflow-variable-block__last-error' />
          )
        }
      </div>
    </div>
  )

  if (!node) {
    return (
      <TooltipPlus popupContent={'无效变量'}>
        {Item}
      </TooltipPlus>
    )
  }

  return Item
}

export default memo(WorkflowVariableBlockComponent)
