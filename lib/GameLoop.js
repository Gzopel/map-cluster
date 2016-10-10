import '../registerBabel';
import GameEngine from 'rabbits-engine';

/*
* Wraps the game engine and ticks every 25 ms (40fps).
* */
export class GameLoop {
  constructor(map, emitter, fps = 40) {
    this.newCharacters = [];
    this.newActions = [];
    this.rmCharacters = [];
    this.emitter = emitter;
    this.map = map;
    this.engine = new GameEngine(this.map, emitter);
    this.interval = null;
    this.fps = fps;
  }

  addCharacter(characterConfig) {
    this.newCharacters.push(characterConfig);
  }

  removeCharacter(characterId) {
    this.rmCharacters.push(characterId);
  }

  handlePlayerAction(action) {
    this.newActions.push(action);
  }
  init() {
    const timeInterval = 1000 / this.fps;
    const looper = () => {
      this.interval = setTimeout(looper, timeInterval);
      this.preLoop();
      this.handleNewActions();
      const timestamp = new Date().getTime();
      this.engine.tick(timestamp);
    };
    looper();
  }

  preLoop() {
    let snapshot;
    if (this.newCharacters.length) {
      snapshot = this.engine.getSnapshot();
    }
    while (this.newCharacters.length) {
      const newCharacter = this.newCharacters.shift();
      this.emitter.emit('snapshot', snapshot);// should we do this before or after adding players?
      this.engine.addCharacter(newCharacter.character, newCharacter.role, newCharacter.transitions);
    }
    while (this.rmCharacters.length) {
      const id = this.rmCharacters.shift();
      this.engine.removeCharacter(id);
    }
  }

  handleNewActions() {
    while (this.newActions.length) {
      const newAction = this.newActions.shift();
      this.engine.handlePlayerAction(newAction);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

export default GameLoop;