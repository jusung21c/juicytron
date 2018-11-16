<template>
    <v-container grid-list-xl text-xs-center>
        <v-dialog v-model="helpdialog" max-width="800px">
            <v-card>
                <v-card-title>
                    <h1>Help - Program Manager</h1>
                    <h2>프로그램 DB의 프로시져를 다른 언어로 확장전개 하는 툴 입니다.</h2>
                </v-card-title>
                <v-card-text>
                    <h2>1. Program Builder/ input 폴더의 디렉토리를 설정합니다.</h2>
                    <h2>2. 기준이 될 언어 / Definition / 프로시져를 선택합니다. </h2>
                    <h2>3. 편집된 프로시져 혹은 하단 에디터 창에서 편집을 마치고 확인 버튼을 누릅니다.</h2>
                    <h2>4. 확장전개할 언어를 선택하고 확인을 누릅니다.</h2>
                    <h2>5. BeyondCompare등 diff 툴을 사용하여 변경을 확인합니다.</h2>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.stop="helpdialog=false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-flex xs6 offset-xs3>
            <v-alert :value="true" type="error" v-for="error in alerterror">{{error}}</v-alert>
            <v-alert :value="true" type="success" v-for="suc in alertsuccess">{{suc}}</v-alert>
        </v-flex>
        <v-flex xs8 offset-xs2 my-4>
            <v-card dark color="purple">
                <v-card-title>
                    <h1>Program Manager</h1>
                    <v-spacer></v-spacer>
                    <v-btn color="green" @click.stop="helpdialog = true">HELP</v-btn>
                </v-card-title>
            </v-card>
        </v-flex>
        <v-layout row wrap>
            <v-flex xs8 offset-xs2>
                <PathSelector
                        v-bind:path="inputpath"
                        v-bind:description="`Program Builder / input 폴더를 선택해주세요.`"
                        @selectedPath="getPInputDir"
                ></PathSelector>
            </v-flex>
            <v-flex xs8 offset-xs2>
                <transition name="fade">
                    <LangDefiSelector
                            v-bind:langlist="langlist"
                            v-bind:procdata="procdata"
                            v-bind:selecteddefi="selecteddefi"
                            v-if="inputpath"
                            @getSelectedLang="getSelectedLang"
                            @getSelectedDefi="getSelectedDefi"
                    ></LangDefiSelector>
                </transition>
            </v-flex>
            <v-flex xs8 offset-xs2>
                <transition name="fade">
                    <ProcedureSelector v-bind:procdata="procdata"
                                       v-bind:selectedlang="selectedlang"
                                       v-bind:selecteddefi="selecteddefi"
                                       v-if="selecteddefi"
                                       @getSelectedProcedure="getSelectedProcedure"
                    ></ProcedureSelector>
                </transition>
            </v-flex>
        </v-layout>
        <v-layout wrap>
            <v-flex xs12>
                <transition name="fade">
                    <ProcTextArea
                            v-bind:text="selectedPBody"
                            v-bind:selectedprocedure="selectedprocedure"
                            v-bind:label="`${selectedlang} - ${selecteddefi}`"
                            @modifiedText="getModifiedPBody"
                            v-if="selectedprocedure"
                            style="text-align: left;"
                    ></ProcTextArea>
                </transition>
                <transition name="fade">
                    <ConfirmModal
                            v-bind:procdata="procdata"
                            v-bind:selectedlang="selectedlang"
                            v-bind:selecteddefi="selecteddefi"
                            v-bind:selectedprocedure="selectedprocedure"
                            @getSelectedTargetLangs="getSelectedTargetLangs"
                            v-if="selectedprocedure"
                    ></ConfirmModal>
                </transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import PathSelector from './General/PathSelector';
  import LangDefiSelector from './ProgramManager/LangDefiSelector';
  import ProcedureSelector from './ProgramManager/ProcedureSelector';
  import ProcTextArea from './ProgramManager/ProcTextArea';
  import ConfirmModal from './ProgramManager/ConfirmModal';

  const fs = require('fs');
  const path = require('path');
  const Finder = require('fs-finder');


  export default {
    components: {
      PathSelector,
      LangDefiSelector,
      ProcedureSelector,
      ProcTextArea,
      ConfirmModal,
    },
    name: 'home',
    data() {
      return {
        inputpath: '',
        defilist: [],
        langlist: [],
        procdata: [],
        selectedlang: '',
        selecteddefi: '',
        selectedprocedure: '',
        selectedpbody: '',
        selectedtargetlangs: [],
        helpdialog: '',
        alertsuccess: [],
        alerterror: [],
      };
    },
    computed: {
      selectedPBody() {
        let procdata = this.procdata;
        procdata = procdata.filter(obj => obj.lang === this.selectedlang);
        procdata = procdata.filter(obj => obj.definition === this.selecteddefi);
        procdata = procdata.filter(obj => obj.pname === this.selectedprocedure);
        this.selectedpbody = procdata[0].pbody;
        return procdata[0].pbody;
      } },
    methods: {
      getLangListOfInputPath(inputFolderPath) {
        // 변수에 해당하는 경로 하위에 3글자인 디렉토리 명들을 찾아서 리턴한다.
        let dirpath;
        const lang = [];
        try {
          const directories = Finder.in(inputFolderPath).findDirectories();
          directories.forEach((dir) => {
            dirpath = path.normalize(dir);
            dirpath = path.basename(dirpath);
            if (dirpath.length === 3 && dirpath === dirpath.toUpperCase()) {
              lang.push(dirpath);
            }
          });
          lang.sort();
          return lang;
        } catch (e) {
          console.log(e);
        }
        return lang;
      },
      getFileListByExtname(folderpath, extname) {
        // getFileListByExtname('경로','.DEFINITION')
        let dirpath;
        const definition = [];
        try {
          const directories = Finder.in(folderpath).findFiles();
          directories.forEach((dir) => {
            dirpath = path.normalize(dir);
            dirpath = path.basename(dirpath);
            if (path.extname(dirpath) === extname) {
              definition.push(dirpath);
            }
          });
          definition.sort();
          return definition;
        } catch (e) {
          console.log(e);
        }
        return '';
      },
      getRegexedResult(regex, string) {
        const arrResult = [];
        let result;
        while ((result = regex.exec(string)) !== null) {
          arrResult.push(result);
        }
        return arrResult;
      },
      getData(inputpath) {
        const langlist = this.getLangListOfInputPath(inputpath);
        this.langlist = langlist;
        const procdata = [];
        langlist.forEach((lang) => {
          try {
            const langpath = path.join(inputpath, lang);
            const definitionlist = this.getFileListByExtname(langpath, '.DEFINITION');
            definitionlist.forEach((definition) => {
              const definitionpath = path.join(langpath, definition);
              const content = fs.readFileSync(definitionpath, 'utf8');
              const regexProc = new RegExp(/JINIE[\s]*(.*?)[\s]*\([^]*?EOP/, 'gm');
              const regexedProcs = this.getRegexedResult(regexProc, content);
              regexedProcs.forEach((regexedproc) => {
                const data = {
                  lang,
                  definition,
                  definitionpath,
                  pname: regexedproc[1],
                  pbody: regexedproc[0],
                };
                procdata.push(data);
              });
            });
          } catch (e) {
            this.alerterror.push(e);
          }
        });
        return procdata;
      },
      getPInputDir(inputpath) {
        if (this.inputpath !== inputpath) {
          this.selectedlang = '';
          this.selecteddefi = '';
          this.selectedprocedure = '';
          this.selectedpbody = '';
          this.alertsuccess = [];
          this.alerterror = [];
        }
        this.inputpath = inputpath;
        this.procdata = this.getData(inputpath);
      },
      getSelectedLang(selectedlang) {
        if (this.selectedlang !== selectedlang) {
          this.selecteddefi = '';
          this.selectedprocedure = '';
          this.selectedpbody = '';
          this.alertsuccess = [];
          this.alerterror = [];
        }
        this.selectedlang = selectedlang;
      },
      getSelectedDefi(selecteddefi) {
        if (this.selecteddefi !== selecteddefi) {
          this.selectedprocedure = '';
          this.selectedpbody = '';
          this.alertsuccess = [];
          this.alerterror = [];
        }
        this.selecteddefi = selecteddefi;
      },
      getSelectedProcedure(selectedprocedure) {
        this.selectedprocedure = selectedprocedure;
        this.alertsuccess = [];
        this.alerterror = [];
      },
      getModifiedPBody(modifiedText) {
        this.selectedpbody = modifiedText;
      },
      getSelectedTargetLangs(selectedtargetlangs) {
        this.selectedtargetlangs = selectedtargetlangs;
        this.replaceModifedProc();
      },
      replaceModifedProc() {
        const replace = require('replace-in-file');
        const path = require('path');
        const testRegex = `JINIE[\\s]*${this.selectedprocedure}[\\s]*[\\s\\S]*?EOP`;
        // const testRegex = `JINIE[\\s]*${this.selectedprocedure}[\\s]`;
        console.log(testRegex);
        this.selectedtargetlangs.forEach((lang) => {
          const options = {
            files: path.join(this.inputpath, lang, this.selecteddefi),
            from: new RegExp(testRegex, 'gm'),
            to: this.selectedpbody,
          };
          console.log(options);
          replace(options)
            .then((changes) => {
              console.log('Modified files:', changes.join(', '));
              if (changes.length !== 0) {
                this.alertsuccess.push(changes.join(', '));
              }
            })
            .catch((error) => {
              console.error('Error occurred:', error);
            });
        });
      },
    },
  };

</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>