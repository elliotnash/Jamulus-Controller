import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
import FileSaver from 'file-saver';
import VueCookies from 'vue-cookies';

Vue.use(Vuex);
Vue.use(VueCookies);

const store = new Vuex.Store({
  state: {
    authenticated: false,
    credentials: null,
    recordingState: false,
    systemInfo: {},
    recordings: []
  },
  mutations: {
    setAuthentication(state, status) {
      if (status){
        Vue.$cookies.set('credentials',state.credentials);
      } else {
        Vue.$cookies.remove('credentials');
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
      state.recordingState = status;
    },
    setSystemInfo(state, status) {
      state.systemInfo = status;
    },
    setCredentials(state, credentials){
      state.credentials = credentials;
    },
    setRecordings(state, data){
      state.recordings = data;
    }
  },
  actions: {
    emitRecordToggle(state, status) {
      socket.emit('RECORD_TOGGLE', {
        newState: status
      });
    },
    authenticate(state, credentials){
      return new Promise<boolean>((resolve, reject) => {

        if (credentials == null || credentials.user == null || credentials.passHash == null){
          console.log('null credentials');
          reject(false);
          return;
        }

        socket.emit('authenticate', credentials, (allowed: boolean) => {
          if(allowed) {
            store.commit('setCredentials', credentials);
            console.log(credentials);
            console.log(state.state.credentials);
            store.commit('setAuthentication', true);
          }
          resolve(allowed);
        });
      });

    },
    downloadFile(state, file){
      return new Promise<void>((resolve) => {
        socket.emit('DOWNLOAD_FILE', file, (uri: string) => {
          //first callback is on receive
          console.log('server received download request');

          FileSaver.saveAs(uri, file+'.zip');

        });
        resolve();
      });
    },
    renameFile(state, data){
      return new Promise<void>((resolve) => {
        socket.emit('RENAME_FILE', data);
        resolve();
      });
    },
    deleteFile(state, file){
      return new Promise<void>((resolve) => {
        socket.emit('DELETE_FILE', file);
        resolve();
      });
    }
  },
  modules: {
  }

});

export default store;

let host = window.location.host;
//let host = '192.168.0.196:3080';
let socket = io.io(host);

//TODO it'd be pretty pog to use decorator syntax for the store :P

socket.on('RECORD_TOGGLE', (data: {newState: boolean}) => {
  console.log('Record state updated');
  store.commit('setRecordingState', data.newState);
  console.log(store.state.recordingState);
});

socket.on('RECORDINGS_UPDATE', (data: {name: string, created: Date, processed: boolean}[]) => {
  console.log(data);
  store.commit('setRecordings', data);
});

socket.on('SYSTEM_INFO', (data: {cpuUsage: number, totalMem: number, memUsed: number}) => {
  store.commit('setSystemInfo', data);
});

socket.on("connect", () => {
  //attempt reauthenticate on connect, mainly for mobile browsers who suspend socket io sessions
  store.dispatch('authenticate', store.state.credentials).then(() => {
    console.log('socket reauthenticated');
  });
});