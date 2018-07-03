const { createServer } = require('http')
const { randomBytes } = require('crypto')
const url = require('url')
const qs = require('querystring') 
const { lobby } = require('./lobby')
const { Session } = require('./Session')

const server = createServer((req, res) => {
  const cmd = qs.parse(url.parse(req.url).query).cmd
  const tok = qs.parse(url.parse(req.url).query).tok

  /* NEW GAME */
  if (!tok && cmd === 'NEW') {
    const uuid = randomBytes(32).toString('hex').toUpperCase()
    const game = new Session(uuid, lobby)

    lobby[uuid] = game.start(res)
    return
  }

  /* CONTINUE GAME */
  if (lobby[tok] && cmd > -1 && cmd < 9) {
    lobby[tok].resetTimer(lobby)
    lobby[tok].pcMove(Number(cmd), res)
    return
  }

  /* INVALID GAME */
  if (!lobby[tok]) {
    res.end(JSON.stringify({
      ok: false,
      msg: 'Invalid or expired token',
      token: null,
      game: null,
      state: null
    }))
    return
  }

  /* INVALID MOVE */
  if (tok && (cmd > 8 || cmd < 0)) {
    res.end(JSON.stringify({
      ok: false,
      msg: 'Invalid move',
      token: tok,
      game: 'in-progress',
      state: lobby[tok].game
    }))
    return
  }
})

server.listen(3000)