//.src/wrapper/index.js

import AudioRecorder from '@/components/AudioRecorder.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'

function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('AudioRecorder', AudioRecorder)
  Vue.component('AudioPlayer', AudioPlayer)
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
export { install, AudioRecorder, AudioPlayer }
export default { install, AudioRecorder }
