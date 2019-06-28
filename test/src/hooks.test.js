const postgresHelper = require(`${process.env.ROOT}/test/helpers/postgres`)

before(() => {
  return postgresHelper.addPgStatStatement()
})
