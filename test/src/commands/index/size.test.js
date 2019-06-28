const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('index:size', () => {
  test
    .stdout()
    .command(['index:size', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { pre, header } = stdoutParser(stdout)
      expect(pre).to.be.empty
      expect(header).to.deep.equal(['namespace', 'table', 'index', 'size'])
    })

  test
    .stdout()
    .command(['index:size', '--service', 'pgtop_test', '-v'])
    .it('return verbose output', ({ stdout }) => {
      let { pre } = stdoutParser(stdout)
      expect(pre).to.not.be.empty
    })
})
