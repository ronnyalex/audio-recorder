<template>
  <div id="app">
    <AudioRecorder :src="audioUrl" @onExportedDataUrl="sendFile"></AudioRecorder>
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
  data() {
    return {
      audioUrl: '',
      // audioUrl:
      //   'https://firebasestorage.googleapis.com/v0/b/km-firebase-68496.appspot.com/o/development%2Fteachers%2F4874%2Fclasses%2F67979%2Ftestid%2F441729%2Fbilagor%2F1617009842253YL9i08AOlb.webm?alt=media&token=2bf36ed4-e48a-4d2a-aa5b-32ae73262f64',
    }
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
