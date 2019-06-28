const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)
const Statement = require(`${process.env.ROOT}/src/helpers/Statement.js`)

class QueriesBlockingCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(QueriesBlockingCommand)
    await super.run(
      `
SELECT
  blocking.pid AS blocking_pid,
  now() - blocking_activity.query_start AS blocking_duration,
  ${Statement.query('blocking_activity', flags.truncate, 'blocking_statement')},
  blocked.pid AS blocked_pid,
  now() - blocked_activity.query_start AS blocked_duration,
  ${Statement.query('blocked_activity', flags.truncate, 'blocked_statement')}
FROM pg_catalog.pg_locks blocked
JOIN pg_catalog.pg_stat_activity blocked_activity
  ON blocked.pid = blocked_activity.pid
JOIN pg_catalog.pg_locks blocking
  ON blocked.transactionid = blocking.transactionid
  AND blocked.pid != blocking.pid
JOIN pg_catalog.pg_stat_activity blocking_activity
  ON blocking.pid = blocking_activity.pid
WHERE NOT blocked.granted
`,
      args,
      flags
    )
  }
}

QueriesBlockingCommand.flags = Object.assign(
  {},
  Flags.BASE,
  Flags.DISPLAY,
  Flags.DISPLAY_STATEMENT
)

QueriesBlockingCommand.description = `list blocking queries
List all blocking queries and the queries being blocked.

Columns:
  * \`blocking_pid\`: pid of the blocking query
  * \`blocking_duration\`: how long the query has been blocking for
  * \`blocking_statement\`: full statement of the blocking query
  * \`blocked_pid\`: pid of the blocked query
  * \`blocked_duration\`: how long the query has been blocked for
  * \`blocked_statement\`: full statement of the blocked query
`

module.exports = QueriesBlockingCommand
