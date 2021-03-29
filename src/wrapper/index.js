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

// Declare install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true

  Object.entries(elements).forEach(([type, el]) => {
    Vue.component(type, el)
  })
}
// Create module definition for Vue.use()
const plugin = {
  install,
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
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
