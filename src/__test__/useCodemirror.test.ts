import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useCodeMirror } from '../useCodemirror'

describe('useCodemirror', () => {
  it('should be define', async () => {
    const container = document.createElement('div')
    const { state, view, destroy } = useCodeMirror(container, { value: 'Hello World' })

    await nextTick()

    expect(view.value).toBeInstanceOf(EditorView)
    expect(state.value).toBeInstanceOf(EditorState)

    expect(container.querySelector('.cm-editor')).toBeTruthy()
    expect(container.contains(view.value.dom)).toBe(true)

    expect(view.value.state.doc.toString()).toBe('Hello World')

    destroy()
  })

  it('should be emits update', async () => {
    const onUpdate = vi.fn(() => { })
    const onChange = vi.fn(() => { })
    const onReady = vi.fn(() => { })

    const container = document.createElement('div')
    const { destroy, view } = useCodeMirror(container, {
      value: 'Hello World',
      onUpdate,
      onChange,
      onReady,
    })

    await nextTick()
    expect(onReady).toBeCalledTimes(1)
    expect(onUpdate).toBeCalledTimes(0)
    expect(onChange).toBeCalledTimes(0)

    view.value.dispatch({
      changes: { from: 0, to: view.value.state.doc.toString().length, insert: 'Hello My World' },
    })

    expect(onReady).toBeCalledTimes(1)
    expect(onUpdate).toBeCalledTimes(1)
    expect(onChange).toBeCalledTimes(1)
    expect(view.value.state.doc.toString()).toBe('Hello My World')

    destroy()
  })

  it('shoule be distroy', async () => {
    const container = document.createElement('div')
    const { state, view, destroy } = useCodeMirror(container, { value: 'Hello World' })

    await nextTick()

    expect(container.querySelector('.cm-editor')).toBeTruthy()
    expect(view.value).toBeDefined()
    expect(state.value).toBeDefined()

    destroy()

    await nextTick()

    expect(container.querySelector('.cm-editor')).not.toBeTruthy()
    expect(view.value).toBeNull()
    expect(state.value).toBeNull()
  })
})
