import { useMemo } from 'react'
import type {
  WorkflowVariableBlockType,
} from '../../types'

export const useOptions = (
  workflowVariableBlockType?: WorkflowVariableBlockType,
) => {
  const workflowVariableOptions = useMemo(() => {
    if (!workflowVariableBlockType?.show)
      return []

    return workflowVariableBlockType.variables || []
  }, [workflowVariableBlockType])
  
  return useMemo(() => {
    return {
      workflowVariableOptions,
    }
  }, [workflowVariableOptions])
}
