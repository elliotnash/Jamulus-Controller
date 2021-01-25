<template>
  <div class="panel">
    <div class="components">
      <div class="titlediv">
        <span id="title" class="title">{{ displayName }}</span>
      </div>
      <div class="buttondiv">
        <button class="logoutbtn">Log Out</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    displayName: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  font-size: 20px;
  padding: 6px;
  outline: none
}
button.logoutbtn:hover {
  background-color: #8FBCBB;
}
button.logoutbtn:active {
  background-color: #81A1C1;
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
