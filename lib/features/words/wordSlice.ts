import { createAppSlice } from '@/lib/createAppSlice'
import { NOUNS, VERBS, ADJECTIVES, LOCATIONS, LOCATIONS_WITH_ADJECTIVE } from '../../words'

export enum WORD_TYPES {
  'VERB',
  'NOUN',
  'ADJECTIVE',
  'LOCATION',
  'ADJECTIVE_AND_LOCATION',
}

export type word = {
  type: WORD_TYPES
  value: string
  raw_value: string
  locked: boolean
  id: string
  adjective: string
}

export type words = word[]

export interface WordSliceState {
  words: words
  history: string[]
}

export const wordTypeMap = {
  [WORD_TYPES.VERB]: VERBS,
  [WORD_TYPES.NOUN]: NOUNS,
  [WORD_TYPES.ADJECTIVE]: ADJECTIVES,
  [WORD_TYPES.LOCATION]: LOCATIONS,
  [WORD_TYPES.ADJECTIVE_AND_LOCATION]: LOCATIONS_WITH_ADJECTIVE,
}

export const wordTypeNames = {
  [WORD_TYPES.VERB]: 'Verbs',
  [WORD_TYPES.NOUN]: 'Nouns',
  [WORD_TYPES.ADJECTIVE]: 'Adjectives',
  [WORD_TYPES.LOCATION]: 'Locations',
  [WORD_TYPES.ADJECTIVE_AND_LOCATION]: 'Location with adjective',
}

const randomIndexFromArray = (max: number) => {
  return Math.floor(Math.random() * max)
}

const generateSlug = () => Math.random().toString(16).slice(2)

const generateWord = (
  type: WORD_TYPES,
  options: { baseWord?: string; adjective?: string } = {},
): word => {
  const { baseWord, adjective: baseAdjective } = options
  let value = baseWord || wordTypeMap[type][randomIndexFromArray(wordTypeMap[type].length)]
  let rawValue = value
  let adjective = ''

  if (type === WORD_TYPES.ADJECTIVE_AND_LOCATION) {
    adjective =
      baseAdjective ||
      wordTypeMap[WORD_TYPES.ADJECTIVE][randomIndexFromArray(wordTypeMap[type].length)]
    value = value?.replace('{ADJECTIVE}', adjective)
  }

  return {
    type,
    value: value || '',
    raw_value: rawValue || '',
    locked: false,
    id: generateSlug(),
    adjective: adjective,
  }
}

const generateDefaultWords = (): words => {
  const wordTypes = [WORD_TYPES.ADJECTIVE, WORD_TYPES.NOUN, WORD_TYPES.LOCATION]

  return wordTypes.map((type) => generateWord(type))
}

const formatSentence = (words: words) => {
  return words
    .map((word, i) => {
      let formatted = word.value
      if (i === 0) {
        return formatted[0].toUpperCase() + formatted.substring(1)
      }
      return formatted
    })
    .join(' ')
}

const addWordToHistory = (state: any, words: words) => {
  const newHistoryItem = formatSentence(words)
  const newHistory = state.history.slice()
  newHistory.push(newHistoryItem)
  state.history = newHistory.slice()
}

const initialWords = generateDefaultWords()

const initialState: WordSliceState = {
  words: initialWords,
  history: [formatSentence(initialWords)],
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const wordSlice = createAppSlice({
  name: 'word',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    generateWords: create.reducer((state) => {
      state.words = state.words.slice().map((word) => {
        if (!word.locked) {
          const newWord = generateWord(word.type)
          return newWord
        }
        return word
      })
      addWordToHistory(state, state.words)
    }),
    resetWords: create.reducer((state) => {
      state.words = generateDefaultWords()
      addWordToHistory(state, state.words)
    }),
    setWords: create.reducer((state, action: { payload: { words: words } }) => {
      const { words } = action.payload
      state.words = words
      addWordToHistory(state, state.words)
    }),
    regenerateWord: create.reducer(
      (
        state,
        action: {
          payload: { word: word; id: string; refreshAdjective?: boolean; refreshLocation?: boolean }
        },
      ) => {
        const { word, id, refreshAdjective, refreshLocation } = action.payload
        let newWord = null
        if (refreshAdjective) {
          newWord = generateWord(word.type, { baseWord: word.raw_value })
        } else if (refreshLocation) {
          newWord = generateWord(word.type, { adjective: word.adjective })
        } else {
          newWord = generateWord(word.type)
        }
        newWord.locked = word.locked
        const newWords = state.words.slice()
        const index = newWords.findIndex((item) => item.id === id)
        newWords[index] = newWord
        state.words = newWords.slice()
        addWordToHistory(state, state.words)
      },
    ),
    lockWord: create.reducer(
      (state, action: { payload: { word: word; id: string; value: boolean } }) => {
        const { word, id, value } = action.payload
        const newWord = { ...word }
        newWord.locked = value
        const newWords = state.words.slice()
        const index = newWords.findIndex((item) => item.id === id)
        newWords[index] = newWord
        state.words = newWords.slice()
      },
    ),
    changeWordType: create.reducer(
      (state, action: { payload: { id: string; value: WORD_TYPES } }) => {
        const { id, value } = action.payload
        const newWord = generateWord(value)
        const newWords = state.words.slice()
        const index = newWords.findIndex((item) => item.id === id)
        newWords[index] = newWord
        state.words = newWords.slice()
        addWordToHistory(state, state.words)
      },
    ),
    addWord: create.reducer((state) => {
      const newWord = generateWord(WORD_TYPES.NOUN)
      const newWords = state.words.slice()
      newWords.push(newWord)
      state.words = newWords.slice()
      addWordToHistory(state, state.words)
    }),
    removeWord: create.reducer((state, action: { payload: { id: string } }) => {
      const { id } = action.payload
      const newWords = state.words.slice()
      const index = newWords.findIndex((item) => item.id === id)
      newWords.splice(index, 1)
      state.words = newWords.slice()
      addWordToHistory(state, state.words)
    }),
    resetHistory: create.reducer((state) => {
      state.history = []
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectWords: (state) => state.words,
    selectHistory: (state) => state.history,
  },
})

// Action creators are generated for each case reducer function.
export const {
  generateWords,
  regenerateWord,
  lockWord,
  changeWordType,
  setWords,
  addWord,
  removeWord,
  resetWords,
  resetHistory,
} = wordSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectWords, selectHistory } = wordSlice.selectors
