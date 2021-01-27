import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'

Vue.use(Vuex)
Vue.use(require('vue-cookies'))

const store = new Vuex.Store({
  state: {
    authenticated: false,
    credentials: null,
    recordingState: false,
    systemInfo: {}
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

    }
  },
  modules: {
  }

})

export default store

let socket = io('http://192.168.0.196:3080');

socket.on('RECORD_TOGGLE', (data) => {
  console.log('Record state updated')
  store.commit('setRecordingState', data.newState)
  console.log(store.state.recordingState)
});
socket.on('SYSTEM_INFO', (data) => {
  store.commit('setSystemInfo', data)
});
socket.emit()