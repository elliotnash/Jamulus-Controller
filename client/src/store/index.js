import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    authenticated: false,
    passHash: null,
    recordingState: false,
    systemInfo: {}
  },
  mutations: {
    setAuthentication(state, status) {
      state.authenticated = status;
    },
    setRecordingState(state, status) {
      state.recordingState = status
    },
    setSystemInfo(state, status) {
      state.systemInfo = status
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
        socket.emit('authenticate', credentials, (allowed) => {
          if(allowed) {
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
socket.sock