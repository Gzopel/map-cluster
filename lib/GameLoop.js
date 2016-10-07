import GameEngine from 'rabbits-engine';

/*
* Wraps the game engine and ticks every 25 ms (40fps).
* */
export class GameLoop {
  constructor(rawMap, emitter, fps = 40) {
    this.newCharacters = [];
    this.newActions = [];
    this.rmCharacters = [];
    this.emitter = emitter;
    this.map = rawMap;
    this.map.spawnLocations.forEach((location) => {
      location.x = location.position.x;
      location.z = location.position.z;
      location.r = location.radius;
    });
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
    const interval = 1000 / this.fps;
    const looper = () => {
      this.interval = setTimeout(looper, interval);
      this.preLoop();
      this.handleNewActions();
      const timestamp = new Date().getTime();

      this.engine.tick(timestamp);
    };
    looper();
  }

  preLoop() {
    // TODO emit game snapshot for newPlayers
    const snapshot = {};
    if (this.newCharacters.length) {
      snapshot.map = this.map;
      // snapshot.character states = engine.getSnapshot();
    }
    while (this.newCharacters.length) {
      const newCharacter = this.newCharacters.shift();
      this.emitter.emit('snapshot', snapshot);// should we do this before or after adding players?
      this.engine.addCharacter(newCharacter.character, newCharacter.type, newCharacter.transitions);
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