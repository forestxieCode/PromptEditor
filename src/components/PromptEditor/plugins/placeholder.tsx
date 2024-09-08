import { memo } from 'react'
import cn from '@/components/PromptEditor/utils/classnames'

const Placeholder = ({
  compact,
  value,
  className,
}: {
  compact?: boolean
  value?: string
  className?: string
}) => {

  return (
    <div className={cn(
      className,
      'placeholder__node'
    )}>
      {value || '在这里写你的提示词，输入\'{\' 插入变量、输入\'/\' 插入提示内容块'}
    </div>
  )
}

export default memo(Placeholder)
