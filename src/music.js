import * as Tone from "tone";

import { minor7th } from "@generative-music/utilities";
import { createPitchShiftedSampler } from "@generative-music/utilities";
import { toss } from "@generative-music/utilities";

import cor_anglais_b3 from "../assets/samples/sso-cor-anglais/b3.wav";
import cor_anglais_b4 from "../assets/samples/sso-cor-anglais/b4.wav";
import cor_anglais_d4 from "../assets/samples/sso-cor-anglais/d4.wav";
import cor_anglais_d5 from "../assets/samples/sso-cor-anglais/d5.wav";
import cor_anglais_f3 from "../assets/samples/sso-cor-anglais/f3.wav";
import cor_anglais_f4 from "../assets/samples/sso-cor-anglais/f4.wav";
import cor_anglais_f5 from "../assets/samples/sso-cor-anglais/f5.wav";
import cor_anglais_gsharp3 from "../assets/samples/sso-cor-anglais/gsharp3.wav";
import cor_anglais_gsharp4 from "../assets/samples/sso-cor-anglais/gsharp4.wav";

const notes = toss(["A#"], [3, 4]).map(minor7th).flat();

export default class Music {
  constructor(scheduleEvent) {
    this.scheduleEvent = scheduleEvent;
  }

  async _prepareSamples() {
    const samples = {
      "sso-cor-anglais": {
        B3: cor_anglais_b3,
        B4: cor_anglais_b4,
        D4: cor_anglais_d4,
        D5: cor_anglais_d5,
        F3: cor_anglais_f3,
        F4: cor_anglais_f4,
        F5: cor_anglais_f5,
        "G#3": cor_anglais_gsharp3,
        "G#4": cor_anglais_gsharp4,
      },
    };

    this.corAnglais = await createPitchShiftedSampler({
      samplesByNote: samples["sso-cor-anglais"],
      pitchShift: -24,
      attack: 5,
      release: 5,
      curve: "linear",
    });
  }

  _playChord(first = false) {
    let chord = notes.filter(() => Math.random() < 0.5).slice(0, 4);
    while (first && chord.length === 0) {
      chord = notes.filter(() => Math.random() < 0.5).slice(0, 4);
    }
    const immediateNoteIndex = first
      ? Math.floor(Math.random() * chord.length)
      : -1;

    let note = chord[0];
    let i = 0;
    chord.forEach((note, i) => {
      const offsetTime = `+${immediateNoteIndex === i ? 0 : Math.random() * 2}`;
      Tone.Transport.scheduleOnce((time) => {
        console.log(note, i, offsetTime);
        this.corAnglais.triggerAttack(note);

        Tone.Draw.schedule(() => {
          this.scheduleEvent("anglais", note, time, 14);
        }, time);
      }, offsetTime);
    });

    Tone.Transport.scheduleOnce(() => {
      this._playChord();
    }, `+${Math.random() * 5 + 12}`);
  }

  _schedule(destination) {
    const delayVolume = new Tone.Volume(-28);
    const compressor = new Tone.Compressor();

    const delay = new Tone.FeedbackDelay({
      feedback: 0.5,
      delayTime: 10,
      maxDelay: 10,
    }).connect(delayVolume);
    this.corAnglais.connect(compressor);
    compressor.connect(delay);
    compressor.connect(destination);
    delayVolume.connect(destination);

    this._playChord(true);

    Tone.Transport.start();
  }

  async load() {
    await Tone.start();
    await this._prepareSamples();
    await Tone.loaded();
  }

  play() {
    this._schedule(Tone.Destination);
  }

  stop() {
    // TODO: how to unwire music
  }
}
