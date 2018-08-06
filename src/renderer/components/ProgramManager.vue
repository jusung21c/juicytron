<template>
    <v-layout column justify-center>
        <div>
            <h1>{{inputpath}}</h1>
            <PathSelector v-bind:inputpath="inputpath" @selectedPath="getPInputDir"></PathSelector>
            <test v-bind:proclist="procs"></test>
            <test2 v-bind:proclist="procs"></test2>
        </div>
    </v-layout>
</template>

<script>
    import PathSelector from './ProgramManager/PathSelector';
    import test from './ProgramManager/test';
    import test2 from './ProgramManager/test2';


    export default {
      components: { PathSelector, test, test2 },
      name: 'home',
      data() {
        return {
          inputpath: '',
          procs: ['asd', 'asd2', 'asfdsdaf'],
        };
      },
      methods: {
        getPInputDir(dir) {
          this.inputpath = dir;
        },
      },
    };
</script>

<style scoped>

</style>