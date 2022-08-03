const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)
const Statement = require(`${process.env.ROOT}/src/helpers/Statement.js`)

const DEFAULT_LIMIT = 50
class QueriesStatsCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(QueriesStatsCommand)
    flags.limit = flags.limit || DEFAULT_LIMIT
    return super.run(
      `
WITH my_pg_stat_statements AS (
  SELECT
    COALESCE((my.json ->> 'total_exec_time')::DECIMAL, 0) + COALESCE((my.json ->> 'total_plan_time')::DECIMAL, 0) + COALESCE((my.json ->> 'total_time')::DECIMAL, 0) AS total_time,
    COALESCE((my.json ->> 'min_exec_time')::DECIMAL, 0) + COALESCE((my.json ->> 'min_plan_time')::DECIMAL, 0) + COALESCE((my.json ->> 'min_time')::DECIMAL, 0) AS min_time,
    COALESCE((my.json ->> 'max_exec_time')::DECIMAL, 0) + COALESCE((my.json ->> 'max_plan_time')::DECIMAL, 0) + COALESCE((my.json ->> 'max_time')::DECIMAL, 0) AS max_time,
    (my.json ->> 'calls')::INTEGER AS calls,
    my.json ->> 'query' AS query
  FROM (
    SELECT ROW_TO_JSON(pg_stat_statements) as json
    FROM pg_stat_statements
  ) my
)

SELECT
  interval '1 millisecond' * total_time AS total_time,
  round(
    (total_time / (SUM(total_time) OVER()))::NUMERIC * 100 , 3
  ) AS percent,
  calls AS calls,
  round(
    (total_time/calls)::NUMERIC, 3
  ) as avg,
  round(
    min_time::NUMERIC, 3
  ) as min,
  round(
    max_time::NUMERIC, 3
  ) as max,
  ${Statement.query('my_pg_stat_statements', flags.truncate)}
FROM my_pg_stat_statements
ORDER BY total_time DESC
`,
      args,
      flags
    )
  }
}

QueriesStatsCommand.flags = Object.assign(
  {},
  Flags.BASE,
  Flags.DISPLAY,
  Flags.DISPLAY_STATEMENT
)

QueriesStatsCommand.description = `show queries statistics
Show queries statistics from \`pg_stat_statements\`.
Limited to the first ${DEFAULT_LIMIT} rows by default.

Columns:
  * \`total_time\`: total time spent for all queries
  * \`percent\`: total time as percentage
  * \`calls\`: total number of calls
  * \`avg\`: average query duration (ms)
  * \`min\`: minimum query duration (ms)
  * \`max\`: maximum query duration (ms)
  * \`query\`: full statement of the query
`

module.exports = QueriesStatsCommand
