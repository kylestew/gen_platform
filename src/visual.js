import * as Tone from "tone";

import seq0_00 from "../assets/brains/MRI scans_0000s_0000s_0005_Layer 54.jpg";
import seq0_01 from "../assets/brains/MRI scans_0000s_0000s_0004_Layer 55.jpg";
import seq0_02 from "../assets/brains/MRI scans_0000s_0000s_0003_Layer 56.jpg";
import seq0_03 from "../assets/brains/MRI scans_0000s_0000s_0002_Layer 57.jpg";
import seq0_04 from "../assets/brains/MRI scans_0000s_0000s_0001_Layer 58.jpg";
import seq0_05 from "../assets/brains/MRI scans_0000s_0000s_0000_Layer 59.jpg";

import seq1_00 from "../assets/brains/MRI scans_0000s_0000s_0019_Layer 40.jpg";
import seq1_01 from "../assets/brains/MRI scans_0000s_0000s_0018_Layer 41.jpg";
import seq1_02 from "../assets/brains/MRI scans_0000s_0000s_0017_Layer 42.jpg";
import seq1_03 from "../assets/brains/MRI scans_0000s_0000s_0016_Layer 43.jpg";
import seq1_04 from "../assets/brains/MRI scans_0000s_0000s_0015_Layer 44.jpg";
import seq1_05 from "../assets/brains/MRI scans_0000s_0000s_0014_Layer 45.jpg";
import seq1_06 from "../assets/brains/MRI scans_0000s_0000s_0011_Layer 48.jpg";
import seq1_07 from "../assets/brains/MRI scans_0000s_0000s_0010_Layer 49.jpg";
import seq1_08 from "../assets/brains/MRI scans_0000s_0000s_0009_Layer 50.jpg";
import seq1_09 from "../assets/brains/MRI scans_0000s_0000s_0008_Layer 51.jpg";
import seq1_10 from "../assets/brains/MRI scans_0000s_0000s_0007_Layer 52.jpg";

import seq2_00 from "../assets/brains/MRI scans_0000s_0000s_0042_Layer 17.jpg";
import seq2_01 from "../assets/brains/MRI scans_0000s_0000s_0041_Layer 18.jpg";
import seq2_02 from "../assets/brains/MRI scans_0000s_0000s_0040_Layer 19.jpg";
import seq2_03 from "../assets/brains/MRI scans_0000s_0000s_0039_Layer 20.jpg";
import seq2_04 from "../assets/brains/MRI scans_0000s_0000s_0038_Layer 21.jpg";
import seq2_05 from "../assets/brains/MRI scans_0000s_0000s_0037_Layer 22.jpg";
import seq2_06 from "../assets/brains/MRI scans_0000s_0000s_0036_Layer 23.jpg";
import seq2_07 from "../assets/brains/MRI scans_0000s_0000s_0035_Layer 24.jpg";
import seq2_08 from "../assets/brains/MRI scans_0000s_0000s_0034_Layer 25.jpg";
import seq2_09 from "../assets/brains/MRI scans_0000s_0000s_0033_Layer 26.jpg";
import seq2_10 from "../assets/brains/MRI scans_0000s_0000s_0032_Layer 27.jpg";

import { lerp, clamp } from "../snod/math";

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.src = url;
  });

export default class Visuals {
  constructor(canvasElement) {
    const ctx = canvasElement.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    this.ctx = ctx;
    this.events = [];
  }

  scheduleEvent(instrument, note, time, duration) {
    this.events.push({
      state: "scheduled",
      instrument,
      note,
      time,
      duration: duration + 1.0,
    });
  }

  async load() {
    this.sequences = [
      [
        await loadImage(seq0_00),
        await loadImage(seq0_01),
        await loadImage(seq0_02),
        await loadImage(seq0_03),
        await loadImage(seq0_04),
        await loadImage(seq0_05),
      ],

      [
        await loadImage(seq1_00),
        await loadImage(seq1_01),
        await loadImage(seq1_02),
        await loadImage(seq1_03),
        await loadImage(seq1_04),
        await loadImage(seq1_05),
        await loadImage(seq1_06),
        await loadImage(seq1_07),
        await loadImage(seq1_08),
        await loadImage(seq1_09),
        await loadImage(seq1_10),
      ],

      [
        await loadImage(seq2_00),
        await loadImage(seq2_01),
        await loadImage(seq2_02),
        await loadImage(seq2_03),
        await loadImage(seq2_04),
        await loadImage(seq2_05),
        await loadImage(seq2_06),
        await loadImage(seq2_07),
        await loadImage(seq2_08),
        await loadImage(seq2_09),
        await loadImage(seq2_10),
      ],
    ];
  }

  loop() {
    requestAnimationFrame(() => {
      this.loop();
    });

    const ctx = this.ctx;
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "lighter";

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const drawWidth = 272;
    const drawHeight = 314;

    // clear background
    ctx.clearRect(0, 0, width, height);
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fill();

    const time = Tone.now();

    this.events.forEach((event) => {
      if (event.state == "scheduled") {
        event.state = "running";

        // select a random sequence
        event.seq =
          this.sequences[Math.floor(Math.random() * this.sequences.length)];

        // give a random position in canvas
        const w = parseInt(Math.random() * (width - drawWidth));
        const h = parseInt(Math.random() * (height - drawHeight));
        event.pos = [w, h];
      }

      const perc = Math.min((time - event.time) / event.duration, 1);

      const seq = event.seq;
      const len = seq.length;
      const idx = parseInt(lerp(0, len + 1, perc));
      const alpha = (perc * (len + 1)) % 1;

      // move positions randomly
      // turn back on all notes
      // add more sqeuences

      const [w, h] = event.pos;

      if (idx - 1 >= 0 && idx - 1 < len) {
        // fade out previous
        ctx.globalAlpha = 1.0 - alpha;
        ctx.drawImage(seq[idx - 1], w, h, drawWidth, drawHeight);
      }
      if (idx < len) {
        // fade in new
        ctx.globalAlpha = alpha;
        ctx.drawImage(seq[idx], w, h, drawWidth, drawHeight);
      }

      if (event.time + event.duration < time) {
        event.state = "finished";
      }
    });

    this.events = this.events.filter((event) => event.state != "finished");
  }
}
