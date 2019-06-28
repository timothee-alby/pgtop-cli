const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('index:unused', () => {
  test
    .stdout()
    .command(['index:unused', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal([
        'namespace',
        'table',
        'index',
        'index_scans',
        'index_size'
      ])
    })
})
