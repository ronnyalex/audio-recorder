<template>
  <div class="ar-player">
    <div class="ar-player-actions">
      <icon-button
        id="play"
        class="ar-icon ar-icon__lg ar-player__play"
        :name="playBtnIcon"
        :class="{ 'ar-player__play--active': isPlaying }"
        @clickSVG="playback"
      />
    </div>

    <div class="ar-player-bar">
      <div class="ar-player__time">{{ playedTime }}</div>
      <line-control
        class="ar-player__progress"
        ref-id="progress"
        :percentage="progress"
        @change-linehead="_onUpdateProgress"
      />
      <div class="ar-player__time">{{ duration }}</div>
      <volume-control @change-volume="_onChangeVolume" />
    </div>

    <!-- Den väljer nere i audioSource om den ska ta record eller src -->
    <audio :id="playerUniqId" :src="audioSource"></audio>
  </div>
</template>

<script>
import { convertTimeMMSS } from '@/utilities/RecorderUtility.js'
import IconButton from '@/components/IconButton.vue'
import LineControl from '@/components/LineControl.vue'
import VolumeControl from '@/components/VolumeControl.vue'

export default {
  components: {
    IconButton,
    LineControl,
    VolumeControl,
  },

  props: {
    src: { type: String },
    record: { type: Object },
    filename: { type: String },
  },
  // watch: {
  //   src(newValue) {
  //     console.log('newValue', newValue)
  //   },
  // },
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

    this.player.addEventListener('durationchange', async (e) => {
      if (e.target.duration === Infinity) {
        while (e.target.duration === Infinity) {
          //Ett hack för att duration ska laddas
          await new Promise((r) => setTimeout(r, 200))
          this.player.currentTime = 10000000 * Math.random()
        }
        this.player.currentTime = 0
        this.duration = convertTimeMMSS(this.player.duration)
      } else {
        setTimeout(() => {
          this.player.currentTime = 0
          this.duration = convertTimeMMSS(e.target.duration)
        }, 100)
      }
    })

    this.player.addEventListener('loadeddata', () => {
      this._resetProgress()
      // this.duration = convertTimeMMSS(this.record.duration)
    })

    this.player.addEventListener('timeupdate', this._onTimeUpdate)

    // Event.$on('remove-record', () => {
    //   this._resetProgress()
    // })
  },
  computed: {
    audioSource() {
      if (this.record?.url) {
        let blob = this.record.blob
        this.$emit('getBlobFromPlayerSource', blob)
        return this.record.url
      } else if (this.src) {
        return this.src
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
      if (this.duration !== convertTimeMMSS(0) && this.player.currentTime > 1) {
        //Hacket ovanför gör att progress och playedTime hoppar. Vi tittar här om duration har uppdaterats
        //this.player.currentTime > 1 är för att progress hoppar mellan 0 och 1 på grund av att volume jobbar mellan 0 och 1 men inte duration
        this.playedTime = convertTimeMMSS(this.player.currentTime)
        this.progress = (this.player.currentTime / this.player.duration) * 100
      }
    },
    _onUpdateProgress(pos) {
      if (pos) {
        this.player.currentTime = pos * this.player.duration
        console.log('this.player.duration', this.player.duration)
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
<style lang="less" scoped>
.ar-player {
  border: 1px solid #e8e8e8;
  border-radius: 24px;
  margin: 0 0 0 5px;

  width: 380px;
  height: unset;
  border: 0;
  border-radius: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: unset;
  font-family: 'Roboto', sans-serif;
  .ar-player-actions {
    width: 55%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  & > .ar-player-bar {
    border: 1px solid #e8e8e8;
    border-radius: 24px;
    margin: 0 0 0 5px;
  }
  .ar-player-bar {
    display: flex;
    align-items: center;
    height: 38px;
    padding: 0 12px;
    margin: 0 5px;
    .ar-player__time {
      color: rgba(84, 84, 84, 0.5);
      font-size: 16px;
      width: 41px;
    }
    & > .ar-player__progress {
      width: 125px;
    }
  }
  .ar-icon {
    fill: #747474;
    border-radius: 50%;
    border: 1px solid #05cbcd;
    background-color: #ffffff;
    padding: 5px;
    cursor: pointer;
    transition: 0.2s;
  }
  .ar-icon__lg {
    width: 45px;
    height: 45px;
    line-height: 45px;
    box-shadow: 0 2px 5px 1px rgb(158 158 158 / 50%);
  }
}
</style>
