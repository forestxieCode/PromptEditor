'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useBoolean } from 'ahooks'
import type { OffsetOptions, Placement } from '@floating-ui/react'
import { PortalToFollowElem, PortalToFollowElemContent, PortalToFollowElemTrigger } from '@/components/PromptEditor/components/portal-to-follow-elem'
export type TooltipProps = {
  position?: Placement
  triggerMethod?: 'hover' | 'click'
  popupContent: React.ReactNode
  children: React.ReactNode
  popupClassName?: string
  offset?: OffsetOptions
  asChild?: boolean
}


const Tooltip: FC<TooltipProps> = ({
  position = 'top',
  triggerMethod = 'hover',
  popupContent,
  children,
  popupClassName,
  offset,
  asChild,
}) => {
  const [open, setOpen] = useState(false)
  const [isHoverPopup, {
    setTrue: setHoverPopup,
    setFalse: setNotHoverPopup,
  }] = useBoolean(false)

  const isHoverPopupRef = useRef(isHoverPopup)
  useEffect(() => {
    isHoverPopupRef.current = isHoverPopup
  }, [isHoverPopup])

  const [isHoverTrigger, {
    setTrue: setHoverTrigger,
    setFalse: setNotHoverTrigger,
  }] = useBoolean(false)

  const isHoverTriggerRef = useRef(isHoverTrigger)
  useEffect(() => {
    isHoverTriggerRef.current = isHoverTrigger
  }, [isHoverTrigger])

  const handleLeave = (isTrigger: boolean) => {
    if (isTrigger)
      setNotHoverTrigger()

    else
      setNotHoverPopup()

    // give time to move to the popup
    setTimeout(() => {
      if (!isHoverPopupRef.current && !isHoverTriggerRef.current)
        setOpen(false)
    }, 500)
  }

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement={position}
      offset={offset ?? 10}
    >
      <PortalToFollowElemTrigger
        onClick={() => triggerMethod === 'click' && setOpen(v => !v)}
        onMouseEnter={() => {
          if (triggerMethod === 'hover') {
            setHoverTrigger()
            setOpen(true)
          }
        }}
        onMouseLeave={() => triggerMethod === 'hover' && handleLeave(true)}
        asChild={asChild}
      >
        {children}
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent
        style={{zIndex: '9999'}}
      >
        <div
          className={popupClassName}
          onMouseEnter={() => triggerMethod === 'hover' && setHoverPopup()}
          onMouseLeave={() => triggerMethod === 'hover' && handleLeave(false)}
        >
          {popupContent}
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default React.memo(Tooltip)
