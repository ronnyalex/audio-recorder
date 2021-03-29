// import Encoder from '@/utilities/Mp3Encoder.js'

export default class Recorder {
  constructor() {
    this.mediaRecorder = null

    this.chunks = []
    this.media = {
      tag: 'audio',
      type: 'audio/webm; codecs=opus',
      ext: '.webm',
      gUM: { audio: true },
    }
    this.isPause = false
    this.isRecording = false
    this.blob = null
    this.duration = 0
    this.startPoint = null
    this.stopPoint = null
    this.newDate = null
    this.dateBefore = null
    this.volume = 0

    this._duration = 0
    this.oldDuration = 0
  }

  start() {
    navigator.mediaDevices.getUserMedia(this.media.gUM).then((stream) => {
      let chunks = []
      this.isPause = false

      this.isRecording = true
      this.mediaRecorder = new MediaRecorder(stream)

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        chunks.push(event.data)
      })
      // this.mediaRecorder.addEventListener('start', (event) => {
      //   console.log('event', event)
      //   console.log('dataavailable')
      // })
      this.dateBefore = new Date()
      // this.mediaRecorder.addEventListener('stop', () => {
      //   this.duration = (new Date() - this.dateBefore) / 1000
      // })
      this.mediaRecorder.addEventListener('dataavailable', () => {
        if (this.isRecording === true) {
          this.newDate = new Date()
          this._duration = (this.newDate - this.dateBefore) / 1000 + this.oldDuration
          this.oldDuration = this._duration
          this.dateBefore = this.newDate
        }
      })

      this.chunks = chunks
      this.mediaRecorder.start(1000)
    })
  }

  stop() {
    this.mediaRecorder.stop()
    this.isRecording = false
    this.duration = this._duration
    this.blob = new Blob(this.chunks, { type: this.media.type })
  }

  pause() {
    this.isPause = true
    this.mediaRecorder.pause()
    // this.pausePoint = new Date()
    // this._duration = (new Date() - this.startPoint) / 1000
  }

  getRecord() {
    return {
      id: Date.now(),
      blob: this.blob,
      url: URL.createObjectURL(this.blob),
      duration: this.duration,
    }
  }

  recordList() {
    return this.records
  }

  lastRecord() {
    return this.records.slice(-1)
  }
}

export function convertTimeMMSS(seconds) {
  return seconds === undefined ? undefined : new Date(seconds * 1000).toISOString().substr(14, 5) // MMss, den går 14 steg och tar 5 chars
}

export function calculateLineHeadPosition(ev, element) {
  const progressWidth = element.getBoundingClientRect().width
  const leftPosition = ev.target.getBoundingClientRect().left
  let pos = (ev.clientX - leftPosition) / progressWidth

  // try {
  //   if (!ev.target.className.match(/^ar\-line\-control/)) {
  //     return
  //   }
  // } catch (err) {
  //   return
  // }

  pos = pos < 0 ? 0 : pos
  pos = pos > 1 ? 1 : pos

  return pos
}
