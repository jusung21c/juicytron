<template>
    <v-layout align-center justify-center>
        <v-flex>
            <v-autocomplete
                    v-model="selectedlang"
                    :items="getLangList"
                    :label="`언어를 선택해 주세요.`"
                    persistent-hint
                    prepend-icon="map"
                    v-if="checkLanglist"
                    @change="selectedLangDefi"
            >
            </v-autocomplete>
        </v-flex>
        <v-flex>
            <v-autocomplete
                    v-model="selecteddefi"
                    :items="defiList"
                    :label="`Definition을 선택해주세요.`"
                    persistent-hint
                    prepend-icon="subject"
                    v-if="selectedlang"
                    @change="selectedLangDefi"
            >
            </v-autocomplete>
        </v-flex>
    </v-layout>
</template>

<script>
  export default {
    name: 'lang-defi-selector',
    props: ['langlist', 'procdata'],
    data() {
      return {
        selectedlang: '',
        selecteddefi: '',
        isEditing: true,
      };
    },
    computed: {
      defiList() {
        const baseLang = this.selectedlang;
        let arr = [];
        const arr2 = [];
        arr = this.procdata.filter(obj => obj.lang === baseLang);
        arr.forEach((obj) => {
          arr2.push(obj.definition);
        });
        return arr2;
      },
      checkLanglist() {
        return this.procdata.length !== 0;
      },
      getLangList() {
        const langlist = this.langlist;
        if (langlist.indexOf('KOK') !== -1) this.selectedlang = 'KOK';
        else if (langlist.indexOf('ENG') !== -1) this.selectedlang = 'ENG';
        else if (langlist.indexOf('ENU') !== -1) this.selectedlang = 'ENU';
        return this.langlist;
      },
    },
    methods: {
      selectedLangDefi() {
        this.$emit('getSelectedLangDefi', this.selectedlang, this.selecteddefi);
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