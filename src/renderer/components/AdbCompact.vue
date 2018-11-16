<template>
    <v-container grid-list-xl text-xs-center>
        <v-layout row wrap>
            <v-flex xs8 offset-xs2 my-4>
                <v-btn @click="doCmd('adb devices')">adb devices</v-btn>
                <v-btn @click="doCmd('adb remount')">adb remount</v-btn>
                <v-btn @click="doCmd('adb reboot')">reboot</v-btn>
            </v-flex>
            <v-flex xs6 offset-xs3>
                <v-btn @click="openDir('VH')">핸들러 교체</v-btn>
                <v-btn @click="openDir('VRM')">VRM 교체</v-btn>
            </v-flex>
            <v-flex xs12 >
                <ProcTextArea
                        v-bind:text="display"
                        style="text-align: left;"
                ></ProcTextArea>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
  import ProcTextArea from './ProgramManager/ProcTextArea';
  /* eslint-disable */
  const { dialog } = require('electron').remote;
  /* eslint-enable */
  const util = require('util');
  const exec = util.promisify(require('child_process').exec);
  const path = require('path');
  export default {
    components: {
      ProcTextArea,
    },
    name: 'AdbCompact',
    data() {
      return {
        display: '',
      };
    },
    methods: {
      async doCmd(cmd) {
        this.display = '';
        const commands = cmd.split(' ');
        commands.unshift('/c');
        await exec(`cmd /c ${cmd}`, (error, stdout, stderr) => {
          this.display += stdout;
          console.log('stderr : ', stderr);
          if (error !== null) {
            console.error(error);
          }
        });
      },
      openDir(func) {
        dialog.showOpenDialog({
          properties: ['openFile'],
        }, (selectedFile) => {
          if (selectedFile !== undefined) {
            if (func === 'VH') {
              if (path.basename(selectedFile.toString()) === 'HKMC_VoiceHandler.apk') {
                this.changeVH(selectedFile);
              } else {
                alert('핸들러 apk를 선택해주세요');
              }
            } else if (func === 'VRM') {
              if (path.extname(selectedFile.toString()) === '.so') {
                this.changeVRM(selectedFile);
              } else {
                alert('VRM SO를 선택해주세요');
              }
            }
          }
        });
      },
      async changeVH(path) {
        const command = `${'adb remount'
        + ' | adb shell ls -al /system/app/HKMC_Vo*'
        + ' | adb shell rm -rf /system/app/HKMC_Vo*'
        + ' | adb push '}${path}/system/app`
        + ' | adb shell ls -al /system/app/HKMC_Vo*';
        // this.doCmd('adb remount');
        // this.doCmd('adb shell ls -al /system/app/HKMC_Vo*');
        // this.doCmd('adb shell rm -rf /system/app/HKMC_Vo*');
        this.doCmd(command);
        this.doCmd(`adb push ${path} /system/app`);
        // this.doCmd('adb shell ls -al /system/app/HKMC_Vo*');
      },
      changeVRM(path) {
        this.doCmd('adb remount');
        this.doCmd(`adb push ${path} /system/lib`);
        // this.doCmd('adb shell ls -al /system/lib');
      },
    },

  };
</script>

<style scoped>

</style>