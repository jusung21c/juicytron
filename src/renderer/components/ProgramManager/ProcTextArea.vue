<template>
        <ace-editor v-model="propText" :config="config" width="100%" height="200px"></ace-editor>
</template>

<script>
import AceEditorOnVue from 'ace-editor-on-vue';


export default {
  name: 'TextArea',
  props: ['text', 'label'],
  components: {
    'ace-editor': AceEditorOnVue,
  },
  data() {
    return {
      content: '',
      config: {
        lang: 'javascript', // default `json`
        theme: 'xcode', // default `xcode`
        options: { // options for Ace
          useSoftTabs: true, // default 2 space characters for indent
          tabSize: 2,
          maxLines: 50000,
          wrap: true,
          autoScrollEditorIntoView: true,
        },
      },

    };
  },
  computed: {
    propText: {
      get() {
        return this.text;
      },
      set(value) {
        this.$emit('modifiedText', value);
      },
    },
  },
  methods: {
    editorInit() {
      require('brace/ext/language_tools'); // language extension prerequsite...
      require('brace/mode/javascript'); // language
      require('brace/theme/chrome');
      require('brace/snippets/javascript'); // snippet
    },
  },

};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Nanum+Gothic|PT+Sans&subset=korean');
.ace_editor {
border: 1px solid lightgray;

    font-family: 'Jeju Gothic', sans-serif;
    font-size: large;
}

</style>