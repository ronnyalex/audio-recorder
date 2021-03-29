<template>
  <icon-button id="download" class="ar-icon ar-icon__lg ar-icon--no-border" name="download" @clickSvg="download" />
</template>

<script>
import IconButton from '@/components/IconButton.vue'

export default {
  props: {
    record: { type: Object },
    filename: { type: String },
  },
  components: {
    IconButton,
  },
  methods: {
    download() {
      if (!this.record.url) {
        return
      }

      const type = this.record.blob.type.split('/')[1]
      const link = document.createElement('a')
      link.href = this.record.url
      link.download = `${this.filename}.${type}`
      link.click()
    },
  },
}
</script>
<style lang="less" scoped>
.ar-icon__lg {
  width: 45px;
  height: 45px;
  line-height: 45px;
  box-shadow: 0 2px 5px 1px rgb(158 158 158 / 50%);
}
</style>
