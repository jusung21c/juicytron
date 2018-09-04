<template>
        <webview id="foo"
                 src="https://calendar.google.com/calendar/r?cid=czI3MjY2Nmtpdm52cnRpZWtzYnI4N3ZpZTBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ"
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