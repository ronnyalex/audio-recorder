// import Encoder from '@/utilities/Mp3Encoder.js'

export default class Recorder {
  constructor() {
    this.mediaRecorder = null
    this.userAgentIpadIphone = /iPad|iPhone|iPod/.test(navigator.userAgent)
    this.chunks = []
    // this.media = {
    //   tag: 'audio',
    //   type: this.userAgentIpadIphone ? 'audio/mpeg' : 'audio/webm; codecs=opus',
    //   ext: this.userAgentIpadIphone ? '.mpeg' : '.webm',
    //   gUM: { audio: true },
    // }
    this.media = {
      tag: 'audio',
      type: 'audio/mpeg',
      ext: '.mpeg',
      gUM: { audio: true },
    }

    this.isPause = false
    this.isRecording = false
    this.blob = null
    this.duration = 0
    this.newDate = null
    this.dateBefore = null
    this.volume = 0

    this._duration = 0
    this.oldDuration = 0
    this.isInitiated = false
  }

  start() {
    navigator.mediaDevices.getUserMedia(this.media.gUM).then((stream) => {
      this.dateBefore = new Date()
      if (!this.isInitiated) {
        this.mediaRecorder = new MediaRecorder(stream)
        this.isInitiated = true
        this.isPause = false
        this.isRecording = true
        this.chunks = []
        this._duration = 0
        this.oldDuration = 0
        // this.mediaRecorder.addEventListener('stop', () => {
        //   this.duration = (new Date() - this.dateBefore) / 1000
        // })
        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          if (this.isRecording === true && !this.isPause) {
            this.chunks.push(event.data)
            this.newDate = new Date()
            let secondsFromOldDuration = (this.newDate - this.dateBefore) / 1000
            this._duration = secondsFromOldDuration + this.oldDuration
            this.oldDuration = this._duration
            this.dateBefore = this.newDate
          }
        })
      }

      if (this.isPause) {
        this.mediaRecorder.resume()
        this.isPause = false
      } else {
        this.mediaRecorder.start(1000)
      }
    })
  }

  stop() {
    this.mediaRecorder.stop()
    this.isRecording = false
    this.duration = this._duration
    this.blob = new Blob(this.chunks, { type: this.media.type })
    this.isInitiated = false
  }

  pause() {
    this.isPause = true
    this.mediaRecorder.pause()
  }

  getRecord() {
    return {
      id: Date.now(),
      blob: this.blob,
      url: URL.createObjectURL(this.blob),
      duration: this.duration,
    }
  }
  // getUrl() {
  //   let url
  //   try {
  //     url = webkitURL.createObjectURL(this.blob) // eslint-disable-line
  //   } catch (error) {
  //     url = URL.createObjectURL(this.blob)
  //   }
  //   return url
  // }
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
