# vue-codemirror-plus

Codemirror component for vue3.

## Install

```bash

npm install vue-codemirror-plus

```

## Usage

### Component usage

```vue
<script setup lang="ts">
import type { ViewUpdate } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { shallowRef } from 'vue'
import { VueCodeMirror } from 'vue-codemirror-plus'

const code = shallowRef('const a = 1')

function handleChange(doc: string, vu: ViewUpdate) {
  console.log('onChange', doc, vu)
}

function handleBlur(vu: ViewUpdate) {
  console.log('handleBlur', vu)
}

function handleFocus(vu: ViewUpdate) {
  console.log('handleFocus', vu)
}
</script>

<template>
  <VueCodeMirror
    v-model="code"
    :disabled="false"
    :custom-style="{
      height: '500px',
    }"
    theme="dark"
    placeholder="Code goes here..."
    :extensions="[javascript()]"
    :basic-setup="true"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>
```

### Function Usage

```vue
<script setup lang="ts">
import type { ViewUpdate } from '@codemirror/view'
import type { CodeMirrorOptions } from 'vue-codemirror-plus'
import { javascript } from '@codemirror/lang-javascript'
import { computed, shallowRef } from 'vue'
import { useCodeMirror } from 'vue-codemirror-plus'

const containerRef = shallowRef<HTMLElement>()
const options = computed<CodeMirrorOptions>(() => {
  return {
    value: 'const a = 1',
    theme: 'dark',
    placeholder: 'Code goes here...',
    extensions: [javascript()],
    basicSetup: true,
    onChange(doc: string, vu: ViewUpdate) {
      console.log('onChange', doc, vu)
    },
    onFocus(vu: ViewUpdate) {
      console.log('onFocus', vu)
    },
    onBlur(vu: ViewUpdate) {
      console.log('onFocus', vu)
    },
  }
})

const { state, view, destroy } = useCodeMirror(container, options)
</script>

<template>
  <div ref="containerRef" />
</template>
```

### Types

```ts
interface CodeMirrorOptions extends Omit<EditorStateConfig, 'doc' | 'extensions'> {
  /** value of the auto created model in the editor. */
  value?: string
  customStyle?: CSSProperties
  /** focus on the editor. */
  autoFocus?: boolean
  /** Enables a placeholder—a piece of example content to show when the editor is empty. */
  placeholder?: string
  /**
   * `light` / `dark` / `Extension` Defaults to `light`.
   * @default light
   */
  theme?: 'light' | 'dark' | 'none' | Extension
  /**
   * Whether to optional basicSetup by default
   * @default true
   */
  basicSetup?: 'basic' | 'minimal' | boolean | BasicSetupOptions
  /**
   * This disables editing of the editor content by the user.
   * @default true
   */
  disabled?: boolean
  /**
   * Controls whether pressing the `Tab` key inserts a tab character and indents the text (`true`)
   * or behaves according to the browser's default behavior (`false`).
   * @default true
   */
  indentWithTab?: boolean
  /** Fired whenever a change occurs to the document. */
  onChange?: (value: string, viewUpdate: ViewUpdate) => void
  /** Fired whenever any state change occurs within the editor, including non-document changes like lint results. */
  onUpdate?: (viewUpdate: ViewUpdate) => void
  onFocus?: (viewUpdate: ViewUpdate) => void
  onBlur?: (viewUpdate: ViewUpdate) => void
  /** The first time the editor executes the event. */
  onReady?: (view: EditorView, state: EditorState) => void
  /**
   * Extension values can be [provided](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions) when creating a state to attach various kinds of configuration and behavior information.
   * They can either be built-in extension-providing objects,
   * such as [state fields](https://codemirror.net/6/docs/ref/#state.StateField) or [facet providers](https://codemirror.net/6/docs/ref/#state.Facet.of),
   * or objects with an extension in its `extension` property. Extensions can be nested in arrays arbitrarily deep—they will be flattened when processed.
   */
  extensions?: Extension[]
  /**
   * If the view is going to be mounted in a shadow root or document other than the one held by the global variable document (the default), you should pass it here.
   * Originally from the [config of EditorView](https://codemirror.net/6/docs/ref/#view.EditorView.constructor%5Econfig.root)
   */
  root?: ShadowRoot | Document
}

type VueCodeMirrorProps = Omit<CodeMirrorOptions, 'value'> & {
  modelValue: string
}

interface MinimalSetupOptions {
  highlightSpecialChars?: boolean
  history?: boolean
  drawSelection?: boolean
  syntaxHighlighting?: boolean

  defaultKeymap?: boolean
  historyKeymap?: boolean
}

interface BasicSetupOptions extends MinimalSetupOptions {
  lineNumbers?: boolean
  highlightActiveLineGutter?: boolean
  foldGutter?: boolean
  dropCursor?: boolean
  allowMultipleSelections?: boolean
  indentOnInput?: boolean
  bracketMatching?: boolean
  closeBrackets?: boolean
  autocompletion?: boolean
  rectangularSelection?: boolean
  crosshairCursor?: boolean
  highlightActiveLine?: boolean
  highlightSelectionMatches?: boolean

  closeBracketsKeymap?: boolean
  searchKeymap?: boolean
  foldKeymap?: boolean
  completionKeymap?: boolean
  lintKeymap?: boolean
  /**
   * Facet for overriding the unit by which indentation happens. Should be a string consisting either entirely of spaces or entirely of tabs. When not set, this defaults to 2 spaces
   * https://codemirror.net/docs/ref/#language.indentUnit
   * @default 2
   */
  tabSize?: number
}
```

## Component Exposes

| name        | description                                    | types                    |
| :---------- | :--------------------------------------------- | :----------------------- |
| state       | CodeMirror editor state instance.              | `EditorState`            |
| view        | CodeMirror editor view instance.               | `EditorView`             |
| inject      | Dynamically inject extensions into CodeMirror. | `(e: Extension) => void` |
| getValue    | Get the current content of the editor.         | `() => string`           |
| forceUpdate | Force update the editor content.               | `(v: string) => void`    |

## API

### injectExtension

Dynamically inject an extension into an existing editor instance.

```ts
import { javascript } from '@codemirror/lang-javascript'

injectExtension(editorView, javascript())
```

### useToggleExtension

A Vue 3 Composition API hook for managing toggleable extensions in reactive contexts.

```ts
const { toggle, isEnabled } = useToggleExtension(editorView)

function toggleLineNumbers() {
  toggle(lineNumbers())
}
```

### useBasicSetup

A Vue 3 Composition API hook for managing basic editor setups.

```ts
const { getBasicSetup, toggleBasicSetup } = useBasicSetup(editorView)

toggleBasicSetup(getBasicSetup('minimal'))
```

## Credits

This project also partially contains code derived or copied from the following projects:

- [react-codemirror](https://github.com/uiwjs/react-codemirror)
- [vue-codemirror](https://github.com/surmon-china/vue-codemirror)
