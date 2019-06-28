const Flags = require(`${process.env.ROOT}/src/helpers/Flags.js`)
const QueryCommand = require(`${process.env.ROOT}/src/helpers/QueryCommand.js`)

class QueriesCancelCommand extends QueryCommand {
  async run() {
    const { args, flags } = this.parse(QueriesCancelCommand)
    await super.run(
      `SELECT pg_cancel_backend(${args.pid}) AS cancelled`,
      args,
      flags
    )
  }
}

QueriesCancelCommand.args = [
  { name: 'pid', required: true, description: 'query to cancel' }
]

QueriesCancelCommand.flags = Flags.BASE

QueriesCancelCommand.description = `cancel query
Cancel the query specified by pid.

Columns:
  * \`cancelled\`: true (\`t\`) if the query was cancelled
`

module.exports = QueriesCancelCommand
