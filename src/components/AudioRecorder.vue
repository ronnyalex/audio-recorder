<template>
  <div>hej</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  // components: {
  //   New,
  // },
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
