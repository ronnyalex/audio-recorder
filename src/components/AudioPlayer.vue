<template>
  <div class="ar-player">
    <div class="ar-player-actions">
      <icon-button
        id="play"
        class="ar-icon ar-icon__lg ar-player__play"
        :name="playBtnIcon"
        :class="{ 'ar-player__play--active': isPlaying }"
        @click.native="playback"
      />
    </div>

    <div class="ar-player-bar">
      <div class="ar-player__time" style="font-size: 12px">{{ playedTime }}</div>
      <!-- <line-control
        class="ar-player__progress"
        ref-id="progress"
        :percentage="progress"
        @change-linehead="_onUpdateProgress"/> -->
      <!-- <div class="ar-player__time">{{duration}}</div> -->
      <!-- <volume-control @change-volume="_onChangeVolume"/> -->
    </div>

    <!-- Den väljer nere i audioSource om den ska ta record eller src -->
    <audio :id="playerUniqId" :src="audioSource"></audio>
  </div>
</template>

<script>
import { convertTimeMMSS } from '@/utilities/RecorderUtility.js'
import IconButton from '@/components/IconButton.vue'

export default {
  components: {
    IconButton,
  },

  props: {
    src: { type: String },
    record: { type: Object },
    filename: { type: String },
  },
  data() {
    return {
      isPlaying: false,
      duration: convertTimeMMSS(0),
      playedTime: convertTimeMMSS(0),
      progress: 0,
    }
  },
  mounted: function () {
    this.player = document.getElementById(this.playerUniqId)

    this.player.addEventListener('ended', () => {
      this.isPlaying = false
    })

    this.player.addEventListener('loadeddata', () => {
      this._resetProgress()
      this.duration = convertTimeMMSS(this.player.duration)
    })

    this.player.addEventListener('timeupdate', this._onTimeUpdate)

    // Event.$on('remove-record', () => {
    //   this._resetProgress()
    // })
  },
  computed: {
    audioSource() {
      if (this.record) {
        const url = this.src || this.record.url
        if (url) {
          this.$emit('getUrlFromPlayerSource', url)
          return url
        } else {
          this._resetProgress()
          return ''
        }
      } else {
        this._resetProgress()
        return ''
      }
    },
    playBtnIcon() {
      return this.isPlaying ? 'pause' : 'play'
    },
    playerUniqId() {
      return `audio-player${this._uid}`
    },
  },
  methods: {
    playback() {
      if (!this.audioSource) {
        return
      }

      if (this.isPlaying) {
        this.player.pause()
        this.isPlaying = !this.isPlaying
      } else {
        this.player
          .play()
          .then(() => {
            this.player.pause() // Tvunget att gör för mobile
            setTimeout(() => {
              this.player.play() // Tvunget att gör för mobile
              this.isPlaying = !this.isPlaying
            }, 100)
          })
          .catch((error) => {
            console.log('error', error)
          })
      }
    },
    _resetProgress() {
      if (this.isPlaying) {
        this.player.pause()
      }

      this.duration = convertTimeMMSS(0)
      this.playedTime = convertTimeMMSS(0)
      this.progress = 0
      this.isPlaying = false
    },
    _onTimeUpdate() {
      this.playedTime = convertTimeMMSS(this.player.currentTime)
      this.progress = (this.player.currentTime / this.player.duration) * 100
    },
    _onUpdateProgress(pos) {
      if (pos) {
        this.player.currentTime = pos * this.player.duration
      }
    },
    _onChangeVolume(val) {
      if (val) {
        this.player.volume = val
      }
    },
  },
}
</script>
<style lang="less" scoped></style>
