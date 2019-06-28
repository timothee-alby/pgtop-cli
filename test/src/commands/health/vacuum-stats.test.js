const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('health:vacuum-stats', () => {
  test
    .stdout()
    .command(['health:vacuum-stats', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal([
        'namespace',
        'table',
        'last',
        'rows',
        'dead_rows',
        'threshold',
        'expected'
      ])
    })
})
