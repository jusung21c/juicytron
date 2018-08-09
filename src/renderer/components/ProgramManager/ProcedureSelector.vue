<template>
        <v-flex>
            <v-autocomplete
                    v-model="selectedprocedure"
                    :items="procList"
                    :label="`프로시져를 선택해 주세요.`"
                    persistent-hint
                    prepend-icon="create"
                    v-if="checkLangDefiList"
                    @change="selectedProcedure"
            >
            </v-autocomplete>
        </v-flex>
</template>

<script>
  export default {
    name: 'definition-selector',
    props: ['procdata', 'selectedlang', 'selecteddefi'],
    data() {
      return {
        selectedprocedure: '',
        isEditing: true,
      };
    },
    computed: {
      checkLangDefiList() {
        return this.selecteddefi.length !== 0;
      },
      procList() {
        const selectedlang = this.selectedlang;
        const selecteddefi = this.selecteddefi;
        let arr = [];
        const arr2 = [];
        arr = this.procdata.filter(obj => obj.lang === selectedlang);
        arr = arr.filter(obj => obj.definition === selecteddefi);
        arr.forEach((obj) => {
          arr2.push(obj.pname);
        });
        return arr2;
      },
    },
    methods: {
      selectedProcedure() {
        this.$emit('getSelectedProcedure', this.selectedprocedure);
      },
    },

  };
</script>

<style scoped>
    .transition {
        transition: all 6s linear;
        position: fixed;
        top: 0;
        display: block;
    }
</style>