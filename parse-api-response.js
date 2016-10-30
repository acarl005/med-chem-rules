const fs = require('fs')
const db = require('./database')
const asink = require('async')

db.connect(err => {
  if (err) throw err
  readFiles()
})

function readFiles() {
  let files = fs.readdirSync('./api-responses', 'utf8')
  files = files
    .filter(file => /\.json$/.test(file)) // remove non-json files
    .map(file => file.slice(0, -5)) // remove ".json" file extension
  //files = files.slice(0, 1)
  const getDrugs = `SELECT * FROM drugs WHERE compound_name = $1`
  asink.eachSeries(files, parseFile, err => {
    if (err) throw err
    db.end()
  })
}

function parseFile(name, done) {
  let data = fs.readFileSync(`./api-responses/${name}.json`, 'utf8')
  data = JSON.parse(data)
  const row = {}
  row.pub_chem_id = data.id.id.cid
  for (let prop of data.props) {
    if (prop.urn.label === 'Molecular Formula') {
      row.molecular_formula = prop.value.sval
    }
    else if (prop.urn.label === 'Molecular Weight') {
      row.molecular_weight = prop.value.fval
    }
    else if (prop.urn.label === 'Log P') {
      row.log_p = prop.value.fval
    }
    else if (prop.urn.label === 'Count' && prop.urn.name === 'Hydrogen Bond Acceptor') {
      row.h_bond_acceptor_count = prop.value.ival
    }
    else if (prop.urn.label === 'Count' && prop.urn.name === 'Hydrogen Bond Donor') {
      row.h_bond_donor_count = prop.value.ival
    }
    else if (prop.urn.label === 'Topological' && prop.urn.name === 'Polar Surface Area') {
      row.polar_surface_area = prop.value.fval
    }
    else if (prop.urn.label === 'Compound Complexity') {
      row.complexity = prop.value.fval
    }
    else if (prop.urn.label === 'Count' && prop.urn.name === 'Rotatable Bond') {
      row.rotatable_bond_count = prop.value.ival
    }
    else if (prop.urn.label === 'SMILES') {
      row.smiles = row.smiles || prop.value.sval
    }
    else if (prop.urn.label === 'SMILES' && prop.urn.name === 'Preferred') {
      row.smiles = prop.value.sval
    }
    else if (prop.urn.label === 'IUPAC Name') {
      row.iupac_name = row.iupac_name || prop.value.sval
    }
    else if (prop.urn.label === 'IUPAC Name') {
      row.iupac_name = prop.value.sval
    }
  }
  row.heavy_atom_count = data.count.heavy_atom
  row.formal_charge = data.charge
  row.defined_stereocenter_count = data.count.atom_chiral_def
  row.undefined_stereocenter_count = data.count.atom_chiral_undef
  const updates = []
  values = [ name ]
  for (let column in row) {
    updates.push(`${column} = $${values.length + 1}`)
    values.push(row[column])
  }
  const insert = `UPDATE drugs SET ${updates.join(', ')} WHERE compound_name = $1`
  db.query(insert, values, err => {
    if (err) {
      console.log(name)
      console.error(err)
      done(err)
    }
    else done()
  })
}

