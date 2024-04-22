"use client";
import { useState, cloneElement } from "react";

import {
  regenerateWord,
  lockWord,
  changeWordType,
  wordTypeNames
} from "@/lib/features/counter/counterSlice";

import { useAppDispatch } from "@/lib/hooks";

const Dropdown = ({ trigger, menu }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="dropdown">
      {cloneElement(trigger, {
        onClick: handleOpen,
      })}
      {open ? (
        <ul className="menu">
          {menu.map((menuItem, index) => (
            <li key={index} className="menu-item">
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

export const Word = (props) => {
  const {word, index} = props;
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-row m-1 p-1">
      <div>{word.value}</div>
      <Dropdown
          trigger={<button>{wordTypeNames[word.type]}</button>}
          menu={Object.values(wordTypeNames).map((name, key) => <button key={key} onClick={() => dispatch(changeWordType({word, index, value: key}))}>{name}</button>)}
      />
      <input type="checkbox" value={word.locked} onChange={ 
        () => { dispatch(lockWord({ word, index, value: !word.locked })) }} />
      <button 
        onClick={() => {
          if (!word.locked) {
            dispatch(regenerateWord({ word, index }))
          }
        }}
        disabled={word.locked}
        className="disabled:opacity-75"
      >Regen</button>
    </div>
  );
};
