<template>
    <v-container grid-list-xl text-xs-center>
        <v-layout row wrap>
            <v-flex xs8 offset-xs2>
                <PathSelector
                        v-bind:inputpath="inputpath"
                        @selectedPath="getPInputDir"
                ></PathSelector>
            </v-flex>
            <v-flex xs8 offset-xs2>
                <LangDefiSelector
                        v-bind:langlist="langlist"
                        v-bind:procdata="procdata"
                        @getSelectedLangDefi="getSelectedLangDefi"
                ></LangDefiSelector>
            </v-flex>
            <v-flex xs8 offset-xs2>
                <ProcedureSelector v-bind:procdata="procdata"
                                   v-bind:selectedlang="selectedlang"
                                   v-bind:selecteddefi="selecteddefi"
                                   @getSelectedProcedure="getSelectedProcedure"
                ></ProcedureSelector>
            </v-flex>
        </v-layout>
        <v-layout wrap>
            <v-flex xs12>
                <ProcTextArea
                        v-bind:text="selectedPBody"
                        v-bind:selectedprocedure="selectedprocedure"
                        v-bind:label="`${selectedlang} - ${selecteddefi}`"
                        @modifiedText="getModifiedPBody"
                        v-if="selectedprocedure"
                        style="text-align: left;"
                ></ProcTextArea>
                <ConfirmModal
                        v-bind:procdata="procdata"
                        v-bind:selectedlang="selectedlang"
                        v-bind:selecteddefi="selecteddefi"
                        v-bind:selectedprocedure="selectedprocedure"
                        @getSelectedTargetLangs="getSelectedTargetLangs"
                        v-if="selectedprocedure"
                ></ConfirmModal>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import PathSelector from './ProgramManager/PathSelector';
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
      };
    },
    computed: {
      selectedPBody() {
        let procdata = this.procdata;
        procdata = procdata.filter(obj => obj.lang === this.selectedlang);
        procdata = procdata.filter(obj => obj.definition === this.selecteddefi);
        procdata = procdata.filter(obj => obj.pname === this.selectedprocedure);
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
        });
        return procdata;
      },
      getPInputDir(inputpath) {
        this.inputpath = inputpath;
        this.procdata = this.getData(inputpath);
      },
      getSelectedLangDefi(selectedlang, selecteddefi) {
        if (this.selectedlang !== selectedlang && this.selecteddefi === selecteddefi) {
          this.selecteddefi = '';
          this.selectedprocedure = '';
        }
        this.selectedlang = selectedlang;
        this.selecteddefi = selecteddefi;
        this.selectedprocedure = '';
      },
      getSelectedProcedure(selectedprocedure) {
        this.selectedprocedure = selectedprocedure;
      },
      getModifiedPBody(modifiedText) {
        console.log(`modifiedText : \n${modifiedText}`);
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

</style>