const cheerio = require('cheerio')
const fs = require('fs')
const db = require('./database')

db.connect(err => {
  if (err) throw err
  readFiles()
})

function readFiles() {
  const start = 'A'.charCodeAt(0)
  const end = 'Z'.charCodeAt(0)

  for (let i = start; i <= end; i++) {
    const letter = String.fromCharCode(i)
    const html = fs.readFileSync(`./pages/${letter}.html`)
    const $ = cheerio.load(html)
    $('.product_table li').each((i, el) => extractChemicalInfo(el))
  }
}

function extractChemicalInfo(el) {
  const drugName = el.children[1].children[0].data.trim()
  let chemicalNames = el.children[2].data.trim()
  chemicalNames = parseChemicalNames(chemicalNames)
  chemicalNames.forEach(name => insertRow(drugName, name))
}

function parseChemicalNames(nameStr) {
  nameStr = nameStr.slice(1, -1)
  return nameStr.split('; ')
}

function insertRow(drugName, chemicalName) {
  const sql = 'INSERT INTO drugs (drug_name, compound_name) VALUES ($1, $2)'
  db.query(sql, [drugName, chemicalName])
}

