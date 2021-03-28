<template>
  <Recorder :src="''"></Recorder>
</template>
<!-- <Recorder :microphoneid="index" :src="'getAudioSrc(select)'" :key="'Rec' + index"></Recorder> -->

<script lang="ts">
import Recorder from '@/components/Recorder.vue'

import Vue from 'vue'
export default Vue.extend({
  components: {
    Recorder,
  },
  props: {
    obj: { type: Object, default: () => ({}) },
    arr: { type: Array, default: () => [] },
    num: { type: Number, default: null },
    str: { type: String, default: '' },
  },
  data() {
    return {
      key: '',
    }
  },
  created() {
    console.log('hej')
  },
  methods: {},
})
</script>
<style lang="less" scoped></style>
