<template>
    <v-container
            fluid
            grid-list-xl
            text-xs-center
    >
        <v-layout row wrap>
            <v-flex xs8 offset-xs2>
                <UserConfig/>
                <v-btn @click="targz">hello</v-btn>
            </v-flex>
            <h1>{{getVrPath}}</h1>
            <h1>{{getVrFiexedPath}}</h1>
            <h1>{{getSympath}}</h1>
            <v-progress-circular
                    indeterminate
                    color="primary"
                    v-if=progress
            ></v-progress-circular>
        </v-layout>
    </v-container>
</template>

<script>
  import UserConfig from './Comp4release/config';

  import { mapGetters } from '../../../node_modules/vuex';
  const Store = require('electron-store');
  const store = new Store();
  const path = require('path');
  const comp4release = require('./Comp4release/comp4release.js');

  export default {
    name: 'comp4release',
    components: {
      UserConfig,
    },
    data: () => ({
      items: 'hello',
      progress: false,
      vrPath: path.join(store.get('basic.inputpath'), store.get('basic.nation'), 'vr'),
    }),
    computed: {
      ...mapGetters([
        'getInputPath',
        'getOutputPath',
        'getNation',
        'getDirname',
        'getFilename',
        'getVersion',
        'getMzServerPath',
        'getMzUserName',
        'getMzPassword',
        'getVrPath',
        'getVrFiexedPath',
        'getOutputDirnamePath',
        'getSympath',
        'getRelativeSymPath',
        'getBzipPath',
      ]),
    },
    methods: {
      targz() {
        console.log('hello');
        this.progress = true;
        comp4release.checkOutputDir(this.getOutputDirnamePath)
          .then(() => comp4release.checkSymlink(this.getSympath, this.getRelativeSymPath))
          .then(() => comp4release.compTargz(this.getVrPath, path.join(this.getOutputDirnamePath, 'mango-vr.tar.gz')));
      },
    },
  };
</script>

<style scoped>
</style>
