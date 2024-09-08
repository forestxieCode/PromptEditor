'use client'

import type { FC } from 'react'
import type {
  EditorState,
} from 'lexical'
import {
  $getRoot,
  TextNode,
} from 'lexical'
import { CodeNode } from '@lexical/code'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import Placeholder from './plugins/placeholder'
import ComponentPickerBlock from './plugins/component-picker-block'
import {
  WorkflowVariableBlock,
  WorkflowVariableBlockNode,
  WorkflowVariableBlockReplacementBlock,
} from './plugins/workflow-variable-block'
import { VariableValueBlockNode } from './plugins/variable-value-block/node'
import { CustomTextNode } from './plugins/custom-text/node'
import OnBlurBlock from './plugins/on-blur-or-focus-block'
import { textToEditorState } from './utils'

import type {
  WorkflowVariableBlockType,
} from './types'
export type PromptEditorProps = {
  className?: string
  placeholder?: string
  placeholderClassName?: string
  style?: React.CSSProperties
  value?: string
  editable?: boolean
  onChange?: (text: string) => void
  onBlur?: () => void
  onFocus?: () => void
  workflowVariableBlock?: WorkflowVariableBlockType
}
import './index.css'

const PromptEditor: FC<PromptEditorProps> = ({
  className,
  placeholder,
  placeholderClassName,
  style,
  value,
  editable = true,
  onChange,
  onBlur,
  onFocus,
  workflowVariableBlock,
}) => {
  const initialConfig = {
    namespace: 'prompt-editor',
    nodes: [
      CodeNode,
      CustomTextNode,
      {
        replace: TextNode,
        with: (node: TextNode) => new CustomTextNode(node.__text),
      },
      WorkflowVariableBlockNode,
      VariableValueBlockNode,
    ],
    editorState: textToEditorState(value || ''),
    onError: (error: Error) => {
      throw error
    },
  }

  const handleEditorChange = (editorState: EditorState) => {
    const text = editorState.read(() => {
      return $getRoot().getChildren().map(p => p.getTextContent()).join('\n')
    })
    if (onChange)
      onChange(text)
  }

  return (
    <LexicalComposer initialConfig={{ ...initialConfig, editable }}>
      <div className='workflow-node-variable-text-input-field'>
        <RichTextPlugin
          contentEditable={<ContentEditable className={`${className} workflow-node-variable-text-input-field__rich-text`} style={style || {}} />}
          placeholder={<Placeholder value={placeholder} className={placeholderClassName} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ComponentPickerBlock
          triggerString='/'
          workflowVariableBlock={workflowVariableBlock}
        />
        <ComponentPickerBlock
          triggerString='{'
          workflowVariableBlock={workflowVariableBlock}
        />
        {
          workflowVariableBlock?.show && (
            <>
              <WorkflowVariableBlock {...workflowVariableBlock} />
              <WorkflowVariableBlockReplacementBlock {...workflowVariableBlock} />
            </>
          )
        }
        <OnChangePlugin onChange={handleEditorChange} />
        <OnBlurBlock onBlur={onBlur} onFocus={onFocus} />
      </div>
    </LexicalComposer>
  )
}

export default PromptEditor
