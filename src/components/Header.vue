<template>
  <div class="panel">
    <div class="components">
      <div class="titlediv">
        <span id="title" class="title">{{ displayName }}</span>
      </div>
      <div class="buttondiv">
        <button v-wave id="logoutbtn" class="logoutbtn" @click="onClick($event)">Log Out</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VWave from 'v-wave'

Vue.use(VWave)

export default {
  name: 'Header',
  props: {
    displayName: String
  },
  modules: ['v-wave/nuxt'],
  methods: {
    onClick(event) {
      this.createRipple(event);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
.panel {
  border-radius: 0 0 10px 10px;
  background: #2E3440;
  height: 60px;
}
@media screen and (min-width: 1201px) {
  div.components {
    opacity: 100%;
    position: center;
    width: 1200px;
    height: 100%;
    margin: auto;
  }
}
@media screen and (max-width: 1200px) {
  div.components {
    opacity: 100%;
    position: center;
    width: 100%;
    height: 100%;
    margin: auto;
  }
}
div.titlediv {
  display: flex;

  justify-content: left;
  margin-left: 14px;

  align-items: center;
  height: 100%;
  width: auto;
  float: left;
}
div.buttondiv {
  display: flex;

  justify-content: right;
  margin-right: 14px;

  align-items: center;
  height: 100%;
  width: auto;
  float: right;
}
button.logoutbtn {
  border: none;
  background-color: #88C0D0;
  border-radius: 10px;
  font-size: 18px;
  font-family: Roboto, sans-serif;
  color: #4C566A;
  padding: 8px;
  outline: none
}
button.logoutbtn:hover {
  background-color: #8FBCBB;
}

@media screen and (min-width: 601px) {
  .title {
    font-family: Roboto, sans-serif;
    font-size: 30px;
    color: #ECEFF4;
  }
}
@media screen and (max-width: 600px) {
  .title {
    font-family: Roboto, sans-serif;
    font-size: 20px;
    color: #ECEFF4;
  }
}
</style>
