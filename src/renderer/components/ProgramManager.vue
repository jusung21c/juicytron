<template>
    <v-layout column justify-center>
        <div>
            <h1>{{inputpath}}</h1>
            <PathSelector v-bind:inputpath="inputpath" @selectedPath="getPInputDir"></PathSelector>
            <LangDefiSelector v-bind:PROS="PROS" v-bind:defilist="defilist"></LangDefiSelector>
            <p>{{langlist}}</p>
            <p>{{PROS}}</p>
        </div>
    </v-layout>
</template>

<script>
    import PathSelector from './ProgramManager/PathSelector';
    import LangDefiSelector from './ProgramManager/LangDefiSelector';
    const fs = require('fs');
    const path = require('path');
    const Finder = require('fs-finder');

    function getLangListOfInputPath(inputFolderPath) {
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
    }
    function getFileListByExtname(folderpath, extname) {
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
    }
    function getRegexedResult(regex, string) {
      const arrResult = [];
      // let result;
      const result = regex.exec(string);
      result.forEach((result) => {
        arrResult.push(result);
      });
      // while ((result = regex.exec(string)) !== null) {
      //   arrResult.push(result);
      // }
      return arrResult;
    }
    function getContentFromDefinition(defipath) {
      // 해당경로 definition 파일의 프로시져를 {pname:'프로시저이름',pbody:'프로시져 전체내용'} 의 객체로 리턴
      const content = fs.readFileSync(defipath, 'utf8');
      const regexProc = new RegExp(/JINIE[\s]*(.*?)[\s]*\([^]*?EOP/, 'gm');
      const arrProcs = [];
      const procs = getRegexedResult(regexProc, content);
      procs.forEach((value) => {
        const a = {
          pname: value[1],
          pbody: value[0],
        };
        arrProcs.push(a);
      });
      return arrProcs;
    }
    function getData(inputFolderPath) {
      const langList = getLangListOfInputPath(inputFolderPath);
      const data = [];

      langList.forEach((lang) => {
        const langpath = path.join(inputFolderPath, lang);
        const DefiList = getFileListByExtname(langpath.toString(), '.DEFINITION');
        const arrProc = [];
        DefiList.forEach((definame) => {
          const result = getContentFromDefinition(path.join(langpath, definame));
          const obj = {
            programfile: definame,
            proc: result,
          };
          arrProc.push(obj);
        });
        const obj = {
          lang,
          programs: arrProc,
        };
        data.push(obj);
      });
      console.log(`###DATA### \n${data}`);
      return data;
    }

    export default {
      components: { PathSelector, LangDefiSelector },
      name: 'home',
      data() {
        return {
          inputpath: '',
          defilist: [],
          langlist: [],
          PROS: [] };
  },
      computed: {},
      methods: {
        getPInputDir(inputpath) {
          this.inputpath = inputpath;
          this.PROS = getData(this.inputpath);
        },
      },
    };

</script>

<style scoped>

</style>