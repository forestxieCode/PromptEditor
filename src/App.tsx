import { useState } from "react"
import { NodeVariables } from "./components/PromptEditor/types"
import PromptEditor from "./components/PromptEditor"
import { getWorkflowNodesMap } from "./components/PromptEditor/utils"

const controlPromptEditorRerenderKey = Date.now()
const nodesOutputVars: NodeVariables[] = [
  {
    "id": "node1",
    "name": "test1",
    "variables": [
      {
        "name": "user_input_str",
        "type": "string"
      },{
        "name": "user_input_int",
        "type": "integer"
      }  
    ]
  },{
    "id": "node2",
    "name": "test2",
    "variables": [
      {
        "name": "user_input_str",
        "type": "string"
      },{
        "name": "user_input_int",
        "type": "integer"
      }  
    ]
  }
]
function App() {
  const [value, setValue] = useState(`123123{{#node1.user_input_str#}}{{#node2.user_input_int#}}`)
  const workflowNodesMap = getWorkflowNodesMap(nodesOutputVars)

  const handleChangeValue = (val:string) => {
    console.log(val)
  }

  return (
    <>
     <PromptEditor
      key={controlPromptEditorRerenderKey}
      value={value}
      placeholder={'请输入' || ''}
      workflowVariableBlock={{
        show: true,
        variables: nodesOutputVars || [],
        workflowNodesMap
      }}
      onChange={handleChangeValue}
    />
    </>
  )
}

export default App
