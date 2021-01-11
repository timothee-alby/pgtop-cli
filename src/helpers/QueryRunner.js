const util = require('util')
const exec = util.promisify(require('child_process').exec)

const PgServices = require(`${process.env.ROOT}/src/helpers/PgServices.js`)

const MAX_BUFFER_SIZE = 1024 * 1024 * 10 // 10 Mb, arbitrary
class QueryRunner {
  constructor(query, flags) {
    this.query = query
    this.flags = flags
  }

  async prepare() {
    this.dbname = this.flags.dbname
    if (!this.dbname) {
      this.service = this.flags.service || (await PgServices.select())
    }

    this.decorate()

    this.command = 'psql'
    if (this.dbname) {
      this.command += ` --dbname=${this.dbname}`
    } else {
      this.command += ` service=${this.service}`
    }
    this.command += ` --command "${this.query}"`
    if (this.flags.verbose) {
      this.command += ' --echo-all'
    } else {
      this.command += ' -q'
    }
    this.command += ' --pset null=¤'
    this.command += ' --pset expanded=off'
    this.command += ' --pset footer=off'
    if (this.flags.html) {
      this.command += ' --pset format=html'
    }
  }

  decorate() {
    if (this.flags.limit === 0) {
      this.flags.limit = null
    }
    if (!this.flags.columns && !this.flags.order && !this.flags.limit) {
      return
    }

    let decorator = ''

    if (this.flags.columns) {
      decorator += `SELECT ${this.flags.columns}`
    } else {
      decorator += 'SELECT *'
    }

    decorator += ` FROM (${this.query}) _`

    if (this.flags.order) {
      decorator += ` ORDER BY ${this.flags.order}`
    }

    if (this.flags.limit) {
      decorator += ` LIMIT ${this.flags.limit}`
    }

    this.query = decorator
  }

  async run() {
    return exec(this.command, { maxBuffer: MAX_BUFFER_SIZE })
  }
}

module.exports = QueryRunner
