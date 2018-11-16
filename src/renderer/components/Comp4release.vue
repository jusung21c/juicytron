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
  const Store = require('electron-store');
  const store = new Store();

  export default {
    name: 'welcome',
    components: {
      UserConfig,
    },
    data: () => ({
      items: 'hello',
      userdata: store.path,
    }),
    computed: {
    },
    methods: {},
  };
</script>

<style scoped>
</style>
