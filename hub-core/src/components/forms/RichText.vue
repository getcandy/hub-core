<template>
  <div class="editor">
    <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
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
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: {
      type: null,
      required: true
    }
  },
  data () {
    return {
      editor: null,
      content: null
    }
  },
  watch: {
    value (val) {
      this.editor.setContent(val, false, {
        preserveWhitespace: true
      })
    }
  },
  mounted () {
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
        new History()
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
      })
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
  .editor__content {
    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
    max-width: 100%;
    width: 100%;
    border: 1px solid #B7BFCB;
    outline: none;
    background-color: white;
    border-radius: 4px;
    color: #363636;
    padding-bottom: calc(0.375em - 1px);
    padding-left: calc(0.625em - 1px);
    padding-right: calc(0.625em - 1px);
    padding-top: calc(0.375em - 1px);
    border-top-left-radius:0;
    border-top-right-radius:0;
  }
  .menubar {
    max-width: 100%;
    width: 100%;
    border: 1px solid #B7BFCB;
    background-color: #f5f5f5;
    border-radius: 4px;
    color: #363636;
    padding-bottom: calc(0.375em - 1px);
    padding-left: calc(0.625em - 1px);
    padding-right: calc(0.625em - 1px);
    padding-top: calc(0.375em - 1px);
    border-bottom:0;
    border-bottom-left-radius:0;
    border-bottom-right-radius:0;
    button {
      padding:0;
      border:0;
      line-height:0;
      background-color:transparent;
      padding:0 5px;
      span {
        color: #333;
      }
      i {
        display:block;
      }
    }
  }
</style>
