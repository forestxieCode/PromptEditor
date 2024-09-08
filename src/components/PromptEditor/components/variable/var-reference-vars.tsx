'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useBoolean, useHover } from 'ahooks'
import cn from '@/components/PromptEditor/utils/classnames'
import { ValueSelector, NodeVariables } from '@/components/PromptEditor/types'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/components/PromptEditor/components/portal-to-follow-elem'

type ObjectChildrenProps = {
  nodeId: string
  data: NodeVariables[]
  onChange: (value: ValueSelector, item: NodeVariables) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
}

type ItemProps = {
  nodeId: string
  itemData: NodeVariables
  onChange: (value: ValueSelector, item: NodeVariables) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
}

const Item: FC<ItemProps> = ({
  nodeId,
  itemData,
  onChange,
  onHovering,
  itemWidth,
}) => {
  const isChildren = itemData.variables && itemData.variables.length
  const itemRef = useRef(null)
  const [isItemHovering, setIsItemHovering] = useState(false)
  const _ = useHover(itemRef, {
    onChange: (hovering) => {
      if (hovering) {
        setIsItemHovering(true)
      }
      else {
        if (isChildren) {
          setTimeout(() => {
            setIsItemHovering(false)
          }, 100)
        }
        else {
          setIsItemHovering(false)
        }
      }
    },
  })
  const [isChildrenHovering, setIsChildrenHovering] = useState(false)
  const isHovering = isItemHovering || isChildrenHovering
  const open = isChildren && isHovering
  useEffect(() => {
    onHovering && onHovering(isHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering])
  const handleChosen = (e: React.MouseEvent) => {
    if(itemData.variables) return
    e.stopPropagation()
    onChange([nodeId, itemData.name], itemData)
  }
  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={() => { }}
      placement='left-start'
      offset={14}
    >
      <PortalToFollowElemTrigger className='w-full'>
        <div
          ref={itemRef}
          className='var-reference-vars__item_box'
          style={{
            backgroundColor: isHovering ? '#FAFAFA' : '#fff',
          }}
          onClick={handleChosen}
        >
          <div className='var-reference-vars__item-name-box'>
            <div title={itemData.name} className='var-reference-vars__item-name'>{itemData.name}</div>
          </div>
          { itemData.type && <div className='var-reference-vars__item-type'>{itemData.type}</div>}
          {isChildren && <div> 
              <svg width="8" height="12" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.43335 11.5556L6.56668 6.50001L1.43335 1.44446" stroke="#2B2B2B" />
              </svg>
          </div>}
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent style={{
        zIndex: 100
      }}>
        {isChildren && (
          <ObjectChildren
            nodeId={nodeId}
            data={itemData.variables}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
            itemWidth={ itemWidth }
          />
        )}
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

const ObjectChildren: FC<ObjectChildrenProps> = ({
  nodeId,
  data,
  onChange,
  onHovering,
  itemWidth,
}) => {
  const itemRef = useRef(null)
  const [isItemHovering, setIsItemHovering] = useState(false)
  const _ = useHover(itemRef, {
    onChange: (hovering) => {
      if (hovering) {
        setIsItemHovering(true)
      }
      else {
        setTimeout(() => {
          setIsItemHovering(false)
        }, 100)
      }
    },
  })
  const [isChildrenHovering, setIsChildrenHovering] = useState(false)
  const isHovering = isItemHovering || isChildrenHovering
  useEffect(() => {
    onHovering && onHovering(isHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering])
  useEffect(() => {
    onHovering && onHovering(isItemHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isItemHovering])
  // absolute top-[-2px]
  return (
    <div ref={itemRef} className='var-reference-vars__item-children-box' style={{
      right: itemWidth ? itemWidth - 20 : 215,
      minWidth: 252,
    }}>
      <div className='var-reference-vars__item-children'>
        {
          (data && data.length > 0)
          && data.map((v, i) => (
            <Item
              key={i}
              nodeId={nodeId}
              itemData={v}
              onChange={onChange}
              onHovering={setIsChildrenHovering}
            />
          ))
        }
      </div>
    </div>
  )
}

type Props = {
  hideSearch?: boolean
  searchBoxClassName?: string
  vars: NodeVariables[]
  onChange: (value: ValueSelector, item: NodeVariables) => void
  itemWidth?: number
}
const VarReferenceVars: FC<Props> = ({
  hideSearch,
  searchBoxClassName,
  vars,
  onChange,
  itemWidth,
}) => {
  const [searchText, setSearchText] = useState('')
  
  const filteredVars = vars.filter(item => item.name.includes(searchText)).map((node) => {
    return {
      ...node,
    }
  })

  const [isFocus, {
    setFalse: setBlur,
    setTrue: setFocus,
  }] = useBoolean(false)

  return (
    <>
      {
        !hideSearch && (
          <>
            <div
              className={cn(searchBoxClassName, isFocus && 'var-reference-vars__search-input-is-focus', 'var-reference-vars__search-input-box')}
              onClick={e => e.stopPropagation()}
            >
              <svg className='var-reference-vars__search-input-search-icon' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.39777 1.55554C4.41777 1.55554 3.42999 1.92888 2.68333 2.68332C1.18222 4.18443 1.18222 6.61888 2.68333 8.11999C3.42999 8.86665 4.41777 9.24776 5.39777 9.24776C6.26111 9.24776 7.12444 8.95999 7.82444 8.38443L8.18222 8.74221C8.01111 8.91332 8.01111 9.2011 8.18222 9.37221L10.9744 12.1644C11.1455 12.3355 11.3867 12.4289 11.62 12.4289C11.8144 12.4289 12.0089 12.3667 12.1644 12.2267C12.5222 11.9 12.5378 11.3478 12.1955 11.0133L9.37222 8.18999C9.28666 8.10443 9.16999 8.05776 9.05333 8.05776C8.93666 8.05776 8.82777 8.10443 8.73444 8.18999L8.37666 7.83221C9.61333 6.32332 9.51999 4.0911 8.11222 2.68332C7.36555 1.93665 6.37777 1.55554 5.39777 1.55554ZM5.39777 8.2911C4.65888 8.2911 3.91222 8.0111 3.35222 7.44332C2.22444 6.31554 2.22444 4.47999 3.35222 3.35221C3.91999 2.78443 4.65888 2.50443 5.39777 2.50443C6.13666 2.50443 6.88333 2.78443 7.44333 3.35221C8.57111 4.47999 8.57111 6.31554 7.44333 7.44332C6.87555 8.0111 6.13666 8.2911 5.39777 8.2911Z" fill="#777777"/>
              </svg>
              {/* <RiSearchLine className='shrink-0 ml-[1px] mr-[5px] w-3.5 h-3.5 text-gray-400' /> */}
              <input
                value={searchText}
                className='var-reference-vars__search-input'
                placeholder={'Search node' || ''}
                onChange={e => setSearchText(e.target.value)}
                onFocus={setFocus}
                onBlur={setBlur}
                autoFocus
              />
              {
                searchText && (
                  <div
                    className='var-reference-vars__search-text'
                    onClick={() => setSearchText('')}
                  >  
                    <svg style={{width: '12px', height: '12px'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5432" width="200" height="200">
                      <path d="M981.671173 312.397934c-25.782498-60.159162-62.737412-116.021241-109.145908-162.429738S770.254689 65.74537 709.23611 39.962872c-125.474824-53.28383-272.435063-53.28383-397.909886 0-60.159162 25.782498-116.021241 62.737412-162.429738 109.145908S65.533075 252.238773 39.750578 312.397934C13.96808 375.135346 0.217414 442.169841 0.217414 512.642003s13.750665 137.506656 39.533163 200.244068c25.782498 60.159162 62.737412 116.021241 109.145908 162.429738 46.408496 46.408496 102.270576 83.36341 162.429738 109.145908 62.737412 25.782498 130.631324 39.533163 200.244068 39.533163s134.928406-13.750665 200.244068-39.533163c60.159162-25.782498 116.021241-62.737412 162.429738-109.145908 46.408496-46.408496 83.36341-102.270576 109.145908-162.429738 25.782498-62.737412 39.533163-130.631324 39.533163-200.244068S1007.453671 375.135346 981.671173 312.397934zM936.981509 693.978905c-23.204248 55.862079-55.862079 104.848826-99.692326 148.679072-42.111413 42.111413-92.816993 76.488078-148.679072 99.692326-114.302407 48.986746-246.652565 48.986746-362.673806 0-55.862079-23.204248-104.848826-58.440329-148.679072-99.692326-42.111413-42.111413-76.488078-92.816993-99.692326-148.679072-23.204248-58.440329-36.954914-118.599491-36.954914-181.336902 0-62.737412 12.031833-122.896574 36.954914-181.336902 23.204248-55.862079 55.862079-104.848826 99.692326-148.679072 42.111413-42.111413 92.816993-76.488078 148.679072-99.692326C383.517218 58.870038 444.535797 45.119371 507.273209 45.119371s122.896574 12.031833 181.336902 36.954914c55.862079 23.204248 104.848826 55.862079 148.679072 99.692326 42.111413 42.111413 76.488078 92.816993 99.692326 148.679072 23.204248 58.440329 36.954914 118.599491 36.954914 181.336902C974.79584 575.379414 962.764007 635.538576 936.981509 693.978905zM753.925773 300.366102 718.689693 268.567688 509.851459 479.984172 293.278475 263.411188 260.620644 296.069019 477.193628 512.642003 264.917727 724.058487 297.575558 756.716317 509.851459 545.299834 725.565025 761.0134 758.222856 728.355569 541.649873 512.642003Z" fill="#777777" p-id="5433"></path>
                    </svg>
                  </div>
                )
              }
            </div>
            <div className='var-reference-vars__search-empty' style={{ width: 'calc(100% + 8px)'}}></div>
          </>
        )
      }

      {vars.length > 0
        ? <div className='var-reference-vars__item'>
          {
            filteredVars.map((item, i) => (
              <Item
                key={i}
                nodeId={item.id}
                itemData={item}
                onChange={onChange}
                itemWidth={itemWidth}
              />
            ))
          }
        </div>
        : <div className='var-reference-vars_no-var'>没有变量</div>}
    </ >
  )
}
export default React.memo(VarReferenceVars)
