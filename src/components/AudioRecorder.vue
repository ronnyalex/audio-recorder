<template>
  <div class="ar">
    <div class="ar-content">
      <div class="ar-recorder">
        <IconButton
          class="ar-icon ar-icon__lg"
          :name="iconButtonType"
          :class="{
            'ar-icon--rec': isRecording,
            'ar-icon--pulse': isRecording && volume > 0.02,
          }"
          @clickSVG="toggleRecorder"
        />
        <IconButton class="ar-icon ar-icon__sm ar-recorder__stop" name="stop" @clickSVG="stopRecorder" />
      </div>

      <!-- <div class="ar-recorder__records-limit" v-if="attempts">Attempts: {{attemptsLeft}}/{{attempts}}</div> -->
      <div class="ar-recorder__duration">{{ recordedTime }}</div>
      <!-- <div class="ar-recorder__time-limit" v-if="time">Record duration is limited: {{time}}m</div> -->

      <div class="ar-records" v-if="audioObject.id || srcAudio !== ''">
        <div
          @click="choiceRecord()"
          class="ar-records__record"
          :class="{ 'ar-records__record--selected': audioObject.id }"
        >
          <!-- @getUrlFromPlayerSource="sourceUrl" -->
          <AudioPlayer
            v-if="(audioObject.id || srcAudio !== '') && showDownloadButton"
            :record="audioObject"
            @getBlobFromPlayerSource="getBlobFromPlayerSource"
            :src="srcAudio"
            :filename="filename"
            :key="'mic_key' + microphoneid"
          />
          <!-- <div class="ar__rm" v-if="audioObject.id || srcAudio !== ''" @click="removeRecord(microphoneid)">
            <IconButton class="ar-icon ar-icon__sm ar-recorder__stop" name="trash" />
          </div> -->

          <!-- <Downloader
            v-if="audioObject.id && showDownloadButton"
            class="ar__downloader"
            :record="audioObject"
            :filename="filename"
          /> -->

          <!-- <uploader
              v-if="record.id === audioObject.id && showUploadButton"
              class="ar__uploader"
              :record="record"
              :filename="filename"
              :headers="headers"
              :upload-url="uploadUrl"/> -->
        </div>
      </div>
      <div>
        <input @change="setAudio" style="display: none" ref="input" type="file" name="audio" accept="audio/*" />
      </div>
      <button
        v-if="currentAudioSource"
        @click="saveAudio"
        style="margin: 10px 0"
        class="reused-button reused-button--blue"
      >
        Spara ljud
      </button>
      <div class="added-resource animation" style="margin-left: 0px">
        <div class="added-resource__wrapper" @click="showFileChooser">
          <span class="added-resource__wrapper__plus">+</span>
          <span class="added-resource__wrapper__text">Ladda upp ljudfil</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer.vue'
// import Downloader from '@/components/Downloader.vue'
import RecorderUtility, { convertTimeMMSS } from '@/utilities/RecorderUtility.js'
import IconButton from '@/components/IconButton.vue'

