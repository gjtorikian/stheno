import { defaultKeymap, historyKeymap, indentLess, indentMore, indentWithTab } from '@codemirror/commands'
import type { Extension } from '@codemirror/state'
import { Compartment, Transaction } from '@codemirror/state'
import type { KeyBinding } from '@codemirror/view'
import { keymap } from '@codemirror/view'
import { BoldText, BulletedList, CodeText, ItalicText, NumberedList, QuoteText, TaskList } from './markdown/index'
import { lintKeymap } from '@codemirror/lint'
import { closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { searchKeymap } from '@codemirror/search'

const keyMaps: KeyBinding[] = [
  {
    key: 'Tab',
    run: ({ state, dispatch }) => {
      if (state.selection.ranges.some(r => !r.empty))
        return indentMore({ state, dispatch })

      dispatch(
        state.update(state.replaceSelection('  '), {
          scrollIntoView: true,
          annotations: Transaction.userEvent.of('input'),
        }),
      )

      return true
    },
    shift: indentLess,
  },
]

export const KEYBINDINGS = new Compartment;


export const keymaps = (): Extension => {
  return keymap.of([
    NumberedList,
    BulletedList,
    TaskList,
    QuoteText,
    BoldText,
    ItalicText,
    CodeText,
    indentWithTab,
    ...defaultKeymap,
    ...lintKeymap,
    ...completionKeymap,
    ...historyKeymap,
    ...searchKeymap,
    ...closeBracketsKeymap,
  ])
}
