<template>
  <div class="overlay">
    <Header displayName="Jamulus Recordings"/>
  </div>
</template>

<script>

import Header from '@/components/Header'

export default {
  name: 'Home',
  components: {
    Header
  },
  created () {

    document.title = 'Jamulus Recordings'

  }
}
</script>

<style>
.overlay {
  background: #3B4252;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
}
</style>
