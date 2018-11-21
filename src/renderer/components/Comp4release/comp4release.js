const targz = require('targz');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const exec = require('child_process').exec;
const isSymbolicLink = require('is-symbolic-link');
const tar = require('tar');

const compTargz = (input, dest) => new Promise((resolve, reject) => {
  fs.readdir(input, (err) => {
    if (!err) {
      console.log(`${input} 압축을 시작합니다.`);
      this.$store.commit('pushProgressMessage', `${input} 압축을 시작합니다.`);
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
});

const compTar = (outputpath, filename, dirname) => new Promise((resolve, reject) => {
  try {
    tar.c({ z: false, f: path.join(outputpath, `${filename}.tar`), cwd: outputpath }, [`.\\${dirname}`]);
    resolve();
  } catch (error) {
    reject(error);
  }
});

const checkSymlink = (sympath, relativeSymPath) => new Promise((resolve, reject) => {
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
});

const checkOutputDir = outputdirnamepath => new Promise((resolve) => {
  fs.readdir(outputdirnamepath, (error) => {
    if (error) {
      console.error(`${outputdirnamepath} 폴더가 없어 생성합니다.`);
      mkdirp(outputdirnamepath, (error) => {
        console.error(error);
        resolve(error);
      });
    } else {
      console.log('폴더존재');
      resolve();
    }
  });
});

const bz2comp = (bzippath, outputPath, filename) => new Promise((resolve, reject) => {
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
});

export default {
  compTargz,
  compTar,
  checkSymlink,
  checkOutputDir,
  bz2comp,
};
