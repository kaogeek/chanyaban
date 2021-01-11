/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const fs = require('fs')
const youtubedl = require('youtube-dl')
const { YoutubeDataAPI } = require("youtube-v3-api")
const API_KEY = '';

// var YoutubeMp3Downloader = require("youtube-mp3-downloader");

// //Configure YoutubeMp3Downloader with your settings
// var YD = new YoutubeMp3Downloader({
//   "ffmpegPath": "/resources/ffmpeg",        // FFmpeg binary location
//   "outputPath": "/resources/folder",    // Output file location (default: the home directory)
//   "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
//   "queueParallelism": 2,                  // Download parallelism (default: 1)
//   "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
//   "allowWebm": false                      // Enable download from WebM sources (default: false)
// });

// //Download video and save as MP3 file
// YD.download("Vhd6Kc4TZls", "Cold Funk - Funkorama.mp3");

// YD.on("finished", function (err, data) {
//   console.log("finished: ",JSON.stringify(data));
// });

// YD.on("error", function (error) {
//   console.log("error: ",error);
// });

// YD.on("progress", function (progress) {
//   console.log(JSON.stringify("progress: ",progress));
// });

// youtubedl.exec('https://www.youtube.com/watch?v=2ZrWHtvSog4', ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
//   if (err) throw err

//   console.log(output.join('\n'))
// })

const api = new YoutubeDataAPI(API_KEY);

// const video = youtubedl('https://www.youtube.com/watch?v=naZ8oEKuR44',
//   // Optional arguments passed to youtube-dl.
//   ['--format=18'],
//   // Additional options can be given for calling `child_process.execFile()`.
//   { cwd: __dirname }) 

// // Will be called when the download starts.
// video.on('info', function (info) {
//   console.log('Download started: ');
//   console.log('filename: ' + info._filename);
//   console.log('size: ' + info.size);
//   video.pipe(fs.createWriteStream("./src/resources/"+info._filename)); 
// });

// fs.readdirSync("./src/resources/UCJ4-WFTrDNWvcM7dEC6E2mw").forEach(file => {
//   console.log(file);
// });  

// getVideoByChannelId("UCJ4-WFTrDNWvcM7dEC6E2mw");

async function getVideoByChannelId(channelId) {
  api.searchAll("", 5, { part: "snippet", channelId: channelId, type: "video", order: "date" }).then((videos) => {
    console.log(videos);
    for (const video of videos.items) {
      // console.log(video.id.videoId);  
      // await downloadYoutube(video.id.videoId);
      downloadYoutube(channelId, video.id.videoId);
    }
    console.log("done");
  }, (err) => {
    console.error(err);
  });
}

async function downloadYoutube(channelId, videoId) {
  if (!videoId) {
    return;
  }
  const video = youtubedl('https://www.youtube.com/watch?v=' + videoId,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname })

  // Will be called when the download starts.
  video.on('info', function (info) {
    console.log('Download started: ');
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
    if (fs.existsSync("./src/resources/" + channelId)) {
      // Do something
      video.pipe(fs.createWriteStream("./src/resources/" + channelId + "/" + info._filename));
    } else {
      // console.log("false");
      fs.mkdir("./src/resources/" + channelId, { recursive: true }, (err) => {
        if (err) {
          console.log('err: ' + err);
        } else {
          video.pipe(fs.createWriteStream("./src/resources/" + channelId + "/" + info._filename));
        }
      });
    }
  });
}

// main().catch(console.error);

async function main() {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe 
  // const fileName = './src/resources/MBA.mp4';
  const fileName = './src/resources/commercial_mono.wav';
  // const fileName = './src/resources/audio.raw';

  // Reads a local audio file and converts it to base64 

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: fs.readFileSync(fileName).toString('base64'),
  };
  const config = {
    // encoding: 'FLAC',
    // sampleRateHertz: 48000,
    encoding: 'LINEAR16',
    // encoding: 'MP3',
    sampleRateHertz: 16000,
    // model: 'audio'
    languageCode: 'en-US',
    // languageCode: 'th-TH',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  console.log(`response: ${response.results[0].alternatives[0].transcript}`);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
}

infiniteStream()

