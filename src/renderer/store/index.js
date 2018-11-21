import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';
const Store = require('electron-store');
const store = new Store();
const path = require('path');

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  state: {
    inputpath: store.get('basic.inputpath'),
    outputpath: store.get('basic.outputpath'),
    nation: store.get('basic.nation'),
    dirname: store.get('basic.dirname'),
    filename: store.get('basic.filename'),
    version: store.get('basic.version'),
    mzserverpath: store.get('mz.serverpath'),
    mzusername: store.get('mz.username'),
    mzpassword: store.get('mz.password'),
    relativesympath: '../../space/vr_fixed/LPTE/BASE',
    bzippath: '".\\GnuWin32\\bin\\bzip2.exe"',
    progressmessage: [],
  },
  getters: {
    getInputPath: state => state.inputpath,
    getOutputPath: state => state.outputpath,
    getNation: state => state.nation,
    getDirname: state => state.dirname,
    getFilename: state => state.filename,
    getVersion: state => state.version,
    getMzServerPath: state => state.mzserverpath,
    getMzUserName: state => state.mzusername,
    getMzPassword: state => state.mzpassword,
    getVrPath: state => path.join(state.inputpath, state.nation, 'vr'),
    getVrFiexedPath: state => path.join(state.inputpath, state.nation, 'space'),
    getOutputDirnamePath: state => path.join(state.outputpath, state.dirname),
    getSympath: state => path.join(state.inputpath, state.nation, 'vr', 'LPTE', 'BASE'),
    getRelativeSymPath: state => state.relativesympath,
    getBzipPath: state => state.bzippath,
    getProgressMessage: state => state.progressmessage,
  },
  mutations: {
    setInputPath: (state, payload) => {
      state.inputpath = payload;
    },
    setOutputPath: (state, payload) => {
      state.outputpath = payload;
    },
    setNation: (state, payload) => {
      state.nation = payload;
    },
    setDirname: (state, payload) => {
      state.dirname = payload;
    },
    setFilename: (state, payload) => {
      state.filename = payload;
    },
    setVersion: (state, payload) => {
      state.version = payload;
    },
    setMzServerPath: (state, payload) => {
      state.mzserverpath = payload;
    },
    setMzUserName: (state, payload) => {
      state.mzusername = payload;
    },
    setMzPassword: (state, payload) => {
      state.mzpassword = payload;
    },
    pushProgressMessage: (state, payload) => {
      state.progressmessage.push(payload);
    },
    clearProgressMessage: (state) => {
      state.progressmessage = [];
    },
  },
});
