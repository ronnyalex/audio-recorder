<template>
  <div id="app">
    <AudioRecorder />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AudioRecorder from './components/AudioRecorder.vue'

export default Vue.extend({
  name: 'App',
  components: {
    AudioRecorder,
  },
})
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
