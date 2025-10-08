import type { Extension } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import type { MaybeRef } from 'vue'
import type { MinimalSetupOptions } from './basic-setup'
import type { CodeMirrorOptions } from './options'
import { indentWithTab } from '@codemirror/commands'
import { Annotation, Compartment, EditorState, StateEffect } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { effectScope, getCurrentInstance, nextTick, onMounted, onUnmounted, shallowRef, toValue, watch } from 'vue'
import { basicSetup, minimalSetup } from './basic-setup'

export const ExternalChange = Annotation.define<boolean>()

export function injectExtension(view: EditorView, extension: Extension) {
  view.dispatch({
    effects: StateEffect.appendConfig.of(extension),
  })
}

export function toggleWith(key: string, extension: Extension) {
  const compartment = new Compartment()

  const toggle = (view: EditorView) => {
    // eslint-disable-next-line eqeqeq
    const e = compartment.get(view.state) == extension ? [] : extension
    view.dispatch({
      effects: compartment.reconfigure(e),
    })
    return true
  }
  return [
    compartment.of([]),
    keymap.of([{ key, run: toggle }]),
  ]
}

export function useToggleExtension(view: MaybeRef<EditorView>) {
  const compartment = new Compartment()
  const current = toValue(view)

  const isEnabled = () => compartment.get(current.state)

  const toggle = (e: Extension) => {
    if (!isEnabled()) {
      current.dispatch({ effects: StateEffect.appendConfig.of(compartment.of(e)) })
    }
    else {
      current.dispatch({ effects: compartment.reconfigure(e) })
    }
  }

  return {
    compartment,
    toggle,
    isEnabled,
  }
}

export function useBasicSetup(view: MaybeRef<EditorView>) {
  const compartment = new Compartment()

  const getMinimalSetup = (ops?: MinimalSetupOptions) => {
    return minimalSetup(ops)
  }

  const getBasicSetup = (ops: CodeMirrorOptions['basicSetup']) => {
    let basic: Extension
    if (typeof ops === 'object') {
      basic = basicSetup(ops)
    }
    else if (ops === 'minimal') {
      basic = getMinimalSetup()
    }
    else if (ops) {
      basic = basicSetup()
    }

    return basic ?? []
  }

  const toggleBasicSetup = (e: Extension) => {
    toValue(view).dispatch({
      effects: compartment.reconfigure(e),
    })
  }

  return {
    compartment,
    getBasicSetup,
    getMinimalSetup,
    toggleBasicSetup,
  }
}

function tryOnMounted(fn: () => void) {
  const instance = getCurrentInstance()
  if (instance)
    onMounted(fn)
  else
    fn()
}

function tryOnUnmounted(fn: () => void) {
  const instance = getCurrentInstance()
  if (instance)
    onUnmounted(fn)
  else
    fn()
}

export function useCodeMirror(container: MaybeRef<Element>, options: MaybeRef<CodeMirrorOptions>) {
  const state = shallowRef<EditorState>()
  const view = shallowRef<EditorView>()

  const {
    value,
    basicSetup: basicSetupOps = true,
    onChange,
    onFocus,
    onBlur,
    onReadly,
    onUpdate,
    selection,
    autoFocus,
    root,
  } = toValue(options)

  // https://github.com/uiwjs/react-codemirror/blob/master/core/src/useCodeMirror.ts
  const updateListener = EditorView.updateListener.of(
    (vu: ViewUpdate) => {
      onUpdate?.(vu)

      if (
        vu.docChanged
        // Fix echoing of the remote changes:
        // If transaction is market as remote we don't have to call `onChange` handler again
        && !vu.transactions.some(tr => tr.annotation(ExternalChange))
      ) {
        onChange?.(vu.state.doc.toString(), vu)
      }

      if (vu.focusChanged) {
        vu.view.hasFocus ? onFocus?.(vu) : onBlur?.(vu)
      }
    },
  )

  const scope = effectScope()

  const destroy = () => {
    if (view.value) {
      view.value.destroy()
      scope.stop()
      view.value = null
      state.value = null
    }
  }

  const processEditor = () => {
    nextTick(() => {
      const { compartment: basicCompartment, getBasicSetup, toggleBasicSetup } = useBasicSetup(view)

      state.value = EditorState.create({
        doc: value,
        selection,
        extensions: [basicCompartment.of(getBasicSetup(basicSetupOps)), updateListener],
      })

      view.value = new EditorView({
        state: state.value,
        parent: toValue(container),
        root,
      })

      scope.run(() => {
        watch(
          () => toValue(options).basicSetup,
          (val) => {
            toggleBasicSetup(getBasicSetup(val))
          },
          { deep: 1 },
        )

        const { toggle: toggleTheme } = useToggleExtension(view.value)
        watch(
          () => toValue(options).theme,
          (val) => {
            const e: Extension = typeof val !== 'string' ? val : val === 'dark' ? oneDark : []
            toggleTheme(e)
          },
        )

        const { toggle: toggleCustomStyle } = useToggleExtension(view.value)
        watch(
          () => toValue(options).customStyle,
          (val) => {
            val && toggleCustomStyle(
              EditorView.theme({
                '&': { ...val },
              }),
            )
          },
          { deep: 1 },
        )

        const { toggle: toggleIndentWithTab } = useToggleExtension(view.value)
        watch(
          () => toValue(options).indentWithTab,
          (val) => {
            const e: Extension = val !== false ? keymap.of([indentWithTab]) : []
            toggleIndentWithTab(e)
          },
        )

        const { toggle: toggleDisabled } = useToggleExtension(view.value)
        const disabledExtension = [EditorView.editable.of(false), EditorState.readOnly.of(true)]
        watch(
          () => toValue(options).disabled,
          (val) => {
            const e: Extension = val ? disabledExtension : []
            toggleDisabled(e)
          },
        )

        const { toggle: togglePlaceholder } = useToggleExtension(view.value)
        watch(
          () => toValue(options).placeholder,
          (val) => {
            togglePlaceholder(placeholder(val ?? ''))
          },
        )

        const { toggle: toggleUserExtension } = useToggleExtension(view.value)
        watch(
          () => toValue(options).extensions,
          (val) => {
            toggleUserExtension(val ?? [])
          },
        )

        if (autoFocus) {
          view.value.focus()
        }
      })

      onReadly?.(view.value, state.value)
    })
  }

  tryOnMounted(processEditor)

  tryOnUnmounted(destroy)

  return {
    state,
    view,
    destroy,
  }
}
