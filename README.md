# T3AAS
Tic-Tac-Toe (As A Service)

The easiest, most advanced, Tic-Tac-Toe API on the web.
With T3AAS, you can do such impressive things as:
  * Play Tic-Tac-Toe through a REST API
  * Loose Tic-Tac-Toe through a REST API
  * Integrate Tic-Tac-Toe into your app (through a REST API)

## Why
I was challanged to build the most useless API on the web, check out some other entries [here](https://hackclub.com/challenge/)

## How
Run your own instance of T3AAS by running `node index.js` in a cloned repository (defaults to port `3000`) or use the public endpoint at [https://t3aas--christopherschmitt.repl.co/](https://t3aas--christopherschmitt.repl.co/) (hosted by [repl.it](https://repl.it/)).

### Usage
All responses are JSON objects and take the form of:
```JavaScript
{
  ok: true,
  msg: 'In Progress',
  token: '072949F3E6A72B5426DDF8B26162FAC8BC13CF12C6E33D85CEB9C0581E1A1F9A',
  game: 'in-progress',
  state: [0, 1, 2, 3, 'X', 5, 6, 7, 8]
}
```
All interaction with the API is done through URL query parameters that take the form of:

`https://t3aas--christopherschmitt.repl.co/?cmd=<COMMAND>&tok=<TOKEN>`

For example, a move to space `0` might look like this:

`https://t3aas--christopherschmitt.repl.co/?cmd=0&tok=072949F3E6A72B5426DDF8B2`

If you wish to begin a new session, omit the `tok=<TOKEN>` parameter and set your command paramter to `cmd=new`:

`https://t3aas--christopherschmitt.repl.co/?cmd=new`

This will return a JSON response with a unique token with you will need to provide to every subsequent command.  Tokens will expire after 60 seconds if not used. (Performing a move will refresh this timer)
