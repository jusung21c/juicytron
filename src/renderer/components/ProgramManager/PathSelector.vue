
<template>
    <v-layout row wrap my-4>
        <v-text-field
                label="INPUT 폴더 경로를 선택해 주세요."
                v-model="inputpath"
                :rules="dirRules"
                required
        ></v-text-field>
        <v-btn @click="openDir">찾기</v-btn>
    </v-layout>
</template>

<script>
  /* eslint-disable */
    const { dialog } = require('electron').remote;
  /* eslint-enable */
  export default {
    name: 'PathSelector',
    props: ['inputpath'],
    data() {
      return {
        dirRules: [
          v => !!v || '경로가 존재 하여야 합니다.',
        ],
      };
    },
    methods: {
      openDir() {
        dialog.showOpenDialog({
          properties: ['openDirectory'],
        }, (selectedFiles) => {
          if (selectedFiles !== undefined) {
            const selectedpath = selectedFiles.toString();
            this.$emit('selectedPath', selectedpath);
          }
        });
      },
    },

  };
</script>

<style scoped>

</style>