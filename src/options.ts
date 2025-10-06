import type { EditorState, EditorStateConfig, Extension } from '@codemirror/state'
import type { EditorView, ViewUpdate } from '@codemirror/view'
import type { CSSProperties } from 'vue'
import type { BasicSetupOptions } from './basic-setup'

export interface CodeMirrorOptions extends Omit<EditorStateConfig, 'doc' | 'extensions'> {
  /** value of the auto created model in the editor. */
  value?: string
  customStyle?: CSSProperties
  /** focus on the editor. */
  autoFocus?: boolean
  /** Enables a placeholder—a piece of example content to show when the editor is empty. */
  placeholder?: string | HTMLElement
  /**
   * `light` / `dark` / `Extension` Defaults to `light`.
   * @default light
   */
  theme?: 'light' | 'dark' | 'none' | Extension
  /**
   * Whether to optional basicSetup by default
   * @default true
   */
  basicSetup?: boolean | BasicSetupOptions
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
  onReadly?: (view: EditorView, state: EditorState) => void
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
