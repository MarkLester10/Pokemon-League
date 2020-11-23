new Vue({
  el: "#app",
  data: {
    playerHealth: 100,
    monsterHealth: 100,
    gameIsRunning: false,
    isPicking: true,
    winner: {},
    modal: false,
    turns: [],
    pokemons: [],
    currentPokemon: {},
    contenderPokemon: {},
  },
  methods: {
    setCurrentPokemon: function (pokemon) {
      this.currentPokemon = pokemon;
      randomPokemon = Math.max(
        Math.floor(Math.random() * this.pokemons.length),
        +1,
        10
      );
      this.contenderPokemon = this.pokemons[randomPokemon];
      this.isPicking = false;
      this.startGame();
    },
    startGame: function () {
      this.gameIsRunning = true;
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.turns = [];
    },
    attack: function () {
      var damage = this.calculateDamage(3, 10);
      this.monsterHealth -= damage;
      this.turns.unshift({
        isPlayer: true,
        message: `${this.currentPokemon.name} deal ${damage}% damage`,
      });
      if (this.checkWinner()) {
        return;
      }
      this.monsterAttacks();
    },
    specialAttack: function () {
      var damage = this.calculateDamage(10, 20);
      this.monsterHealth -= damage;
      this.turns.unshift({
        isPlayer: true,
        message: `${this.currentPokemon.name} deal ${damage}% critical damage`,
      });
      if (this.checkWinner()) {
        return;
      }
      this.monsterAttacks();
    },
    heal: function () {
      if (this.playerHealth <= 90) {
        this.playerHealth += 10;
      } else {
        this.playerHealth = 100;
      }
      this.turns.unshift({
        isPlayer: true,
        message: `${this.currentPokemon.name} got +10 Heal`,
      });
      this.monsterAttacks();
    },
    giveUp: function () {
      if (confirm("Start a new game?")) {
        this.resetGame();
      }
    },
    monsterAttacks: function () {
      var damage = this.calculateDamage(5, 15);
      this.playerHealth -= damage;
      this.checkWinner();
      this.turns.unshift({
        isPlayer: false,
        message: `${this.contenderPokemon.name} deals ${damage}% damage`,
      });
    },
    calculateDamage: function (min, max) {
      return Math.max(Math.floor(Math.random() * max) + 1, min);
    },
    checkWinner: function () {
      if (this.monsterHealth <= 0) {
        this.showWinner(this.currentPokemon);
        return true;
      } else if (this.playerHealth <= 0) {
        this.showWinner(this.contenderPokemon);
        return true;
      }
      return false;
    },
    showWinner: function (winner) {
      this.winner = winner;
      this.modal = true;
    },
    resetGame: function () {
      this.turns = [];
      this.isPicking = true;
      this.gameIsRunning = false;
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.modal = false;
      this.startGame();
    },
    getPokemon: async function (id) {
      const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
      const res = await fetch(url);
      const pokemon = await res.json();
      return pokemon;
    },

    fetchPokemons: async function () {
      for (let i = 1; i <= 200; i++) {
        this.pokemons.push(await this.getPokemon(i));
      }
    },
  },
  created: function () {
    this.fetchPokemons();
  },
});
