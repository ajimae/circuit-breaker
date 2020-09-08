/**
 * list of available backup/fallback
 * server urls, which we already
 * know before hand
 */
const serverList = [
  'http://localhost:0000/healthcheck',
  'http://localhost:2000/healthcheck',
  'http://localhost:3000/healthcheck',
  'http://localhost:3400/healthcheck',
  'http://localhost:4000/healthcheck',
  'http://localhost:5000/healthcheck',
  'http://localhost:7000/healthcheck',
  'http://localhost:9000/healthcheck'
]

module.exports = serverList;
