//.src/wrapper/index.js
// import component from '@/components/AudioRecorder.vue'

// Smart wrappers
import AudioPlayer from '@/components/AudioPlayer.vue'
import AudioRecorder from '@/components/AudioRecorder.vue'
import IconButton from '@/components/IconButton.vue'
import Recorder from '@/components/Recorder.vue'
import LineControl from '@/components/LineControl.vue'
import VolumeControl from '@/components/VolumeControl.vue'

const elements = {
  AudioPlayer,
  AudioRecorder,
  IconButton,
  Recorder,
  LineControl,
  VolumeControl,
}

function install(Vue) {
  if (install.installed) return
  install.installed = true
  // Vue.component('AudioRecorder', component)

  Object.entries(elements).forEach(([type, el]) => {
    Vue.component(type, el)
  })
}

const plugin = {
  install,
}

let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue
}

if (GlobalVue) {
  GlobalVue.use(plugin)
}

export { AudioPlayer, AudioRecorder, IconButton, Recorder, LineControl, VolumeControl }

export default {
  install,
  AudioPlayer,
  AudioRecorder,
  IconButton,
  Recorder,
  LineControl,
  VolumeControl,
}
