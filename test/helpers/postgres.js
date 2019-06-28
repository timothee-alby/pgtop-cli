const util = require('util')
const exec = util.promisify(require('child_process').exec)

const runPsqlCommand = command => {
  command = `psql service=pgtop_test --command "${command}"`
  return exec(command)
}

let postgresHelper = {
  addPgStatStatement() {
    return runPsqlCommand('CREATE EXTENSION IF NOT EXISTS pg_stat_statements')
  }
}

module.exports = postgresHelper
