const request = require('request')
const fs = require('fs')

const baseUrl = 'https://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm?fuseaction=Search.SearchResults_Browse&StepSize=10000&DrugInitial='

const start = 'A'.charCodeAt(0)
const end = 'Z'.charCodeAt(0)

for (let i = start; i <= end; i++) {
  const letter = String.fromCharCode(i)
  const url = baseUrl + letter
  request(url, (err, resp, html) => {
    if (err) {
      throw err
    }
    fs.writeFileSync(`./pages/${letter}.html`, html.trim(), 'utf8')
  })
}
