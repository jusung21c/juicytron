<template>
    <v-container grid-list-xl text-xs-center>
        <v-flex>
            <v-alert
                    :value="true"
                    type="error"
                    v-for="error in alerterror"
            >
                {{error}}
            </v-alert>
            <v-alert
                    :value="true"
                    type="success"
                    v-for="suc in alertsuccess"
            >
                {{suc}}
            </v-alert>
            <PathSelector
                    v-bind:inputpath="selectedpath"
                    @selectedPath="getPath"
            ></PathSelector>
            <transition name="fade">
                <v-btn @click="getData" v-if="selectedpath" transition="fade">정렬!</v-btn>
            </transition>
        </v-flex>
        <v-dialog v-model="helpdialog" max-width="800px">
            <v-card>
                <v-card-title>
                    <h1>Help - Literal Sorter</h1>
                    <h2>리터럴 테이블의 프롬프트와 LID를 정렬해 주는 툴 입니다.</h2>
                </v-card-title>
                <v-card-text>

                <h2>1. Table Builer / Input 경로를 설정합니다.</h2>
                <h2>2. 정렬 버튼을 누른다.</h2><br>
                    <h3>이 툴의 로직과 알고리즘은</h3>
                    <h3>*_input의 경로를 설정하면 input폴더안의 3글자인 디렉토리명을 가져오고(언어들) 그언어들을 통해서 리터럴 deifinition을 찾습니다.</h3>
                    <h3>*_각 definition의 %TAG ~ %LID / %LID ~ %LEX 부분을 탐색합니다.</h3>
                    <h3>*_%TAG ~ %LID 중 %TAG 바로 아래 %~~~/ !THIS_IS_JUST_VERSION ~~~ / THIS_IS_JUST_VERSION ~~~~ 을 탐색합니다.</h3>
                    <h3>*_나머지 라인들을 정렬합니다. (변수처럼 처리 안하고 각 한줄 통째로 인식하게 작성했습니다.)</h3>
                    <h3>*_기존 파일에 write 합니다.</h3>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.stop="helpdialog=false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-layout>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click.stop="helpdialog = true">?</v-btn>
        </v-layout>
    </v-container>
</template>

<script>
  import PathSelector from './ProgramManager/PathSelector';

  const fs = require('fs');
  const path = require('path');
  const Finder = require('fs-finder');

  export default {
    name: 'PromptSorter',
    components: {
      PathSelector,
    },
    data() {
      return {
        selectedpath: '',
        alertsuccess: [],
        alerterror: [],
        helpdialog: false,
      };
    },
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
      getLiteralPath() {
        const langlist = this.getLangListOfInputPath(this.selectedpath);
        const arrPath = [];
        langlist.forEach((val) => {
          arrPath.push(path.join(this.selectedpath, val, `LITERAL.${val}.TABLE.DEFINITION`));
        });
        return arrPath;
      },
      getRegexedResult(regex, string) {
        const arrResult = [];
        let result;
        while ((result = regex.exec(string)) !== null) {
          arrResult.push(result);
        }
        return arrResult;
      },
      getData() {
        const regexPrompt = new RegExp(/^(%TAG)[^]*?(%.*)[^]*?(! THIS_IS_JUST_VERSION.*)[^]*?(! THIS_IS_JUST_VERSION.*)([^]*?)%LID/, 'gm');
        const regexLid = new RegExp(/^(%LID.*)[^]*?(! THIS_IS_JUST_VERSION.*)[^]*?(! THIS_IS_JUST_VERSION.*)([^]*?)%LEX/, 'gm');
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        const replace = require('replace-in-file');
        this.getLiteralPath().forEach((literalpath) => {
          try {
            const content = fs.readFileSync(literalpath, 'utf8');
            const regexedPrompt = this.getRegexedResult(regexPrompt, content);
            const regexedLid = this.getRegexedResult(regexLid, content);
            const prompt = regexedPrompt[0][5];
            const lid = regexedLid[0][4];
            // const promptLines = prompt.split(/^[^\s\t\r\n]*\n/g).sort(collator.compare);
            const promptLines = prompt.match(/.+/g).sort(collator.compare);
            promptLines.unshift(regexedPrompt[0][4]);
            promptLines.unshift(regexedPrompt[0][3]);
            promptLines.unshift(regexedPrompt[0][2]);
            promptLines.unshift(regexedPrompt[0][1]);
            // const lidLines = lid.split('\n').sort(collator.compare);
            const lidLines = lid.match(/.+/g).sort(collator.compare);
            lidLines.unshift(regexedLid[0][3]);
            lidLines.unshift(regexedLid[0][2]);
            lidLines.unshift(regexedLid[0][1]);
            let promptContent = '';
            promptLines.forEach((val) => {
              promptContent += `${val}\n`;
            });
            promptContent += '%LID';
            let lidContent = '';
            lidLines.forEach((val) => {
              lidContent += `${val}\n`;
            });
            lidContent += '%LEX';
            const options = {
              files: literalpath,
              from: [new RegExp(/%TAG[^]*?%LID/, 'gm'), new RegExp(/%LID[^]*?%LEX/, 'gm')],
              to: [promptContent, lidContent],
            };
            replace(options)
              .then((changes) => {
                console.log('Modified files:', changes.join(', '));
                this.alertsuccess.push(changes.join(', '));
              })
              .catch((error) => {
                console.error('Error occurred:', error);
                this.alerterror.push(error);
              });
          } catch (e) {
            this.alerterror.push(e);
          }
        });
      },
      getPath(path) {
        this.selectedpath = path;
        this.alertsuccess = [];
        this.alerterror = [];
      },
    },
  };

</script>

<style scoped>

</style>