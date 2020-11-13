<template>
  <div class="editor">
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="flex bg-white border border-gray-400 border-b-0 p-2 rounded-t">

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <i class="ri-bold" />
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <i class="ri-italic" />
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <i class="ri-strikethrough" />
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <i class="ri-underline" />
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <i class="ri-paragraph" />
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <i class="ri-list-unordered" />
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <i class="ri-list-ordered" />
        </button>

        <button
          class="text-editor-control"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <i class="ri-double-quotes-l" />
        </button>

        <button
          class="text-editor-control"
          @click="commands.undo"
        >
          <i class="ri-arrow-go-back-line" />
        </button>

        <button
          class="text-editor-control"
          @click="commands.redo"
        >
          <i class="ri-arrow-go-forward-line" />
        </button>

      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
const debounce = require('lodash/debounce')
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  props: ['value'],
  components: {
    EditorContent,
    EditorMenuBar,
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new Link(),
        new Bold(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      onUpdate: ({ getHTML }) => {
        this.content = getHTML()
      },
      onBlur: () => {
        this.$emit('input', this.content)
        this.$emit('change', this.content)
      }
    })
    if (this.value) {
      this.content = this.value
      this.editor.setContent(this.content, false, {
        preserveWhitespace: true
      });
    }
  },
  data() {
    return {
      editor: null,
      content: null
    }
  },
  watch: {
    value (val) {
      this.editor.setContent(val, false, {
        preserveWhitespace: true
      });
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  },
}
</script>
