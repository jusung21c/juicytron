<template>
        <codemirror
                v-model="propText"
                :options="cmOptions"
        ></codemirror>
</template>

<script>
  import { codemirror } from 'vue-codemirror';
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/mode/javascript/javascript.js';
  import 'codemirror/theme/base16-dark.css';

  export default {
    name: 'TextArea',
    props: ['text', 'label'],
    components: {
      codemirror,
    },
    data() {
      return {
        content: '',
        cmOptions: {
          styleActiveLine: true,
          tabSize: 4,
          mode: 'javascript',
          theme: 'base16-dark',
          lineNumbers: true,
          line: true,
          autofocus: true,
          showCursorWhenSelecting: true,
          lineWrapping: true,
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

    },

  };
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Nanum+Gothic|PT+Sans&subset=korean');
.CodeMirror {
    height: initial;
    font-family: 'Jeju Gothic', sans-serif;
        letter-spacing: 0.5px;
        word-spacing: 1px;
}
</style>