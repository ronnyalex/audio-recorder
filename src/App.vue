<template>
  <div id="app">
    <AudioRecorder :src="''" @onExportedDataUrl="sendFile"></AudioRecorder>
  </div>
</template>
<!-- <Recorder :microphoneid="index" :src="'getAudioSrc(select)'" :key="'Rec' + index"></Recorder> -->

<script lang="ts">
import AudioRecorder from './components/AudioRecorder.vue'

import Vue from 'vue'
export default Vue.extend({
  name: 'App',
  components: {
    AudioRecorder,
  },
  methods: {
    sendFile(dataUrl: any) {
      console.log('dataUrl', dataUrl)
    },
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
