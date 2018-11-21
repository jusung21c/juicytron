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
                                <span>현재 설정 버전 : {{getVersion}}</span>
                            </div>
                        </v-card-title>
                        <UserConfig/>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card color="blue-grey darken-2" class="white--text">
                        <v-card-title primary-title>
                            <div>
                                <div class="headline">Unlimited music now</div>
                                <span>Listen to your favorite artists and albums whenever and wherever, online and offline.</span>
                            </div>
                        </v-card-title>
                        <v-card-actions>
                            <v-btn flat dark>Listen now</v-btn>
                            <v-btn
                                    :disabled="dialog"
                                    :loading="dialog"
                                    class="white--text"
                                    color="purple darken-2"
                                    @click="progressDialogOn"
                            >
                                on
                            </v-btn>
                            <v-btn class="white--text" color="purple darken-2" @click="progressDialogOff">off</v-btn>
                            <v-btn class="white--text" color="purple darken-2" @click="targz">targz</v-btn>

                            <ProgressDialog
                                    v-bind:status="dialog"
                                    v-bind:message="getProgressMessage"
                            ></ProgressDialog>
                        </v-card-actions>
                        <h1>{{getProgressMessage}}</h1>
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

  export default {
    name: 'comp4release',
    components: {
      UserConfig,
      ProgressDialog,
    },
    data: () => ({
      items: 'hello',
      dialog: false,
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
        'getVersion',
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
      },
      progressDialogOff() {
        this.dialog = false;
        this.$store.commit('clearProgressMessage');
      },
      pushProgressMessage(msg) {
        this.$store.commit('pushProgressMessage', msg);
      },
      targz() {
        this.progressDialogOn();
        this.pushProgressMessage('패키지 시작');
        this.checkOutputDir(this.getOutputDirnamePath)
          .then(() => this.checkSymlink(this.getSympath, this.getRelativeSymPath))
          .then((msg) => {
            this.pushProgressMessage(msg);
            return this.compTargz(this.getVrPath, path.join(this.getOutputDirnamePath, 'mango-vr.tar.gz'));
          })
          .then(msg => console.log(msg))
          .catch(err => console.error(err));
      },
      compTargz: (input, dest) => new Promise((resolve, reject) => {
        fs.readdir(input, (err) => {
          if (!err) {
            console.log(`${input} 압축을 시작합니다.`);
            this.$store.commit('pushProgressMessage', `${input} 압축을 시작합니다.`);
            this.pushProgressMessage(`${input} 압축을 시작합니다.`);
            console.time('ct');
            targz.compress({
              src: input,
              dest,
            }, (err) => {
              if (err) {
                console.timeEnd('ct');
                console.error(err);
                reject(err);
              }
              console.log(`${input} 압축이 끝났습니다.`);
              console.timeEnd('ct');
              resolve(`${input} 압축이 끝났습니다.`);
            });
          } else {
            reject(`${input} 경로가 존재하지 않습니다.`);
            console.timeEnd(`${input}`);
          }
        });
      }),

      compTar: (outputpath, filename, dirname) => new Promise((resolve, reject) => {
        try {
          tar.c({ z: false, f: path.join(outputpath, `${filename}.tar`), cwd: outputpath }, [`.\\${dirname}`]);
          resolve();
        } catch (error) {
          reject(error);
        }
      }),

      checkSymlink: (sympath, relativeSymPath) => new Promise((resolve, reject) => {
        isSymbolicLink(sympath)
          .then((isLink) => {
            console.log('');
            if (isLink) {
              console.log(`${sympath} 심볼릭 링크가 이미 존재하여 생성을 건너 뜁니다.`);
              resolve('심볼릭 링크가 이미 존재하여 생성을 건너 뜁니다.');
            } else {
              fs.symlink(relativeSymPath, sympath, (err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  console.log('심볼릭 링크 생성 완료!');
                  resolve('심볼릭 링크 생성 완료!');
                }
              });
            }
          })
          .catch(err => console.error(err));
      }),

      checkOutputDir: outputdirnamepath => new Promise((resolve) => {
        fs.readdir(outputdirnamepath, (error) => {
          if (error) {
            console.error(`${outputdirnamepath} 폴더가 없어 생성합니다.`);
            mkdirp(outputdirnamepath, (error) => {
              console.error(error);
              resolve(error);
            });
          } else {
            console.log('폴더존재');
            this.parents.pushProgressMessage('폴더 존재');
            resolve();
          }
        });
      }),

      bz2comp: (bzippath, outputPath, filename) => new Promise((resolve, reject) => {
        console.log('bz2 압축을 시작합니다.');
        console.time('bz2');
        exec(`cmd /c CHCP 65001 | ${bzippath} -f ${path.join(outputPath, `${filename}.tar`)}`, (error, stdout, stderr) => {
          if (!stderr && !error) {
            console.log(stdout);
            console.log('bz2 압축이 끝났습니다.');
            console.timeEnd('bz2');
            resolve('bz2 압축이 끝났습니다.');
          } else {
            console.timeEnd('bz2');
            reject(error);
          }
        });
      }),
    },
  };
</script>

<style scoped>
</style>
