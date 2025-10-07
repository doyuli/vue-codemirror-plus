import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { VueCodeMirror } from '../component'

describe('component', () => {
  it('should be define', async () => {
    const wrapper = mount(VueCodeMirror, {
      props: {
        modelValue: 'initialText',
      },
    })

    await nextTick()

    const textbox = wrapper.find('[role="textbox"]')
    expect(textbox.exists()).toBe(true)
  })

  it('should work with v-model', async () => {
    const current = ref('console.log("hello")')
    const wrapper = mount(VueCodeMirror, {
      props: {
        'modelValue': current.value,
        'onUpdate:modelValue': (val: string) => current.value = val,
      },
    })

    await nextTick()

    const { view } = wrapper.vm as any

    expect(view.state.doc.toString()).toBe('console.log("hello")')

    view.dispatch({
      changes: { from: 0, to: view.state.doc.toString().length, insert: 'console.log("world")' },
    })

    await nextTick()

    expect(current.value).toBe('console.log("world")')
  })
})
