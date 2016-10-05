import GameEngine from 'rabbits-engine';

/*
* Wraps the game engine and ticks every 25 ms (40fps).
* */
export class GameLoop {
  constructor(map, emitter, fps = 40) {
    this.newCharacters = [];
    this.newActions = [];
    this.rmCharacters = [];
    this.engine = new GameEngine(map, emitter);
    this.interval = null;
    this.fps = fps;
  }

  addCharacter(character, type) {
    this.newCharacters.push({ character: character, type: type });
  }

  removeCharacter(characterId) {
    this.rmCharacters.push(characterId);
  }

  handlePlayerAction(action) {
    this.newActions.push(action);
  }
  init() {
    const interval = 1000 / this.fps;
    const looper = () => {
      this.interval = setTimeout(looper,interval);
      this.preLoop();

      this.handleNewActions();

      const timstamp = new Date().getTime();
      this.engine.tick(timstamp);
    };
    looper();
  }

  preLoop() {
    // TODO emit game snapshot for newPlayers
    while (this.newCharacters.length) {
      const newCharacter = this.newCharacters.shift();
      this.engine.addCharacter(newCharacter.character, newCharacter.type);
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