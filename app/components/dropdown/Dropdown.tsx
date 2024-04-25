"use client";
import { useState, cloneElement } from "react";
import type { ReactElement} from 'react'
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export const Dropdown = (props: { menu: ReactElement[], activeIndex: number }) => {
  const { menu, activeIndex } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div className="dropdown relative">
      <button onClick={handleOpen} className="p-4 hover:bg-gray-600">{!open ? <BiChevronDown /> : <BiChevronUp />}</button>
      {open ? (
        <ul className="dropdown_menu absolute">
          {menu.map((menuItem, index) => (
            <li key={index} className={`dropdown__item flex bg-slate-600 hover:bg-slate-500 cursor-pointer border-slate-300 ${activeIndex === index && 'border-l-4'}`}>
              {cloneElement(menuItem, {
                onClick: () => {
                  menuItem.props.onClick();
                  setOpen(false);
                },
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Dropdown;