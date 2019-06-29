const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class IndexUnusedCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(IndexUnusedCommand)
    return super.run(
      `
SELECT
  schemaname AS namespace,
  relname AS table,
  indexrelname AS index,
  idx_scan AS index_scans,
  pg_size_pretty(
    pg_relation_size(
      pg_index.indexrelid
    )
  ) AS index_size
FROM pg_stat_user_indexes
JOIN pg_index
  ON pg_stat_user_indexes.indexrelid = pg_index.indexrelid
WHERE
  NOT indisunique
  AND idx_scan < 50
ORDER BY index_scans, pg_relation_size(pg_index.indexrelid) DESC
`,
      args,
      flags
    )
  }
}

IndexUnusedCommand.flags = Object.assign({}, Flags.BASE, Flags.DISPLAY)

IndexUnusedCommand.description = `list unused indexes
List all non-unique indexes used less than 50 times.

Columns:
  * \`namespace\`: namespace name
  * \`table\`: table name
  * \`index\`: index name
  * \`index_scans\`: number of time the index was used
  * \`index_size\`: size of the index
`

module.exports = IndexUnusedCommand
