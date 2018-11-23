<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" overflow hide-overlay transition="dialog-bottom-transition" max-width="1000px">
            <v-btn slot="activator" color="green" light>설정</v-btn>
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click.native="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click.native="dialog = false">Save</v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <v-list-tile avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>기본설정</v-list-tile-title>
                        <v-list-tile-sub-title>기본 설정 입니다.
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>

                <v-flex>
                    <PathSelector
                            v-bind:path="getInputPath"
                            v-bind:description="`input 폴더를 선택해주세요. (예: C:\\LP_Src\\IQS_18MY_Hybrid_Wide_STD\\Release\\Input\\)`"
                            @selectedPath="pullInputPath"
                    ></PathSelector>
                </v-flex>
                <v-flex>
                    <PathSelector
                            v-bind:path="getOutputPath"
                            v-bind:description="`output 폴더를 선택해주세요. (예: C:\\Output)`"
                            @selectedPath="pullOutputPath"
                    ></PathSelector>
                    <FileSelector
                            v-bind:path="getBzipPath"
                            v-bind:description="`Bzip.exe 경로를 설정해주세요.`"
                            @selectedPath="pullBzipPath"
                    ></FileSelector>
                </v-flex>
                <v-container grid-list-md text-xs-center>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-text-field
                                    label="향지를 적어주세요. (예: EU)"
                                    v-model="computedNation"
                                    :rules="blankrule"
                                    required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    label="vrdb의 디렉토리이름을 적어주세요. (예: vreu)"
                                    v-model="computedDirname"
                                    :rules="blankrule"
                                    required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    label="최종 패키징될 파일의 이름을 적어주세요. (예: vreu-5w-0.00.52)"
                                    v-model="computedFilename"
                                    :rules="blankrule"
                                    required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    label="현재버전"
                                    v-model="computedVersion"
                                    readonly true
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-list-tile avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>파일서버 설정</v-list-tile-title>
                        <v-list-tile-sub-title>파일서버의 경로와 아이디/비밀번호를 설정합니다.
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-container grid-list-md text-xs-center>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                    label="파일 서버의 업로드할 경로를 적어주세요 (예: \\192.168.123.5\mz\GEN5.0_AVN_Wide_EU\Temp)"
                                    v-model="computedMzServerPath"
                                    :rules="blankrule"
                                    required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    label="서버 아이디를 적어주세요."
                                    v-model="computedMzUsername"
                                    :rules="blankrule"
                                    required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    label="비밀번호를 적어주세요."
                                    v-model="computedMzPassword"
                                    :rules="blankrule"
                                    required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
  import PathSelector from '../General/PathSelector';
  import FileSelector from '../General/FileSelector';
  import { mapGetters, mapMutations } from '../../../../node_modules/vuex';
  const Store = require('electron-store');
  const store = new Store();
  export default {
    components: {
      FileSelector,
      PathSelector,
    },
    name: 'config',
    data: () => ({
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      version: this.computedVersion,
      mzserverpath: store.get('mz.serverpath'),
      mzusername: store.get('mz.username'),
      mzpassword: store.get('mz.password'),
      blankrule: [
        v => !!v || '빈값이면 안되요.',
      ],
    }),
    computed: {
      ...mapGetters([
        'getInputPath',
        'getOutputPath',
        'getBzipPath',
      ]),
      computedNation: {
        get() {
          return this.$store.getters.getNation;
        },
        set(value) {
          store.set('basic.nation', value);
          this.$store.commit('setNation', value);
        },
      },
      computedDirname: {
        get() {
          return this.$store.getters.getDirname;
        },
        set(value) {
          store.set('basic.dirname', value);
          this.$store.commit('setDirname', value);
        },
      },
      computedFilename: {
        get() {
          return this.$store.getters.getFilename;
        },
        set(value) {
          store.set('basic.filename', value);
          this.$store.commit('setFilename', value);
        },
      },
      computedVersion: {
        get() {
          const regex = new RegExp(/[\d]{1,2}\.[\d]{1,2}\.[\d]{1,2}/, 'gm');
          const version = this.computedFilename.match(regex)[0];
          store.set('basic.version', version);
          this.$store.commit('setVersion', version);
          return version;
        },
      },
      computedMzServerPath: {
        get() {
          return this.$store.getters.getMzServerPath;
        },
        set(value) {
          store.set('mz.serverpath', value);
          this.$store.commit('setMzServerPath', value);
        },
      },
      computedMzUsername: {
        get() {
          return this.$store.getters.getMzUserName;
        },
        set(value) {
          store.set('mz.username', value);
          this.$store.commit('setMzUserName', value);
        },
      },
      computedMzPassword: {
        get() {
          return this.$store.getters.getMzPassword;
        },
        set(value) {
          store.set('mz.mzpassword', value);
          this.$store.commit('setMzPassword', value);
        },
      },
    },
    methods: {
      ...mapMutations([
        'setInputPath',
        'setOutputPath',
      ]),
      pullInputPath(path) {
        store.set('basic.inputpath', path);
        this.$store.commit('setInputPath', path);
      },
      pullOutputPath(path) {
        store.set('basic.outputpath', path);
        this.$store.commit('setOutputPath', path);
      },
      pullBzipPath(path) {
        store.set('basic.bzippath', path);
        this.$store.commit('setBzipPath', path);
      },
    },
  };

</script>

<style scoped>

</style>
