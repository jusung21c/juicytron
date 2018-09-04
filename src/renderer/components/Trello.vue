<template>
        <webview id="foo"
                 src="https://trello.com/b/6Im1dKWZ/nlp%EA%B0%9C%EB%B0%9C%ED%8C%80"
                 allowpopups></webview>
</template>


<script>
  export default {
    name: 'Calendar',
  };
</script>

<style scoped>
    webview {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        display: inline-flex !important;
    }
</style>