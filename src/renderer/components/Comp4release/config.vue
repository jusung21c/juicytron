<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" overflow hide-overlay transition="dialog-bottom-transition" max-width="1000px">
            <v-btn slot="activator" color="primary" dark>설정</v-btn>
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
                            v-bind:path="inputpath"
                            v-bind:description="`input 폴더를 선택해주세요. (예: C:\\LP_Src\\IQS_18MY_Hybrid_Wide_STD\\Release\\Input\\)`"
                            @selectedPath="getInputPath"
                    ></PathSelector>
                </v-flex>
                <v-flex>
                    <PathSelector
                            v-bind:path="outputpath"
                            v-bind:description="`output 폴더를 선택해주세요. (예: C:\\Output)`"
                            @selectedPath="getOutputPath"
                    ></PathSelector>
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
                                    label="최종 패키징될 파일의 이름을 적어주세요. (예: vreu-5w-0.00.52})"
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

  const Store = require('electron-store');
  const store = new Store();
  export default {
    components: {
      PathSelector,
    },
    name: 'config',
    data: () => ({
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      inputpath: store.get('basic.inputpath'),
      outputpath: store.get('basic.outputpath'),
      nation: store.get('basic.nation'),
      dirname: store.get('basic.dirname'),
      filename: store.get('basic.filename'),
      version: this.computedVersion,
      mzserverpath: store.get('mz.serverpath'),
      mzusername: store.get('mz.username'),
      mzpassword: store.get('mz.password'),
      blankrule: [
        v => !!v || '빈값이면 안되요.',
      ],
    }),
    computed: {
      computedNation: {
        get() {
          return this.nation;
        },
        set(value) {
          this.nation = value;
          store.set('basic.nation', value);
        },
      },
      computedDirname: {
        get() {
          return this.dirname;
        },
        set(value) {
          this.dirname = value;
          store.set('basic.dirname', value);
        },
      },
      computedFilename: {
        get() {
          return store.get('basic.filename');
        },
        set(value) {
          this.filename = value;
          store.set('basic.filename', value);
        },
      },
      computedVersion: {
        get() {
          const regex = new RegExp(/[\d]{1,2}\.[\d]{1,2}\.[\d]{1,2}/, 'gm');
          return this.filename.match(regex);
        },
      },
      computedMzServerPath: {
        get() {
          return this.mzserverpath;
        },
        set(value) {
          this.mzserverpath = value;
          store.set('mz.serverpath', value);
        },
      },
      computedMzUsername: {
        get() {
          return this.mzusername;
        },
        set(value) {
          this.mzusername = value;
          store.set('mz.username', value);
        },
      },
      computedMzPassword: {
        get() {
          return this.mzpassword;
        },
        set(value) {
          this.mzpassword = value;
          store.set('mz.password', value);
        },
      },
    },
    methods: {
      getInputPath(path) {
        store.set('basic.inputpath', path);
        this.inputpath = store.get('basic.inputpath');
      },
      getOutputPath(path) {
        store.set('basic.outputpath', path);
        this.outputpath = store.get('basic.outputpath');
      },
    },
  };

</script>

<style scoped>

</style>
