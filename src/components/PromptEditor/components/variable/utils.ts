import { ValueSelector } from "@/components/PromptEditor/types"

export const isSystemVar = (valueSelector: ValueSelector) => {
  return valueSelector[0] === 'sys' || valueSelector[1] === 'sys'
}

export const isENV = (valueSelector: ValueSelector) => {
  return valueSelector[0] === 'env'
}
