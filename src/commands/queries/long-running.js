const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)
const Statement = require(`${process.env.ROOT}/src/helpers/Statement.js`)

class QueriesLongRunningCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(QueriesLongRunningCommand)
    return super.run(
      `
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  ${Statement.query('pg_stat_activity', flags.truncate)}
FROM pg_stat_activity
WHERE
  pg_stat_activity.query <> ''::text
  AND state <> 'idle'
  AND now() - pg_stat_activity.query_start > interval '10 seconds'
ORDER BY duration DESC
`,
      args,
      flags
    )
  }
}

QueriesLongRunningCommand.flags = Object.assign(
  {},
  Flags.BASE,
  Flags.DISPLAY,
  Flags.DISPLAY_STATEMENT
)

QueriesLongRunningCommand.description = `list long-running queries
List all non-idle queries running for more than 10 seconds.

Columns:
  * \`pid\`: pid of the query
  * \`duration\`: how long the query has been running for
  * \`statement\`: full statement of the query
`

module.exports = QueriesLongRunningCommand
