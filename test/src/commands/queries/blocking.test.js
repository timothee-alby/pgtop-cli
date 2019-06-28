const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('queries:blocking', () => {
  test
    .stdout()
    .command(['queries:blocking', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal([
        'blocking_pid',
        'blocking_duration',
        'blocking_statement',
        'blocked_pid',
        'blocked_duration',
        'blocked_statement'
      ])
    })
})