export default {
  name: 'AudioRecorder',
  components: {
    IconButton,
    AudioPlayer,
    // Downloader,
  },

  props: {
    microphoneid: { type: Number, default: 0 },
    filename: { type: String, default: 'record' },
    format: { type: String, default: 'mp3' },
    headers: { type: Object, default: () => ({}) },
    uploadUrl: { type: String },
    // attempts: { type: Number },
    // time: { type: Number },
    bitRate: { type: Number, default: 128 },
    sampleRate: { type: Number, default: 44100 },

    // showDownloadButton: { type: Boolean, default: true },
    showUploadButton: { type: Boolean, default: true },
    src: { type: String, default: '' },
    micFailed: { type: Function },
    beforeRecording: { type: Function },
    pauseRecording: { type: Function },
    afterRecording: { type: Function },
    failedUpload: { type: Function },
    beforeUpload: { type: Function },
    successfulUpload: { type: Function },
    selectRecord: { type: Function },
  },
  data() {
    return {
      // selections: selections,

      recorder: new RecorderUtility(),
      srcAudio: this.src,
      currentAudioSource: null,
      recordList: [],
      audioObject: {},
      time: 2,
      uploadStatus: null,
      attempts: 1,
      showDownloadButton: true,
      received: false,
    }
  },
  created() {
    // console.log('this.audioObject', this.audioObject)
    // console.log('this.srcAudio', this.srcAudio)
  },

  computed: {
    iconButtonType() {
      return this.isRecording && this.isPause ? 'mic' : this.isRecording ? 'pause' : 'mic'
    },
    isPause() {
      return this.recorder.isPause
    },
    isRecording() {
      return this.recorder.isRecording
    },
    recordedTime() {
      if (this.time && this.recorder._duration >= this.time * 60) {
        this.stopRecorder()
      }
      // console.log(this.recorder.duration)

      return convertTimeMMSS(this.recorder._duration)
    },
    volume() {
      return parseFloat(this.recorder.volume)
    },
  },
  methods: {
    showFileChooser() {
      this.$refs.input.click()
    },
    async getBlobFromPlayerSource(blob) {
      let promise = await this.blobToBase64(blob)
      this.currentAudioSource = { dataUrl: promise, type: 'audio' }
    },
    saveAudio() {
      this.$emit('onExportedDataUrl', this.currentAudioSource)
    },
    blobToBase64(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    },
    toggleRecorder() {
      try {
        if (!this.isRecording || (this.isRecording && this.isPause)) {
          this.audioObject = {}
          this.srcAudio = ''
          this.recorder.start()
        } else {
          this.recorder.pause()
        }
      } catch (error) {
        alert('Du måste ha tillgång till mikrofon och även godkänna användandet av mikrofon')
      }
    },
    stopRecorder() {
      if (!this.isRecording) {
        return
      }
      try {
        this.recorder.stop()
        setTimeout(() => {
          this.audioObject = this.recorder.getRecord()
        }, 200)
        // this.recorder.records = []
      } catch (error) {
        console.log('error', error)
        alert('Du måste ha tillgång till mikrofon och även godkänna användandet av mikrofon.')
      }
    },
    removeRecord() {
      this.srcAudio = ''
      this.audioObject.id = null
    },
    choiceRecord() {
      this.selectRecord && this.selectRecord(this)
    },
    setAudio(e) {
      const file = e.target.files[0]
      if (file.type.indexOf('audio/') === -1) {
        alert('Please select an audio file')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          let base_audio = new Audio()
          base_audio.src = event?.target?.result
          base_audio.onloadedmetadata = () => {
            this.duration = base_audio.duration // this would give duration of the video/audio file
          }
          this.srcAudio = base_audio.src
          this.currentAudioSource = { dataUrl: this.srcAudio, type: 'audio' }
          base_audio.onload = () => {
            this.player = this.base_audio
          }
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
  },
}
</script>
<style lang="less" scoped>
.ar-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .ar-recorder {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .ar-icon {
      fill: #747474;
      border-radius: 50%;
      border: 1px solid #05cbcd;
      background-color: #ffffff;
      padding: 5px;
      cursor: pointer;
      transition: 0.2s;
      &__lg {
        width: 45px;
        height: 45px;
        line-height: 45px;
        box-shadow: 0 2px 5px 1px rgb(158 158 158 / 50%);
      }
      &__sm {
        width: 30px;
        height: 30px;
        line-height: 30px;
      }
    }

    &__duration {
      color: #aeaeae;
      font-size: 32px;
      font-weight: 500;
      margin-top: 20px;
      margin-bottom: 16px;
    }
    &__stop {
      position: absolute;
      top: 10px;
      right: -52px;
    }
    &__duration {
      color: #aeaeae;
      font-size: 32px;
      font-weight: 500;
      margin-top: 20px;
      margin-bottom: 16px;
    }
  }
}
.added-resource {
  height: 70px;
  width: 65px;
  border-radius: 5px;
  border: 1px dotted grey;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  &:not(:first-child) {
    margin-left: 10px;
  }
  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  &__wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // margin-top: 15px;
    align-items: center;
    padding: 4px;

    color: grey;
    &__plus {
      font-size: 32px;
      line-height: 0.6;
      align-items: center;
    }
    &__text {
      text-align: center;
      font-size: 8px;
    }
  }
}

@reused-button-height: 25px;
@reused-button-background-color-blue: rgba(24, 160, 251, 1);
@reused-button-background-color-blue-hover: rgb(137, 201, 243);
@reused-button-background-color-grey: rgba(161, 161, 161, 1);
@reused-button-background-color-grey-hover: rgb(106, 106, 106);
.reused-button {
  padding: 10px;
  text-decoration: bold;
  text-transform: none;
  cursor: pointer;
  width: 100px;
  border-radius: 5px;
  height: @reused-button-height;
  min-height: @reused-button-height;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  // line-height: calc(~'@{reused-button-height} - 2px');
  line-height: 28px;
  position: relative;

  &--blue {
    background-color: @reused-button-background-color-blue;
    border: 1px solid @reused-button-background-color-blue;
    color: white;

    &:hover {
      background-color: @reused-button-background-color-blue-hover;
      border: 1px solid @reused-button-background-color-blue-hover;
    }
  }
  &--grey {
    background-color: @reused-button-background-color-grey;
    border: 1px solid @reused-button-background-color-grey;
    color: white;

    &:hover {
      background-color: @reused-button-background-color-grey-hover;
      border: 1px solid @reused-button-background-color-grey-hover;
    }
  }
}

.animation {
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
</style>
