'use client'
import {
  regenerateWord,
  lockWord,
  changeWordType,
  wordTypeNames,
  removeWord,
  WORD_TYPES,
} from '@/lib/features/words/wordSlice'
import type { word as wordType } from '@/lib/features/words/wordSlice'
import {
  BiLock,
  BiLockOpen,
  BiRefresh,
  BiDownArrow,
  BiUpArrow,
  BiDotsVerticalRounded,
  BiTrash,
} from 'react-icons/bi'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Dropdown from '../dropdown/Dropdown'
import { Reorder, useDragControls } from 'framer-motion'
import { selectMobile } from '@/lib/features/words/metaSlice'

export const Word = (props: {
  word: wordType
  onMove: (up: boolean) => void
  index: number
  totalLength: number
}) => {
  const { word, onMove, index, totalLength } = props
  const dispatch = useAppDispatch()
  const controls = useDragControls()
  const mobile = useAppSelector(selectMobile)

  return (
    <Reorder.Item
      key={word.id}
      value={word}
      dragListener={false}
      dragControls={mobile ? undefined : controls}
    >
      <div className="word flex flex-row bg-gray-700 text-white rounded-md mr-2 ml-2">
        <div
          className={`flex flex-col ${
            mobile ? '' : 'p-2'
          } items-center justify-center bg-slate-600 rounded-bl-md rounded-tl-md cursor-pointer reorder-handle`}
          onPointerDown={(e) => controls.start(e)}
        >
          {mobile ? (
            <>
              {index === 0 ? (
                <div className="flex flex-1 p-2">{''}</div>
              ) : (
                <button className="flex flex-1 p-2 select-none" onClick={() => onMove(true)}>
                  <BiUpArrow />
                </button>
              )}
              {index === totalLength - 1 ? (
                <div className="flex flex-1 p-2">{''}</div>
              ) : (
                <button className="flex flex-1 p-2 select-none" onClick={() => onMove(false)}>
                  <BiDownArrow />
                </button>
              )}
            </>
          ) : (
            <BiDotsVerticalRounded />
          )}
        </div>
        <div className="flex flex-col">
          <div className="word__value p-3 select-none">{word.value}</div>
          <div
            style={mobile ? { maxWidth: '280px', flexWrap: 'wrap' } : {}}
            className="flex flex-row border-solid border-t-2 border-slate-600 bg-gray-700"
          >
            <Dropdown
              activeIndex={word.type}
              menu={Object.values(wordTypeNames).map((name, key) => (
                <button
                  className="flex flex-1 p-2"
                  key={key}
                  onClick={() => dispatch(changeWordType({ id: word.id, value: key }))}
                >
                  {name}
                </button>
              ))}
            />
            <button
              className={`p-3 select-none ${
                word.locked ? 'bg-red-800 hover:bg-red-700' : `hover:bg-gray-600`
              }`}
              onClick={() => {
                dispatch(lockWord({ word, id: word.id, value: !word.locked }))
              }}
              title={word.locked ? 'Unlock Word' : 'Lock Word'}
            >
              {word.locked ? <BiLock /> : <BiLockOpen />}
            </button>
            <button
              className={`p-3 select-none ${word.locked ? 'bg-gray-800' : `hover:bg-gray-600`}`}
              onClick={() => {
                if (!word.locked) {
                  dispatch(regenerateWord({ word, id: word.id }))
                }
              }}
              disabled={word.locked}
              title={'Regenerate Word'}
            >
              <BiRefresh />
            </button>
            {word.type === WORD_TYPES.ADJECTIVE_AND_LOCATION && (
              <button
                className={`flex flex-row items-center p-3 select-none ${
                  word.locked ? 'bg-gray-800' : `hover:bg-gray-600`
                }`}
                onClick={() => {
                  if (!word.locked) {
                    dispatch(regenerateWord({ word, id: word.id, refreshAdjective: true }))
                  }
                }}
                disabled={word.locked}
                title={'Regenerate Adjective'}
              >
                <BiRefresh /> Adjective
              </button>
            )}
            {word.type === WORD_TYPES.ADJECTIVE_AND_LOCATION && (
              <button
                className={`flex flex-row items-center p-3 select-none ${
                  word.locked ? 'bg-gray-800' : `hover:bg-gray-600`
                }`}
                onClick={() => {
                  if (!word.locked) {
                    dispatch(regenerateWord({ word, id: word.id, refreshLocation: true }))
                  }
                }}
                disabled={word.locked}
                title={'Regenerate Location'}
              >
                <BiRefresh /> Location
              </button>
            )}
            <button
              className={`p-3 select-none ${word.locked ? 'bg-gray-800' : `hover:bg-gray-600`}`}
              onClick={() => {
                if (!word.locked) {
                  dispatch(removeWord({ id: word.id }))
                }
              }}
              disabled={word.locked}
              title={'Remove Word'}
              style={{ borderBottomRightRadius: '4px' }}
            >
              <BiTrash />
            </button>
          </div>
        </div>
      </div>
    </Reorder.Item>
  )
}

export default Word
