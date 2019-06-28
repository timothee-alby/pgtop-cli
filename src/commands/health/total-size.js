const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class HealthTotalSizeCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(HealthTotalSizeCommand)
    await super.run(
      `
SELECT
  pg_size_pretty(
    pg_database_size(current_database())
  ) AS size
`,
      args,
      flags
    )
  }
}

HealthTotalSizeCommand.flags = Flags.BASE

HealthTotalSizeCommand.description = `show database size
Show database size.

Columns:
  * \`size\`: database size
`

module.exports = HealthTotalSizeCommand
