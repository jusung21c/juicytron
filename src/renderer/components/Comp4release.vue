<!--suppress ALL -->
<template>
    <div
            id="e3"
            style="margin: auto;"
            class="grey lighten-3"
    >
        <v-container
                fluid
                grid-list-lg
        >
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card color="blue darken-2" class="white--text">
                        <v-card-title primary-title>
                            <div>
                                <div class="headline">Config Status</div>
                                <span>InputPath : {{getInputPath}}</span><br>
                                <span>OutputPath : {{getOutputPath}}</span><br>
                                <span>향지 : {{getNation}}</span><br>
                                <span>현재 설정 버전 : {{getVersion}}</span><br>
                            </div>
                        </v-card-title>
                        <UserConfig/>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card color="blue-grey darken-2" class="white--text">
                        <v-card-title primary-title>
                            <div>
                                <div class="headline">압축을 합시다.</div>
                                <span>압축 파일을 만들어요.</span>
                            </div>
                        </v-card-title>
                        <v-card-actions>
                            <v-btn  :disabled="dialog" :loading="dialog"
                                    class="white--text" color="purple darken-2"
                                    @click="progressDialogOn"
                            >버전 올리고 패킹({{getNextFilename}})</v-btn>
                            <v-btn  :disabled="dialog" :loading="dialog"
                                    class="white--text" color="purple darken-2"
                                    @click="progressDialogOn"
                            >현재 설정 버전으로 패킹({{getFilename}})</v-btn>
                            <v-btn class="white--text" color="purple darken-2" @click="progressDialogOff">off</v-btn>
                            <v-btn class="white--text" color="purple darken-2" @click="fullComp">targz</v-btn>
                            <v-btn class="white--text" color="purple darken-2" @click="test">targz</v-btn>

                            <ProgressDialog
                                    v-bind:status="dialog"
                                    v-bind:progress="progress"
                                    v-bind:color="dialogColor"
                                    v-bind:message="getProgressMessage"
                            ></ProgressDialog>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex xs4>
                    <v-btn large light>hello</v-btn>
                </v-flex>
                <v-flex xs4>
                    <v-btn large light>hello</v-btn>
                </v-flex>
                <v-flex xs4>
                    <v-btn large light>hello</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  import UserConfig from './Comp4release/config';
  import ProgressDialog from './General/ProgressDialog';
  import { mapGetters } from '../../../node_modules/vuex';

  const Store = require('electron-store');
  const store = new Store();
  const path = require('path');
  const targz = require('targz');
  const fs = require('fs');
  const mkdirp = require('mkdirp');
  const exec = require('child_process').exec;
  const isSymbolicLink = require('is-symbolic-link');
  const tar = require('tar');
  const convert = require('convert-seconds');

  export default {
    name: 'comp4release',
    components: {
      UserConfig,
      ProgressDialog,
    },
    data: () => ({
      items: 'hello',
      dialog: false,
      progress: true,
      dialogColor: '#8181F7',
      message: [],
      vrPath: path.join(store.get('basic.inputpath'), store.get('basic.nation'), 'vr'),
    }),
    computed: {
      ...mapGetters([
        'getInputPath',
        'getOutputPath',
        'getNation',
        'getDirname',
        'getFilename',
        'getNextFilename',
        'getVersion',
        'getNextVersion',
        'getMzServerPath',
        'getMzUserName',
        'getMzPassword',
        'getVrPath',
        'getVrFiexedPath',
        'getOutputDirnamePath',
        'getSympath',
        'getRelativeSymPath',
        'getBzipPath',
        'getProgressMessage',
      ]),
    },
    methods: {
      progressDialogOn() {
        this.dialog = true;
        this.progress = true;
      },
      progressDialogOff() {
        this.dialog = false;
        this.progress = false;
        this.$store.commit('clearProgressMessage');
      },
      pushProgressMessage(msg) {
        this.$store.commit('pushProgressMessage', msg);
      },
      // 고정부,가변부를 targz 로 압축한다.
      fullComp() {
        this.progressDialogOn();
        this.pushProgressMessage('패키지 시작');
        this.checkOutputDir(this.getOutputDirnamePath)
          .then(() => this.checkSymlink(this.getSympath, this.getRelativeSymPath))
          .then(() => this.compTargz(this.getVrPath, path.join(this.getOutputDirnamePath, 'mango-vr.tar.gz')))
          .then(() => this.compTargz(this.getVrFiexedPath, path.join(this.getOutputDirnamePath, 'mango-vr_fixed.tar.gz')))
          .then(() => this.compTargz(this.getOutputDirnamePath, path.join(this.getOutputPath, `${this.getFilename}.tar`)))
          .then(() => this.compTar(this.getOutputPath, this.getFilename, this.getDirname))
          .then(() => this.bz2comp(this.getBzipPath, this.getOutputPath, this.getFilename))
          .then((msg) => {
            console.log(msg);
            this.progress = false;
            this.dialogColor = 'green';
          })
          .catch(err => console.error(err));
      },
      versioning(version) {
        this.$store.commit('setVersion', version);
      },
      compTargz(input, dest) {
        return new Promise((resolve, reject) => {
          fs.readdir(input, (err) => {
            if (!err) {
              console.log(`${input} 압축을 시작합니다.`);
              this.pushProgressMessage(`${input} 압축을 시작합니다.`);
              const startTime = performance.now();
              targz.compress({
                src: input,
                dest,
              }, (err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                }
                const time = (performance.now() - startTime) / 1000;
                this.pushProgressMessage(`압축이 끝났습니다.
                (${convert(time).hours}시간
                ${convert(time).minutes}분
                ${convert(time).seconds}초 소요)`);
                resolve();
              });
            } else {
              reject(`${input} 경로가 존재하지 않습니다.`);
              console.timeEnd(`${input}`);
            }
          });
        });
      },

      compTar(outputpath, filename, dirname) {
        return new Promise((resolve, reject) => {
          try {
            tar.c({ z: false, f: path.join(outputpath, `${filename}.tar`), cwd: outputpath }, [`.\\${dirname}`]);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      },
      checkSymlink(sympath, relativeSymPath) {
        return new Promise((resolve, reject) => {
          isSymbolicLink(sympath)
            .then((isLink) => {
              if (isLink) {
                console.log(`${sympath} 심볼릭 링크가 이미 존재하여 생성을 건너 뜁니다.`);
                this.pushProgressMessage(`${sympath} \n심볼릭 링크가 이미 존재하여 생성을 건너 뜁니다.`);
                resolve();
              } else {
                fs.symlink(relativeSymPath, sympath, (err) => {
                  if (err) {
                    console.error(err);
                    resolve();
                    // reject(err);
                  } else {
                    console.log('심볼릭 링크 생성 완료!');
                    this.pushProgressMessage('심볼릭 링크 생성 완료!');
                    resolve('심볼릭 링크 생성 완료!');
                  }
                });
              }
            })
            .catch(err => reject(err));
        });
      },

      checkOutputDir(outputdirnamepath) {
        return new Promise((resolve) => {
          fs.readdir(outputdirnamepath, (error) => {
            if (error) {
              console.error(`${outputdirnamepath} 폴더가 없어 생성합니다.`);
              mkdirp(outputdirnamepath, (error) => {
                console.error(error);
                return resolve(error);
              });
            }
            console.log('폴더존재');
            this.pushProgressMessage('폴더 존재');
            return resolve();
          });
        });
      },

      bz2comp(bzippath, outputPath, filename) {
        return new Promise((resolve, reject) => {
          console.log('bz2 압축을 시작합니다.');
          this.pushProgressMessage('bz2 압축을 시작합니다.');
          const startTime = performance.now();
          console.time('bz2');
          exec(`cmd /c CHCP 65001 | ${bzippath} -f ${path.join(outputPath, `${filename}.tar`)}`, (error, stdout, stderr) => {
            if (!stderr && !error) {
              console.log(stdout);
              this.pushProgressMessage(stdout);
              const time = (performance.now() - startTime) / 1000;
              this.pushProgressMessage(`bz2 압축이 끝났습니다.
              (${convert(time).hours}시간
              ${convert(time).minutes}분
              ${convert(time).seconds}초 소요)`);

              resolve();
            } else {
              const time = (performance.now() - startTime) / 1000;
              this.pushProgressMessage(
                `${convert(time).hours}시간 ${convert(time).minutes}분 ${convert(time).seconds}초 소요`);
              reject(error);
            }
          });
        });
      },
      test() {
        this.dialog = true;
        this.progress = false;
      },
    },
  };
</script>

<style scoped>
</style>
