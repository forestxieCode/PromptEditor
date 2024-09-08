import {
  Fragment,
  memo,
  useCallback,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import {
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react'
import type { TextNode } from 'lexical'
import type { MenuRenderFn } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import type {
  WorkflowVariableBlockType,
} from '../../types'
import { useBasicTypeaheadTriggerMatch } from '../../hooks'
import { INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND } from '../workflow-variable-block'
import { $splitNodeContainingQuery } from '../../utils'
import { useOptions } from './hooks'
import type { PickerBlockMenuOption } from './menu'
import VarReferenceVars from '@/components/PromptEditor/components/variable/var-reference-vars'

type ComponentPickerProps = {
  triggerString: string
  workflowVariableBlock?: WorkflowVariableBlockType
}
const ComponentPicker = ({
  triggerString,
  workflowVariableBlock,
}: ComponentPickerProps) => {
  const { refs, floatingStyles, isPositioned } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(0), // fix hide cursor
      shift({
        padding: 8,
      }),
      flip(),
    ],
  })
  const [editor] = useLexicalComposerContext()
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(triggerString, {
    minLength: 0,
    maxLength: 0,
  })

  const [queryString, setQueryString] = useState<string | null>(null)

  const {
    workflowVariableOptions,
  } = useOptions(
    workflowVariableBlock,
  )
  
  const onSelectOption = useCallback(
    (
      selectedOption: PickerBlockMenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        if (nodeToRemove && selectedOption?.key)
          nodeToRemove.remove()

        selectedOption.onSelectMenuOption()
        closeMenu()
      })
    },
    [editor],
  )

  const handleSelectWorkflowVariable = useCallback((variables: string[]) => {
    editor.update(() => {
      const needRemove = $splitNodeContainingQuery(checkForTriggerMatch(triggerString, editor)!)
      if (needRemove)
        needRemove.remove()
    })

    editor.dispatchCommand(INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND, variables)
    
  }, [editor, checkForTriggerMatch, triggerString])

  const renderMenu = useCallback<MenuRenderFn<PickerBlockMenuOption>>((
    anchorElementRef,
    { options },
  ) => {
    if (!(anchorElementRef.current && (workflowVariableBlock?.show)))
      return null
    refs.setReference(anchorElementRef.current)

    return (
      <>
        {
          ReactDOM.createPortal(
            <div className='component-picker-block-box'>
              <div
                className='component-picker-block__container'
                style={{
                  ...floatingStyles,
                  visibility: isPositioned ? 'visible' : 'hidden',
                  maxHeight: 'calc(1 / 3 * 100vh)',
                }}
                ref={refs.setFloating}
              >
                {
                  workflowVariableBlock?.show && (
                    <>
                      {
                        (!!options.length) && (
                          <div className='component-picker-block__show'></div>
                        )
                      }
                      <div className='component-picker-block__show-p'>
                        <VarReferenceVars
                          hideSearch={false}
                          vars={workflowVariableOptions}
                          onChange={(variables: string[]) => {
                            handleSelectWorkflowVariable(variables)
                          }}
                        />
                      </div>
                    </>
                  )
                }
              </div>
            </div>,
            anchorElementRef.current,
          )
        }
      </>
    )
  }, [workflowVariableBlock?.show, refs, isPositioned, floatingStyles, queryString, workflowVariableOptions, handleSelectWorkflowVariable])

  return (
    <LexicalTypeaheadMenuPlugin
      options={[]}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      anchorClassName='lexical-typeahead-menu-plugin'
      menuRenderFn={renderMenu}
      triggerFn={checkForTriggerMatch}
    />
  )
}

export default memo(ComponentPicker)