function infiniteStream(
  // encoding,
  // sampleRateHertz,
  // languageCode,
  // streamingLimit
) {
  // [START speech_transcribe_infinite_streaming]

  const encoding = 'LINEAR16';
  const sampleRateHertz = 16000;
  const languageCode = 'en-US';
  const streamingLimit = 10000; // ms - set to low number for demo purposes

  const chalk = require('chalk');
  const { Writable } = require('stream');

  // Node-Record-lpcm16
  const recorder = require('node-record-lpcm16');

  // Imports the Google Cloud client library
  // Currently, only v1p1beta1 contains result-end-time
  const speech = require('@google-cloud/speech').v1p1beta1;

  const client = new speech.SpeechClient();

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  const request = {
    config,
    interimResults: true,
  };

  let recognizeStream = null;
  let restartCounter = 0;
  let audioInput = [];
  let lastAudioInput = [];
  let resultEndTime = 0;
  let isFinalEndTime = 0;
  let finalRequestEndTime = 0;
  let newStream = true;
  let bridgingOffset = 0;
  let lastTranscriptWasFinal = false;

  function startStream() {
    // Clear current audioInput
    audioInput = [];
    // Initiate (Reinitiate) a recognize stream
    recognizeStream = client
      .streamingRecognize(request)
      .on('error', err => {
        if (err.code === 11) {
          // restartStream();
        } else {
          console.error('API request error ' + err);
        }
      })
      .on('data', speechCallback);

    // Restart stream when streamingLimit expires
    setTimeout(restartStream, streamingLimit);
  }

  const speechCallback = stream => {
    // Convert API result end time from seconds + nanoseconds to milliseconds
    resultEndTime =
      stream.results[0].resultEndTime.seconds * 1000 +
      Math.round(stream.results[0].resultEndTime.nanos / 1000000);

    // Calculate correct time based on offset from audio sent twice
    const correctedTime =
      resultEndTime - bridgingOffset + streamingLimit * restartCounter;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    let stdoutText = '';
    if (stream.results[0] && stream.results[0].alternatives[0]) {
      stdoutText =
        correctedTime + ': ' + stream.results[0].alternatives[0].transcript;
    }

    if (stream.results[0].isFinal) {
      process.stdout.write(chalk.green(`${stdoutText}\n`));

      isFinalEndTime = resultEndTime;
      lastTranscriptWasFinal = true;
    } else {
      // Make sure transcript does not exceed console character length
      if (stdoutText.length > process.stdout.columns) {
        stdoutText =
          stdoutText.substring(0, process.stdout.columns - 4) + '...';
      }
      process.stdout.write(chalk.red(`${stdoutText}`));

      lastTranscriptWasFinal = false;
    }
  };

  const audioInputStreamTransform = new Writable({
    write(chunk, encoding, next) {
      if (newStream && lastAudioInput.length !== 0) {
        // Approximate math to calculate time of chunks
        const chunkTime = streamingLimit / lastAudioInput.length;
        if (chunkTime !== 0) {
          if (bridgingOffset < 0) {
            bridgingOffset = 0;
          }
          if (bridgingOffset > finalRequestEndTime) {
            bridgingOffset = finalRequestEndTime;
          }
          const chunksFromMS = Math.floor(
            (finalRequestEndTime - bridgingOffset) / chunkTime
          );
          bridgingOffset = Math.floor(
            (lastAudioInput.length - chunksFromMS) * chunkTime
          );

          for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
            recognizeStream.write(lastAudioInput[i]);
          }
        }
        newStream = false;
      }

      audioInput.push(chunk);

      if (recognizeStream) {
        recognizeStream.write(chunk);
      }

      next();
    },

    final() {
      if (recognizeStream) {
        recognizeStream.end();
      }
    },
  });

  function restartStream() {
    if (recognizeStream) {
      recognizeStream.end();
      recognizeStream.removeListener('data', speechCallback);
      recognizeStream = null;
    }
    if (resultEndTime > 0) {
      finalRequestEndTime = isFinalEndTime;
    }
    resultEndTime = 0;

    lastAudioInput = [];
    lastAudioInput = audioInput;

    restartCounter++;

    if (!lastTranscriptWasFinal) {
      process.stdout.write('\n');
    }
    process.stdout.write(
      chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
    );

    newStream = true;

    startStream();
  }
  // Start recording and send the microphone input to the Speech API
  recorder
    .record({
      sampleRateHertz: sampleRateHertz,
      threshold: 0, // Silence threshold
      silence: 1000,
      keepSilence: true,
      recordProgram: 'rec', // Try also "arecord" or "sox"
    })
    .stream()
    .on('error', err => {
      console.error('Audio recording error ' + err);
    })
    .pipe(audioInputStreamTransform);

  console.log('');
  console.log('Listening, press Ctrl+C to stop.');
  console.log('');
  console.log('End (ms)       Transcript Results/Status');
  console.log('=========================================================');

  startStream();
  // [END speech_transcribe_infinite_streaming]
}
