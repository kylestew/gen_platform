import * as Tone from "tone";

const createPercussionInstrument = (sampleUrl) => {
  const output = new Tone.Gain();
  const player = new Tone.Player(sampleUrl).toDestination();

  const connect = (...args) => {
    output.connect(...args);
  };

  const triggerAttack = (time, velocity = 1) => {
    const gain = new Tone.Gain(velocity).connect(output);
    player.connect(gain);
    player.start(time);
  };

  return { connect, triggerAttack };
};

export { createPercussionInstrument };
