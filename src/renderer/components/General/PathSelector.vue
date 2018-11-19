
<template>
    <v-container>
        <v-flex>
    <h3>{{description}}</h3>
        </v-flex>
    <v-layout row wrap>
        <v-text-field
                label="경로를 선택해 주세요."
                v-model="propPath"
                :rules="dirRules"
                required
        ></v-text-field>
        <v-btn @click="openDir">찾기</v-btn>
    </v-layout>
    </v-container>
</template>

<script>
  /* eslint-disable */
    const { dialog } = require('electron').remote;
  /* eslint-enable */
  export default {
    name: 'PathSelector',
    props: ['path', 'description'],
    data() {
      return {
        dirRules: [
          v => !!v || '경로가 존재 하여야 합니다.',
        ],
      };
    },
    computed: {
      propPath: {
        get() {
          return this.path;
        },
        set(value) {
          this.$emit('selectedPath', value);
        },
      },
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