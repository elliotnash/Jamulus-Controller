import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
const FileSaver = require('file-saver');

Vue.use(Vuex)
Vue.use(require('vue-cookies'))

const store = new Vuex.Store({
  state: {
    authenticated: false,
    credentials: null,
    recordingState: false,
    systemInfo: {},
    recordings: [],
    dialogs: {
      file: true
    }
  },
  mutations: {
    setAuthentication(state, status) {
      if (status){
        Vue.$cookies.set('credentials',state.credentials);
      } else {
        Vue.$cookies.remove('credentials')
        state.credentials = null;
      }
      state.authenticated = status;
    },
    fetchCredentials(state){
      if (Vue.$cookies.isKey('credentials')) {
        state.credentials = Vue.$cookies.get('credentials');
      }
    },
    setRecordingState(state, status) {
      state.recordingState = status
    },
    setSystemInfo(state, status) {
      state.systemInfo = status
    },
    setCredentials(state, credentials){
      state.credentials = credentials;
    },
    setRecordings(state, data){
      state.recordings = data;
    },
    setDialog(state, dialog, status) {
      state.dialogs[dialog] = status;
    }
  },
  actions: {
    emitRecordToggle(state, status) {
      socket.emit('RECORD_TOGGLE', {
        newState: status
      })
    },
    authenticate(state, credentials){
      return new Promise((resolve, reject) => {

        if (credentials == null || credentials.user == null || credentials.passHash == null){
          console.log('null credentials')
          reject()
          return;
        }

        socket.emit('authenticate', credentials, (allowed) => {
          if(allowed) {
            store.commit('setCredentials', credentials)
            console.log(credentials)
            console.log(state.credentials)
            store.commit('setAuthentication', true);
            resolve()
          } else {
            reject()
          }
        });
      })

    },
    downloadFile(state, file){
      return new Promise((resolve, reject) => {
        socket.emit('DOWNLOAD_FILE', file, (uri) => {
          //first callback is on receive
          console.log('server received download request');

          FileSaver.saveAs(uri, file+'.zip');

        })
        resolve();
      })
    }
  },
  modules: {
  }

})

export default store

//let host = window.location.host;
let host = '192.168.1.131:3080'
let socket = io(host);

socket.on('RECORD_TOGGLE', (data) => {
  console.log('Record state updated')
  store.commit('setRecordingState', data.newState)
  console.log(store.state.recordingState)
});

socket.on('RECORDINGS_UPDATE', (data) => {
  console.log('haa')
  console.log(data)
  store.commit('setRecordings', data);
})

socket.on('SYSTEM_INFO', (data) => {
  store.commit('setSystemInfo', data)
});

socket.on("connect", () => {
  //attempt reauthenticate on connect, mainly for mobile browsers who suspend socket io sessions
  store.dispatch('authenticate', store.state.credentials).then(() => {
    console.log('socket reauthenticated')
  }, () => {
  })
})