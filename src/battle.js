class Battle {

  constructor(player, opposing) {
    this.player = player
    this.opposing = opposing
    this.renderBattleDisplay();
    this.renderBattle()
  }

  renderBattleDisplay() {
    document.getElementById('game-screen').innerHTML = "<div id='battle-background'></div>"

    document.getElementById('battle-background').innerHTML = `
    <div id='left-display' class='pokemon-display'></div>
    <div id='right-display' class='pokemon-display'></div>
    <div id='menu'></div>
    <div id="game-modal" class="modal">
      <div id="modal-content" class="modal-content">

      </div>
    </div>`


    document.getElementById('left-display').innerHTML = `
    <div id='player-name' class='poke-name'></div>
    <div id='player-stats' class='poke-stats'></div>
    <div id='player-pic' class='poke-pic'></div>`

    document.getElementById('right-display').innerHTML = `
    <div id='opposing-pic' class='poke-pic'></div>
    <div id='opposing-name' class='poke-name'></div>
    <div id='opposing-stats' class='poke-stats'></div>`

    document.getElementById('menu').innerHTML = `
    <form class="battleForm" action="index.html" method="post">
      <label>Moves:</label>
      <select id="moveMenu"></select>
      <input type='submit' id="moveSubmit"></input>
    </form>
    `
    //to be added later:
    //<label>Pokemon:</label>
    // <select id="pokeMenu"></select>
  }

  renderBattle() {

    document.getElementById('player-pic').innerHTML =
    `<image id="player-pic" src="${this.player.back_default}">`

    document.getElementById('opposing-pic').innerHTML =
    `<image id="opposing-pic" src="${this.opposing.front_default}">`

    document.getElementById('player-name').innerHTML =
    `<div id="player-name">${this.player.name.toUpperCase()}</div>`

    document.getElementById('opposing-name').innerHTML =
    `<div id="opposing-name">${this.opposing.name.toUpperCase()}</div>`

    const playerStats = document.getElementById('player-stats')
    const playerStatList = document.createElement('ul')

    for(let i = 0; i < 6; i++){
      playerStatList.innerHTML += `<li id="${this.player.name}-${this.player.all_stats[i].stat_name}"> ${this.player.all_stats[i].stat_name}: ${this.player.all_stats[i].base_stat} </li>`
    }
    playerStats.appendChild(playerStatList)


    const opposingStats = document.getElementById('opposing-stats')
    const opposingStatList = document.createElement('ul')

    for(let i = 0; i < 6; i++){
      opposingStatList.innerHTML += `<li id="${this.opposing.name}-${this.opposing.all_stats[i].stat_name}"> ${this.opposing.all_stats[i].stat_name}: ${this.opposing.all_stats[i].base_stat} </li>`
    }
    opposingStats.appendChild(opposingStatList)

    let moveMenu = document.getElementById('moveMenu')
    for(let i = 0; i < this.player.all_moves.length; i++){
      moveMenu.innerHTML += `<option value="${this.player.all_moves[i].move_id}">${this.player.all_moves[i].move}</option>`
    }

    console.log(this.player.id)

    menu.addEventListener("submit", function(e){
      e.preventDefault()
      const move = this.player.all_moves.find(x => x.move_id === parseInt(e.target[0].value))
      this.playerTurn(move)
    }.bind(this))

  }

  // turn(move) {
  //   this.playerTurn(move)
  //   this.opposingTurn()
  // }

  checkWinner(){
    console.log("Player: ", this.player.all_stats[5].base_stat, "Opposing: ", this.opposing.all_stats[5].base_stat)
    if(parseInt(this.player.all_stats[5].base_stat) <= 0){
      this.bigFinale(this.player)
      return
    }else if (parseInt(this.opposing.all_stats[5].base_stat) <= 0) {
      this.bigFinale(this.opposing)
      return
    }
  }

  opposingTurn() {
    const move = this.opposing.all_moves[Math.floor(Math.random() * this.opposing.all_moves.length)]
    if (move.stat_change.length > 0) {
      for(const statHash of move.stat_change) {
        if(Object.values(statHash) > 0) {
          this.updateStat(statHash, this.opposing)
        }else {
          this.updateStat(statHash, this.player)
        }
      }
    } else {
        this.updateStat({"hp": -2}, this.player)
    }
    this.addModal(`Opposing pokemon uses ${move.move}! ${move.flavor_text}`, function(){
      console.log("modal cb");
      document.getElementById('game-modal').style.display = "none";
      this.checkWinner();
    }.bind(this))
  }

  playerTurn(move) {
    if (move.stat_change.length > 0) {
      for(const statHash of move.stat_change) {
        if(Object.values(statHash) > 0) {
          this.updateStat(statHash, this.player)
        }else {
          this.updateStat(statHash, this.opposing)
        }
      }
    } else {
        this.updateStat({"hp": -2}, this.opposing)
    }
    this.addModal(`Player pokemon uses ${move.move}! ${move.flavor_text}`, function(){
      console.log("modal cb");
      document.getElementById('game-modal').style.display = "none";
      this.checkWinner();
      this.opposingTurn();
    }.bind(this))
  }

  addModal(message, cb){
    document.getElementById('game-modal').style.display = "block"
    document.getElementById('modal-content').innerHTML =
    `<p>${message}</p>
    <span class="close" id="modalButton">&times;</span>`
    const button = document.getElementById('modalButton')
    button.addEventListener("click", cb)
  }

  updateStat(statHash, poke) {
    let baseAttack = Math.floor(Math.random() * 10)
    const stat = poke.all_stats.find(x => x.stat_name === Object.keys(statHash)[0])
    stat.base_stat += (parseInt(Object.values(statHash)[0]) * baseAttack)
    document.getElementById(`${poke.name}-${Object.keys(statHash)[0]}`).innerHTML = `${stat.stat_name}: ${stat.base_stat}`
    // this.addModal(`Show Stats Here`)
    this.checkWinner()
  }

  bigFinale(poke){
    this.addModal(`${poke.name} fainted!!!!!!`, function(){
      document.getElementById('game-modal').style.display = "none";
      app.newBattle()
    })
  }


}
