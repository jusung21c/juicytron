<template>
        <webview id="foo"
                 src="https://calendar.google.com/calendar/r?cid=czI3MjY2Nmtpdm52cnRpZWtzYnI4N3ZpZTBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ"
                 allowpopups></webview>
</template>


<script>
  /* eslint-disable */
  const { shell } = require('electron').remote;
  /* eslint-enable */

  export default {
    name: 'Calendar',
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