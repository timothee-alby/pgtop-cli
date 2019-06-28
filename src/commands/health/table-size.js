const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class HealthTableSizeCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(HealthTableSizeCommand)
    await super.run(
      `
SELECT
  pg_namespace.nspname AS namespace,
  pg_class.relname AS table,
  kinds.kind,
  pg_size_pretty(
    pg_table_size(pg_class.oid)
  ) AS size,
  pg_size_pretty(
    pg_total_relation_size(pg_class.oid))
  AS size_with_index
FROM pg_class
LEFT JOIN pg_namespace
  ON pg_namespace.oid = pg_class.relnamespace
JOIN (
  VALUES ('r', 'table'), ('m', 'materialized view')
) kinds (relkind, kind)
  ON kinds.relkind = pg_class.relkind
WHERE
  pg_namespace.nspname NOT IN ('pg_catalog', 'information_schema')
  AND pg_namespace.nspname !~ '^pg_toast'
  AND (pg_class.relkind = 'r' OR pg_class.relkind = 'm')
ORDER BY pg_total_relation_size(pg_class.oid) DESC
`,
      args,
      flags
    )
  }
}

HealthTableSizeCommand.flags = Object.assign({}, Flags.BASE, Flags.DISPLAY)

HealthTableSizeCommand.description = `list table sizes
List all tables and their size with and without indexes.

Columns:
  * \`namespace\`: namespace name
  * \`table\`: table name
  * \`kind\`: table kind
  * \`size\`: table size
  * \`size_with_index\`: total table size including indexes
`

module.exports = HealthTableSizeCommand
