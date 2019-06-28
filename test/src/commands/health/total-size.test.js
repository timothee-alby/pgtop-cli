const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('health:total-size', () => {
  test
    .stdout()
    .command(['health:total-size', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal(['size'])
    })
})
