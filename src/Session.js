class Session {
  constructor (token, lobby) {
    this.gc = setTimeout(() => delete lobby[token], 60000)
    this.game = new Array(9).fill(0).map((_, i) => i)
    this.token = token
  }

  resetTimer (lobby) {
    clearTimeout(this.gc)
    this.gc = setTimeout(() => delete lobby[token], 60000)
  }

  didWin (flag) {
    return (this.game[0] == flag && this.game[1] == flag && this.game[2] == flag)
    ||     (this.game[3] == flag && this.game[4] == flag && this.game[5] == flag)
    ||     (this.game[6] == flag && this.game[7] == flag && this.game[8] == flag)
    ||     (this.game[0] == flag && this.game[3] == flag && this.game[6] == flag)
    ||     (this.game[1] == flag && this.game[4] == flag && this.game[7] == flag)
    ||     (this.game[2] == flag && this.game[5] == flag && this.game[8] == flag)
    ||     (this.game[0] == flag && this.game[4] == flag && this.game[8] == flag)
    ||     (this.game[2] == flag && this.game[4] == flag && this.game[6] == flag)
  }

  didTie () {
    return this.game.filter(val => val !== 'O' && val !== 'X').length === 0
  }

  pcMove (cmd, res) {
    if (this.game[cmd] !== 'X' || this.game[cmd] !== 'O') {
      this.game[cmd] = 'O'
    } else {
      res.end(JSON.stringify({
        ok: false,
        msg: 'Invalid move',
        token: this.token,
        game: 'in-progress',
        state: this.game
      }))
      return
    }

    if (this.didTie()) {
      res.end(JSON.stringify({
        ok: true,
        msg: 'Tied Game',
        token: this.token,
        game: 'tie',
        state: this.game
      }))
    } else {
      this.npcMove()
      if (this.didWin('X')) {
        res.end(JSON.stringify({
          ok: true,
          msg: 'Lost Game',
          token: this.token,
          game: 'loss',
          state: this.game
        }))
      } else {
        res.end(JSON.stringify({
          ok: true,
          msg: 'In Progress',
          token: this.token,
          game: 'in-progress',
          state: this.game
        }))
      }
    }
  }

  npcMove () {
    const winning = (board, flag) =>
      (board[0] == flag && board[1] == flag && board[2] == flag) ||
      (board[3] == flag && board[4] == flag && board[5] == flag) ||
      (board[6] == flag && board[7] == flag && board[8] == flag) ||
      (board[0] == flag && board[3] == flag && board[6] == flag) ||
      (board[1] == flag && board[4] == flag && board[7] == flag) ||
      (board[2] == flag && board[5] == flag && board[8] == flag) ||
      (board[0] == flag && board[4] == flag && board[8] == flag) ||
      (board[2] == flag && board[4] == flag && board[6] == flag)
      
    const minMax = (board, player) => {
      const spaces = board.filter(s => s != 'O' && s != 'X')

      if (winning(board, 'O')) return { score: -10 }
      if (winning(board, 'X')) return { score: +10 }
      if (spaces.length === 0) return { score: +0 }

      let moves = []

      for (let i = 0; i < spaces.length; i++) {
        let move = {}

        move.index = board[spaces[i]]
        move.score = 0
        board[spaces[i]] = player

        if (player === 'X') move.score = minMax(board, 'O')
        if (player === 'O') move.score = minMax(board, 'X')

        board[spaces[i]] = move.index
        moves.push(move)
      }

      return moves.sort((a, b) => b.score - a.score)[0]
    }

    this.game[minMax(this.game, 'X').index] = 'X'
  }

  start (res) {
    this.game[4] = 'X'

    res.end(JSON.stringify({
      ok: true,
      msg: 'In Progress',
      token: this.token,
      game: 'in-progress',
      state: this.game
    }))

    return this
  }
}

module.exports.Session = Session