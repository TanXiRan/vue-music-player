class Dispatcher {
  constructor() {
    this.handlers = [];
  }
  push(h) {
    this.handlers.push(h);
  }
  emit() {
    this.handlers.forEach((h) => {
      h();
    });
  }
}

class Player {
  constructor() {
    // 音频上下文
    this.audioContext = new AudioContext();
    // 分析器
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 128;
    this.utfArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.tempArr = [];
    this.rectMargin = 0;
    this.rectWidth = 0;
    this.heightRate = 0;

    this.playList = [];
    this.playIndex = 0;

    this.emptyNode = {
      file: null,
      start: null,
      offset: 0,
      source: null,
      buffer: null,
    };

    this.onPlay = new Dispatcher();
    this.onPause = new Dispatcher();

    this.onReady = new Dispatcher();
    this.onChange = new Dispatcher();
  }

  amendData(cWidth, cHeight) {
    this.rectMargin = Math.floor(cWidth / this.analyser.frequencyBinCount) + 1;
    this.rectWidth = this.rectMargin - 1;
    this.heightRate = Math.floor((cHeight / 256) * 100) / 100;
  }

  drawCanvas(cHeight, ctx, isPlaying) {
    this.analyser.getByteFrequencyData(this.utfArray);

    // 正在播放时，每次将uft存入临时数组里
    if (isPlaying) {
      this.tempArr = this.utfArray;
      this.utfArray.forEach((value, index) => {
        ctx.fillRect(
          10 + index * this.rectMargin,
          cHeight - value * this.heightRate,
          this.rectWidth,
          value * this.heightRate
        );
      });
    } else {
      this.tempArr.forEach((value, index) => {
        if (value-- > 0) {
          ctx.fillRect(
            10 + index * this.rectMargin,
            cHeight - value * this.heightRate,
            this.rectWidth,
            value * this.heightRate
          );
        }
      });
    }
  }

  async getBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsArrayBuffer(file);

      reader.onload = async (event) => {
        this.audioContext
          .decodeAudioData(event.target.result)
          .then(resolve, reject);
      };

      reader.onerror = reject;
    });
  }

  async append(file) {
    /* 
     由于追加曲目可以在播放过程中追加，也可以在播放之前追加
     所以要先检测当前是否为空node，如果为空node，则表示还没有曲目，那么要换图片
     如果不为空，那么就不用换图片
    */
    const isEmpty = this.isEmpty;

    this.playList.push({
      file,
      offset: 0,
      start: null,
      source: null,
      buffer: await this.getBuffer(file),
    });
    if (isEmpty) {
      this.onReady.emit();
    }
  }

  play() {
    if (!this.playList.length || this.current.source) {
      return;
    }
    let source = this.audioContext.createBufferSource();
    source.buffer = this.current.buffer;

    source.onended = () => {
      this.next();
    };

    source.connect(this.analyser);

    this.analyser.connect(this.audioContext.destination);

    source.start(0, this.current.offset);
    this.current.source = source;
    this.current.start = this.audioContext.currentTime;

    this.onPlay.emit();
  }

  pause() {
    if (!this.playList.length || !this.current.source) {
      return;
    }
    this.current.source.stop(0);
    this.current.source.disconnect();
    this.current.source.onended = null;

    this.current.source = null;
    this.current.offset = this.position;
    this.current.start = null;

    this.onPause.emit();
  }

  stop() {
    this.pause();
    this.current.offset = 0;
  }

  prev() {
    this.stop();
    --this.playIndex;
    if (this.playIndex < 0) {
      this.playIndex = this.playList.length - 1;
    }
    this.play();
    if (this.playList.length > 1) {
      this.onChange.emit();
    }
  }

  next() {
    this.stop();
    ++this.playIndex;

    if (this.playIndex >= this.playList.length) {
      this.playIndex = 0;
    }
    this.play();
    if (this.playList.length > 1) {
      this.onChange.emit();
    }
  }

  // readonly properties
  get isEmpty() {
    return this.current === this.emptyNode;
  }

  get current() {
    return this.playList[this.playIndex] || this.emptyNode;
  }

  get duration() {
    return this.current.buffer ? this.current.buffer.duration : 0.001;
  }

  get position() {
    if (!this.playList.length) {
      return 0;
    }
    return (
      this.current.offset +
      (this.current.start != null
        ? this.audioContext.currentTime - this.current.start
        : 0)
    );
  }

  set position(rate) {
    if (!this.playList.length) {
      return;
    }
    let val = rate * this.duration;
    this.pause();
    this.current.offset = val;
    this.play();
  }
}

export const player = new Player();
