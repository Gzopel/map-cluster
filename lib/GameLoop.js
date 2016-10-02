import GameEngine from 'rabbits-engine';

/*
* Wraps the game engine and ticks every 25 ms (40fps).
* */
export class GameLoop {
  constructor(emitter, fps = 40) {
    this.newCharacters = [];
    this.engine = new GameEngine(emitter);
    this.interval = null;
    this.fps = fps;
  }

  addCharacter(character, type) {
    this.newCharacters.push({ character: character, type: type });
  }

  init() {
    this.interval = setInterval(() => {
      while(this.z.length) {
        const newCharacter = this.newCharacters.shift();
        this.engine.addCharacter({ newCharacter });
      }

    }, 1000 / this.fps);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

export default GameLoop;