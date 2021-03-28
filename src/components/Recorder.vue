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
          @click.native="toggleRecorder"
        />
        <IconButton class="ar-icon ar-icon__sm ar-recorder__stop" name="stop" @click.native="stopRecorder" />
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
          <!-- <div class="ar__text">{{ audioObject.duration }}</div> -->
          <AudioPlayer
            v-if="(audioObject.id || srcAudio !== '') && showDownloadButton"
            @getUrlFromPlayerSource="displayUrl"
            :record="audioObject"
            :src="srcAudio"
            :key="'mic_key' + microphoneid"
          />
          <div class="ar__rm" v-if="audioObject.id || srcAudio !== ''" @click="removeRecord(microphoneid)">
            <IconButton class="ar-icon ar-icon__sm ar-recorder__stop" name="trash" />
          </div>
          <Downloader
            v-if="audioObject.id && showDownloadButton"
            class="ar__downloader"
            :record="audioObject"
            :filename="filename"
          />

          <!-- <uploader
              v-if="record.id === audioObject.id && showUploadButton"
              class="ar__uploader"
              :record="record"
              :filename="filename"
              :headers="headers"
              :upload-url="uploadUrl"/> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer.vue'
import Downloader from '@/components/Downloader.vue'
import RecorderUtility, { convertTimeMMSS } from '@/utilities/RecorderUtility.js'
import IconButton from '@/components/IconButton.vue'

export default {
  components: {
    IconButton,
    AudioPlayer,
    Downloader,
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
    src: { type: String },
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
    console.log('hej')

    console.log('this.recorder', this.recorder)
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
    displayUrl(obj) {
      console.log(obj)
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
          console.log('this.audioObject', this.audioObject)
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
</style>
