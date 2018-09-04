<template>
        <webview id="foo"
                 src="https://trello.com/b/6Im1dKWZ/nlp%EA%B0%9C%EB%B0%9C%ED%8C%80"
                 allowpopups></webview>
</template>


<script>
  /* eslint-disable */
  const { shell } = require('electron').remote;
  /* eslint-enable */

  export default {
    name: 'Trello',
    mounted() {
      const webview = document.querySelector('webview');
      webview.addEventListener('new-window', (e) => {
        console.log('new window event called');
        const protocol = require('url').parse(e.url).protocol;
        if (protocol === 'http:' || protocol === 'https:') {
          shell.openExternal(e.url);
        }
      });
    },
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