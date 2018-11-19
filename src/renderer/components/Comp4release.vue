<template>
    <v-container
            fluid
            grid-list-xl
            text-xs-center
    >
        <v-layout row wrap>
            <v-flex xs8 offset-xs2>
                <UserConfig/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import UserConfig from './Comp4release/config';

  import { mapGetters } from '../../../node_modules/vuex';
  const Store = require('electron-store');
  // const targz = require('targz');
  const path = require('path');
  // const fs = require('fs');
  // const mkdirp = require('mkdirp');
  // const exec = require('child_process').exec;
  // const isSymbolicLink = require('is-symbolic-link');
  // const tar = require('tar');


  const store = new Store();

  export default {
    name: 'comp4release',
    components: {
      UserConfig,
    },
    data: () => ({
      items: 'hello',
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
      ]),
    },
    methods: {},
  };
</script>

<style scoped>
</style>
