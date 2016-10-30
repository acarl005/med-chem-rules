const request = require('request')
const fs = require('fs')
const db = require('./database')

const baseUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'

db.connect(err => {
  if (err) throw err
  getNamesFromDatabase()
})

function getNamesFromDatabase() {
  const sql = "SELECT DISTINCT compound_name FROM drugs ORDER BY compound_name"
  db.query(sql, (err, data) => {
    if (err) throw err
    makeRequests(data.rows)
  })
}

function makeRequests(rows) {
  const names = rows.map(row => row.compound_name)
  let i = 0
  makeRequest(names, i)
}

function makeRequest(names, i) {
  if (i >= names.length) {
    return db.end()
  }
  const name = names[i].trim()
  const options = {
    url: baseUrl + name,
    headers: {
      Accept: 'application/json'
    }
  }
  request(options, (err, resp, json) => {
    if (err) throw err
    const data = JSON.parse(json)
    handleResponse(data, name)
    setTimeout(makeRequest, 80, names, i + 1)
  })
}

function handleResponse(data, name) {
  if (data.Fault) {
    console.log('error with', name)
    fs.appendFileSync('./api-responses/errors.txt', name + '\n', 'utf8')
  } else if (data.PC_Compounds) {
    const compound = data.PC_Compounds[0]
    const file = JSON.stringify(compound, null, 2)
    console.log('saving', name)
    fs.writeFileSync(`./api-responses/${name}.json`, file, 'utf8')
  }
}

