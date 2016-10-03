import GameEngine from 'rabbits-engine';

/*
* Wraps the game engine and ticks every 25 ms (40fps).
* */
export class GameLoop {
  constructor(emitter, fps = 40) {
    this.newCharacters = [];
    this.newActions = [];
    this.engine = new GameEngine(emitter);
    this.interval = null;
    this.fps = fps;
  }

  addCharacter(character, type) {
    this.newCharacters.push({ character: character, type: type });
  }

  handlePlayerAction(action) {
    this.newActions.push(action);
  }

  init() {
    this.interval = setInterval(() => {
      while(this.newCharacters.length) {
        const newCharacter = this.newCharacters.shift();
        this.engine.addCharacter(newCharacter.character, newCharacter.type);
      }

      while(this.newActions.length) {
        const newAction = this.newActions.shift();
        this.engine.handlePlayerAction(newAction);
      }
      const timstamp = new Date().getTime();
      this.engine.tick(timstamp);

    }, 1000 / this.fps);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

export default GameLoop;