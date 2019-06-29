process.env.ROOT = __dirname
  .split('/')
  .slice(0, -1)
  .join('/')

module.exports = {
  HealthTableSizeCommand: require('./commands/health/table-size'),
  HealthTotalSizeCommand: require('./commands/health/total-size'),
  HealthVacuumStatsCommand: require('./commands/health/vacuum-stats'),
  IndexSizeCommand: require('./commands/index/size'),
  IndexTotalSizeCommand: require('./commands/index/total-size'),
  IndexUnusedCommand: require('./commands/index/unused'),
  IndexUsageCommand: require('./commands/index/usage'),
  QueriesBlockingCommand: require('./commands/queries/blocking'),
  QueriesCancelCommand: require('./commands/queries/cancel'),
  QueriesIdleCommand: require('./commands/queries/idle'),
  QueriesLongRunningCommand: require('./commands/queries/long-running'),
  QueriesStatsCommand: require('./commands/queries/stats'),
  QueriesTerminateCommand: require('./commands/queries/terminate')
}
