const { Command } = require('@oclif/command')
const { cli } = require('cli-ux')

const QueryRunner = require(`${process.env.ROOT}/src/helpers/QueryRunner.js`)

// in tests we want to output the action spinner to stdout so we can test it
// without mocking stderr. In normal mode we want to output to stderr so the
// command result can be redirected nicely
const ACTION_TO_STDOUT = process.env['NODE_ENV'] === 'test'

class QueryCommand extends Command {
  async run(sql, args, flags) {
    const queryRunner = new QueryRunner(sql, flags)
    await queryRunner.prepare()

    cli.action.start('running query', '', { stdout: ACTION_TO_STDOUT })
    let { stdout, stderr } = await queryRunner.run()
    if (stdout) {
      stdout = stdout
        .split('\n')
        .filter(line => line !== '')
        .join('\n')
    }
    cli.action.stop()

    if (stdout) this.log(stdout)
    if (stderr) this.log(stderr)
    return { stdout, stderr }
  }
}

module.exports = QueryCommand
