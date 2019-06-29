const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class HealthVacuumStatsCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(HealthVacuumStatsCommand)
    return super.run(
      `
WITH
table_opts AS (
  SELECT
    pg_class.oid,
    relname,
    nspname,
    array_to_string(reloptions, '') AS relopts
  FROM pg_class
  INNER JOIN pg_namespace ns
    ON relnamespace = ns.oid
),

vacuum_settings AS (
  SELECT
    oid,
    relname,
    nspname,
    CASE
      WHEN relopts LIKE '%autovacuum_vacuum_threshold%'
        THEN substring(relopts, '.*autovacuum_vacuum_threshold=([0-9.]+).*')::integer
      ELSE current_setting('autovacuum_vacuum_threshold')::integer
    END AS autovacuum_vacuum_threshold,
    CASE
      WHEN relopts LIKE '%autovacuum_vacuum_scale_factor%'
        THEN substring(relopts, '.*autovacuum_vacuum_scale_factor=([0-9.]+).*')::real
      ELSE current_setting('autovacuum_vacuum_scale_factor')::real
    END AS autovacuum_vacuum_scale_factor
  FROM table_opts
)

SELECT
  vacuum_settings.nspname AS namespace,
  vacuum_settings.relname AS table,
  to_char(
    GREATEST(psut.last_vacuum, psut.last_autovacuum), 'YYYY-MM-DD HH24:MI'
  ) AS last,
  pg_class.reltuples AS rows,
  psut.n_dead_tup AS dead_rows,
  (
    autovacuum_vacuum_threshold
    + (autovacuum_vacuum_scale_factor::numeric * pg_class.reltuples)
  ) AS threshold,
  CASE
    WHEN (
      autovacuum_vacuum_threshold
      + (autovacuum_vacuum_scale_factor::numeric * pg_class.reltuples)
    ) < psut.n_dead_tup
    THEN 'YES'
    ELSE 'NO'
  END AS expected
FROM pg_stat_user_tables psut
INNER JOIN pg_class
  ON psut.relid = pg_class.oid
INNER JOIN vacuum_settings
  ON pg_class.oid = vacuum_settings.oid
ORDER BY 6 DESC, 1
`,
      args,
      flags
    )
  }
}

HealthVacuumStatsCommand.flags = Object.assign({}, Flags.BASE, Flags.DISPLAY)

HealthVacuumStatsCommand.description = `show vacuum statistics
Show basic vacuum-related informations.

Columns:
  * \`namespace\`: namespace name
  * \`table\`: table name
  * \`last\`: last vacuum (manual or auto)
  * \`rows\`: estimated number of rows
  * \`dead_rows\`: estimated number of dead rows
  * \`threshold\`: autovacuum threshold (in number of dead rows)
  * \`expected\`: is autovacuum expected
`

module.exports = HealthVacuumStatsCommand
