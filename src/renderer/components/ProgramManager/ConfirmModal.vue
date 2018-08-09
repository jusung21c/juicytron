<template>

    <v-dialog v-model="dialog" max-width="500" scrollable>
        <v-btn slot="activator" color="primary" dark>확인</v-btn>
        <v-card>
            <v-card-title
                    class="headline blue lighten-2"
                    primary-title
            > 확대할 언어를 선택해 주세요.
            </v-card-title>
            <v-divider></v-divider>
            <v-switch
                    v-model="selectedlangs"
                    v-for="lang in getSelectableLangs"
                    v-bind:value="lang"
                    v-bind:label="lang"
            ></v-switch>

            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="blue darken-1" flat @click.native="selectEUNavi">유럽네비</v-btn>
                <v-btn color="blue darken-1" flat @click.native="selectEUNoNavi">유럽X네비</v-btn>
                <v-btn color="blue darken-1" flat @click.native="selectAll">전체선택/해제</v-btn>
            </v-card-actions>
            <v-card-actions>
                <v-btn color="green darken-1" @click.native="doCancel">취소</v-btn>
                <v-btn color="green darken-1" @click.native="selectedTargetLangs">확인</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>

</template>

<script>
  export default {
    name: 'ConfirmModal',
    props: ['procdata', 'selectedlang', 'selecteddefi', 'selectedprocedure'],
    data() {
      return {
        selectedlangs: [],
        selectablelangs: [],
        EUNavilist: ['DUN', 'ENG', 'FRF', 'GED', 'ITI', 'SPE'],
        dialog: false,
      };
    },
    computed: {
      getSelectableLangs() {
        let procdata = this.procdata;
        const arr = [];
        procdata = procdata.filter(obj => obj.pname === this.selectedprocedure);
        procdata.forEach((proc) => {
          arr.push(proc.lang);
        });
        this.selectablelangs = arr;
        return arr;
      },

    },
    methods: {
      doCancel() {
        this.selectedlangs = [];
        this.dialog = false;
      },
      selectAll() {
        if (this.selectedlangs === this.selectablelangs) {
          this.selectedlangs = [];
        } else {
          this.selectedlangs = this.selectablelangs;
        }
      },
      selectEUNavi() {
        this.EUNavilist.forEach((lang) => {
          if (this.selectablelangs.indexOf(lang) !== -1 && this.selectedlangs.indexOf(lang) === -1) {
            this.selectedlangs.push(lang);
          }
        });
      },
      selectEUNoNavi() {
        const noNavi = [];
        this.selectablelangs.forEach((lang) => {
          noNavi.push(lang);
        });
        this.EUNavilist.forEach((lang) => {
          if (noNavi.indexOf(lang) !== -1) {
            noNavi.splice(noNavi.indexOf(lang), 1);
          }
        });
        noNavi.forEach((lang) => {
          if (this.selectedlangs.indexOf(lang) === -1) {
            this.selectedlangs.push(lang);
          }
        });
      },
      selectedTargetLangs() {
        this.$emit('getSelectedTargetLangs', this.selectedlangs);
        this.dialog = false;
      },
    },
  };
</script>

<style scoped>

</style>