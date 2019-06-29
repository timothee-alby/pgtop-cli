const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class QueriesTerminateCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(QueriesTerminateCommand)
    return super.run(
      `SELECT pg_terminate_backend(${args.pid}) AS terminated`,
      args,
      flags
    )
  }
}

QueriesTerminateCommand.args = [
  { name: 'pid', required: true, description: 'query to terminate' }
]

QueriesTerminateCommand.flags = Flags.BASE

QueriesTerminateCommand.description = `terminate query
Terminate the query specified by pid.

Columns:
  * \`terminated\`: true (\`t\`) if the query was terminated
`

module.exports = QueriesTerminateCommand
