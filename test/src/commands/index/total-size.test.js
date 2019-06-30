const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('index:total-size', () => {
  test
    .stdout()
    .command(['index:total-size', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal(['size'])
    })

  test
    .stdout()
    .command(['index:total-size', '--service', 'pgtop_test', '--html'])
    .it('format as HTML', ({ stdout }) => {
      console.log('stdout', stdout)
      expect(stdout).to.match(/<table/)
    })
})
