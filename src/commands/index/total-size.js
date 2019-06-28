const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class IndexTotalSizeCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(IndexTotalSizeCommand)
    await super.run(
      `
SELECT
  pg_size_pretty(
    SUM(pg_indexes_size(pg_class.oid))
  ) AS size
FROM pg_class
LEFT JOIN pg_namespace
  ON pg_namespace.oid = pg_class.relnamespace
WHERE pg_namespace.nspname NOT IN ('pg_catalog', 'information_schema')
AND pg_namespace.nspname !~ '^pg_toast'
AND (pg_class.relkind = 'r' OR pg_class.relkind = 'm')
`,
      args,
      flags
    )
  }
}

IndexTotalSizeCommand.flags = Flags.BASE

IndexTotalSizeCommand.description = `show total index size
Show total index size.

Columns:
  * \`size\`: total index size
`

module.exports = IndexTotalSizeCommand
