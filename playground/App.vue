<script setup lang="ts">
import type { CodeMirrorOptions } from '../src'
import { javascript } from '@codemirror/lang-javascript'
import { ref } from 'vue'
import { VueCodeMirror } from '../src'

const code = ref('const a = 1')

const theme = ref<'none' | 'dark'>('none')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'none' : 'dark'
}

const disabled = ref(false)
function toggleDisabed() {
  disabled.value = !disabled.value
}

const extensions = ref([])
function toggleExtensions() {
  extensions.value = extensions.value.length ? [] : [javascript()]
}

const basicSetup = ref<CodeMirrorOptions['basicSetup']>('basic')

function toggleBasicSetup() {
  basicSetup.value = basicSetup.value === 'basic' ? 'minimal' : 'basic'
}

function handleChange(doc: string) {
  console.log('onChange', doc)
}

function handleBlur() {
  console.log('handleBlur')
}

function handleFocus() {
  console.log('handleFocus')
}
</script>

<template>
  <div>Hello World</div>
  <button @click="toggleTheme">
    {{ theme === 'dark' ? '☀' : '🌙' }}
  </button>
  <button @click="toggleDisabed">
    toggleDisabed
  </button>
  <button @click="toggleExtensions">
    toggleExtensions
  </button>
  <button @click="toggleBasicSetup">
    toggleBasicSetup
  </button>
  <VueCodeMirror
    v-model="code"
    :disabled="disabled"
    :custom-style="{
      height: '300px',
    }"
    :theme="theme"
    placeholder="请输入"
    :extensions="extensions"
    :basic-setup="basicSetup"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<style scoped></style>
