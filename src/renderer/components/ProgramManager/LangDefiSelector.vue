<template>
    <v-layout align-center justify-center>
        <v-flex>
            <transition name="fade">
            <v-autocomplete
                    v-model="propSelectedLang"
                    :items="getLangList"
                    :label="`언어를 선택해 주세요.`"
                    persistent-hint
                    prepend-icon="map"
                    v-if="checkLanglist"
            >
            </v-autocomplete>
            </transition>
        </v-flex>
        <v-flex>
            <transition name="fade">
            <v-autocomplete
                    v-model="propSelectedDefi"
                    :items="defiList"
                    :label="`Definition을 선택해주세요.`"
                    persistent-hint
                    prepend-icon="subject"
                    v-if="checkLanglist"
            >
            </v-autocomplete>
            </transition>
        </v-flex>
    </v-layout>
</template>

<script>
  export default {
    name: 'lang-defi-selector',
    props: ['langlist', 'procdata', 'selectedlang', 'selecteddefi'],
    data() {
      return {
        lang: '',
        isEditing: true,
      };
    },
    computed: {
      propSelectedLang: {
        get() {
          return this.selectedlang;
        },
        set(lang) {
          this.lang = lang;
          this.$emit('getSelectedLang', lang);
        },
      },
      propSelectedDefi: {
        get() {
          return this.selecteddefi;
        },
        set(defi) {
          this.$emit('getSelectedDefi', defi);
        },
      },
      defiList() {
        const baseLang = this.lang;
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
        // const langlist = this.langlist;
        // if (langlist.indexOf('KOK') !== -1) this.$emit('getSelectedLang', 'KOK');
        // else if (langlist.indexOf('ENG') !== -1) this.$emit('getSelectedLang', 'ENG');
        // else if (langlist.indexOf('ENU') !== -1) this.$emit('getSelectedLang', 'ENU');
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