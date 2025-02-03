```
FFFFFFFFFFFFFFFFFFFFFFUUUUUUUU     UUUUUUUURRRRRRRRRRRRRRRRR   IIIIIIIIII
F::::::::::::::::::::FU::::::U     U::::::UR::::::::::::::::R  I::::::::I
F::::::::::::::::::::FU::::::U     U::::::UR::::::RRRRRR:::::R I::::::::I
FF::::::FFFFFFFFF::::FUU:::::U     U:::::UURR:::::R     R:::::RII::::::II
  F:::::F       FFFFFF U:::::U     U:::::U   R::::R     R:::::R  I::::I
  F:::::F              U:::::D     D:::::U   R::::R     R:::::R  I::::I
  F::::::FFFFFFFFFF    U:::::D     D:::::U   R::::RRRRRR:::::R   I::::I
  F:::::::::::::::F    U:::::D     D:::::U   R:::::::::::::RR    I::::I
  F:::::::::::::::F    U:::::D     D:::::U   R::::RRRRRR:::::R   I::::I
  F::::::FFFFFFFFFF    U:::::D     D:::::U   R::::R     R:::::R  I::::I
  F:::::F              U:::::D     D:::::U   R::::R     R:::::R  I::::I
  F:::::F              U::::::U   U::::::U   R::::R     R:::::R  I::::I
FF:::::::FF            U:::::::UUU:::::::U RR:::::R     R:::::RII::::::II
F::::::::FF             UU:::::::::::::UU  R::::::R     R:::::RI::::::::I
F::::::::FF               UU:::::::::UU    R::::::R     R:::::RI::::::::I
FFFFFFFFFFF                 UUUUUUUUU      RRRRRRRR     RRRRRRRIIIIIIIIII
```

# Developer Notes - Hacking On FURI

FURI - Fast Uniform Resource Identifier
Copyright(c) 2016 Rajinder Yadav
Labs DevMentor.org Crop. `<info@devmentor.org>`

# Introduction

Before making changes, make sure to read the coding guideline found in this project under the docs folder.

# Fast Uniform Resource Identifier

The Fast and Furious Node Router!

Before running the code type:

    npm install

# Development Flow Setup

Open 2 terminal sessions.

### Terminal 1

In the first terminal type the following to build in watch mode.

    npm run dev

### Terminal 2

In the second terminal, type the following to run node in watch mode. Use the browser or curl to test on `localhost:3000`.

    npm start

## Validating and testing

To run the linter

    npm run check

Running Unit tests, make sure furi is running on `localhost:3000` (see above).

    npm test

_Note_: To see npm scripts type `npm run`.

## Node.js reference

* [Errors](https://nodejs.org/api/errors.html)
* [Events](https://nodejs.org/api/events.html#events_class_eventemitter)
* [Stream](https://nodejs.org/api/stream.html#stream_class_stream_readable)
* [Buffer](https://nodejs.org/api/buffer.html)
* [HTTP](https://nodejs.org/api/http.html#http_class_http_serverresponse)
