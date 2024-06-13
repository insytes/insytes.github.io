export const AudioMap = {
  beep: new Audio('audio/beep-08b.mp3'),
  shotEnded: new Audio('audio/buzzer.mp3'),
  gameEnded: new Audio('audio/buzzer.mp3'),
  gameOverVoice: new Audio('audio/game-over-voice.mp3'),
  limitedShotClockVoice: new Audio('audio/limited-shot-clock-activated.mp3'),
  oneMinuteLeftVoice: new Audio('audio/one-minute-left.mp3'),
} satisfies AudioMap;

let loaded = false;
export const loadAudio = () => {
  if (!loaded) {
    Object.values(AudioMap).forEach(sound => {
      sound.load();
      sound.muted = false;
    })
    loaded = true;
  }
}

export function playAudio(audio: AudioName) {
  if (Object.hasOwn(AudioMap, audio)) {
    AudioMap[audio].play();
  }
}

export type AudioName = keyof typeof AudioMap;

type AudioMap = Record<string, HTMLAudioElement>;
