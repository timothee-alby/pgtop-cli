const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('index:usage', () => {
  test
    .stdout()
    .command(['index:usage', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal([
        'namespace',
        'table',
        'index_scans',
        'sequential_scans',
        'percent'
      ])
    })
})
