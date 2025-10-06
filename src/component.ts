import type { Extension } from '@codemirror/state'
import type { CodeMirrorOptions } from './options'
import { computed, defineComponent, h, shallowRef } from 'vue'
import { ExternalChange, injectExtension, useCodeMirror } from './useCodemirror'

export type VueCodeMirrorProps = Omit<CodeMirrorOptions, 'value'> & {
  modelValue: string
}

const props = [
  'modelValue',
  'customStyle',
  'autoFocus',
  'placeholder',
  'theme',
  'basicSetup',
  'disabled',
  'indentWithTab',
  'extensions',
  'root',
]

const emits = [
  'update:modelValue',
  'change',
  'blur',
  'focus',
  'readly',
  'update',
]

export const VueCodeMirror = defineComponent<VueCodeMirrorProps>({
  name: 'VueCodeMirror',
  props,
  emits,
  setup(props, { emit, expose }) {
    const container = shallowRef<HTMLDivElement>()

    const options = computed<CodeMirrorOptions>(() => {
      return {
        ...props,
        value: props.modelValue,
        onUpdate(vu) {
          emit('update', vu)
        },
        onChange(v, vu) {
          emit('update:modelValue', v)
          emit('change', v, vu)
        },
        onBlur(vu) {
          emit('blur', vu)
        },
        onFocus(vu) {
          emit('focus', vu)
        },
        onReadly(v, s) {
          emit('readly', v, s)
        },
      }
    })

    const { state, view } = useCodeMirror(container, options)

    const inject = (e: Extension) => injectExtension(view.value, e)
    const getValue = () => view.value.state.doc.toString()
    const forceUpdate = (v: string) => {
      if (v !== getValue()) {
        view.value.dispatch({
          changes: { from: 0, to: getValue().length, insert: v || '' },
          annotations: [ExternalChange.of(true)],
        })
      }
    }

    expose({
      state,
      view,
      inject,
      getValue,
      forceUpdate,
    })

    return () => h('div', { ref: container, class: 'v-codemirror' })
  },
})
