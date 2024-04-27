'use client'
import { useState, cloneElement, useRef, useEffect } from 'react'
import type { ReactElement } from 'react'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'

export const Dropdown = (props: { menu: ReactElement[]; activeIndex: number }) => {
  const { menu, activeIndex } = props
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleOpen = () => {
    setOpen(!open)
  }

  useEffect(() => {
    const clickOutside = (e: any) => {
      if (open && ref.current && ref.current && !ref.current?.contains(e.target)) {
        setOpen(false)
      }
    }

    window.addEventListener('click', clickOutside)

    return () => {
      window.removeEventListener('click', clickOutside)
    }
  }, [ref, open])

  return (
    <div className="dropdown relative" ref={ref}>
      <button onClick={handleOpen} className="p-4 hover:bg-gray-600 user-">
        {!open ? (
          <BiChevronDown className="pointer-events-none" />
        ) : (
          <BiChevronUp className="pointer-events-none" />
        )}
      </button>
      {open ? (
        <ul className="dropdown_menu absolute">
          {menu.map((menuItem, index) => (
            <li
              key={index}
              className={`dropdown__item flex bg-slate-600 hover:bg-slate-500 cursor-pointer border-slate-300 ${
                activeIndex === index && 'border-l-4'
              }`}
            >
              {cloneElement(menuItem, {
                onClick: () => {
                  menuItem.props.onClick()
                  setOpen(false)
                },
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default Dropdown
