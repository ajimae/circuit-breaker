const fetch = require("node-fetch");
const { Objects, ping } = require("../utils/utils")
const CircuitBreaker = require('../src/CircuitBreaker')

// serverlist
const SERVER_LIST = require('./serverList');

// main request
function mainServer(url) {
  return new Promise(async function(resolve, reject) {
    try {
      const response = await fetch(url)
      const json = await response.json();

      resolve({ json })
    } catch (error) {
      reject({ error })
    }
  })
}

const options = {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 10000,
  url: 'http://localhost:3000/healthcheck'
}

function fallbackServer() {
  // we can also perform default actions here action like fulfiling the request from cached db
  return new Promise(async function(resolve, reject) {
    try {
      const url = await ping(SERVER_LIST, { fetch });
      if (!url) reject({ message: "backup servers are down" })
      const response = await fetch(url)
      const json = await response.json();

      resolve({ message: "success", json })
    } catch (error) {
      reject({ message: "failed", error })
    }
  })
}

const breaker = new CircuitBreaker(mainServer, Objects.extend({ fallback: fallbackServer }, options))

// entry point - callback pattern
// setInterval(function() {
//   breaker
//     .fire()
//     .then(console.log) // routing will occur here
//     .catch(console.error)
// }, 1000)


// entry point - async/await (Promises) pattern
setInterval(async function() {
  try {
    const data = await breaker.fire();
    console.log(data)
  } catch (err) {
    console.error(err.message)
  }
}, 1000)
