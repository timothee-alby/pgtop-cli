const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class IndexUsageCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(IndexUsageCommand)
    await super.run(
      `
SELECT
  schemaname AS namespace,
  relname AS table,
  idx_scan AS index_scans,
  seq_scan AS sequential_scans,
  (
    CASE idx_scan
      WHEN 0 THEN null
      ELSE (100 * idx_scan / (seq_scan + idx_scan))::INT
    END
  ) AS percent
 FROM pg_stat_user_tables
 ORDER BY index_scans DESC
`,
      args,
      flags
    )
  }
}

IndexUsageCommand.flags = Object.assign({}, Flags.BASE, Flags.DISPLAY)

IndexUsageCommand.description = `show indexes usage
Show how many times each table has been queried by index and by sequential scan.

Columns:
  * \`namespace\`: namespace name
  * \`table\`: table name
  * \`index_scans\`: number of time the index was used
  * \`sequential_scans\`: number of time the index was NOT used
  * \`percent\`: index usage in percent
`

module.exports = IndexUsageCommand
