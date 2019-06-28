const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class IndexSizeCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(IndexSizeCommand)
    await super.run(
      `
SELECT
  pg_namespace.nspname AS namespace,
  table_class.relname AS table,
  index_class.relname AS index,
  pg_size_pretty(
    index_class.relpages::bigint*8192
  ) AS size
FROM pg_index
JOIN pg_class index_class ON index_class.oid = pg_index.indexrelid
JOIN pg_class table_class ON table_class.oid = pg_index.indrelid
JOIN pg_namespace ON pg_namespace.oid = table_class.relnamespace
WHERE
  pg_namespace.nspname NOT IN ('pg_catalog', 'information_schema')
  AND pg_namespace.nspname !~ '^pg_toast'
ORDER BY index_class.relpages DESC
`,
      args,
      flags
    )
  }
}

IndexSizeCommand.flags = Object.assign({}, Flags.BASE, Flags.DISPLAY)

IndexSizeCommand.description = `list indexes size
List each index with their size

Columns:
  * \`namespace\`: namespace name
  * \`table\`: table name
  * \`index\`: index name
  * \`size\`: total index size
`

module.exports = IndexSizeCommand
