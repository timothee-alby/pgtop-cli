const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('health:table-size', () => {
  test
    .stdout()
    .command(['health:table-size', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal([
        'namespace',
        'table',
        'kind',
        'size',
        'size_with_index'
      ])
    })
})
