<template>
    <v-container fluid>
        <v-layout row wrap align-center>
            <transition name="fade" mode="out-in">
                <v-flex xs6>
                    <v-select
                            :items="langlist"
                            v-model="selectedlang"
                            auto
                            label="대표 언어를 설정해주세요."
                            hide-details
                            prepend-icon="map"
                            single-line
                    ></v-select>
                </v-flex>
            </transition>
                <transition name="fade" mode="out-in">
                <v-flex xs6>
                    <v-select
                            :items="defiList"
                            v-model="selecteddefi"
                            auto
                            label="DEFINITION 파일을 선택해주세요"
                            hide-details
                            prepend-icon="create"
                            single-line
                            v-if="selectedlang"
                    ></v-select>
                </v-flex>
            </transition>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
      name: 'lang-defi-selector',
      props: ['PROS', 'defilist'],
      data() {
        return {
          selectedlang: '',
          selecteddefi: '',
        };
      },
      computed: {
        langlist() {
          const arrLang = [];
          this.PROS.forEach((value) => {
            arrLang.push(value.lang);
          });
          console.log(arrLang);
          return arrLang;
        },
        defiList() {
          const baseLang = this.selectedlang;
          const arr = [];
          this.PROS.forEach((value) => {
            if (value.lang === baseLang) {
              value.programs.forEach((program) => {
                arr.push(program.programfile);
              });
            }
          });
          return arr;
        },
      },
      methods: {
        setLangList() {

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