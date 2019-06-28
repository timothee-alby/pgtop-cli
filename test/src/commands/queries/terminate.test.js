const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('queries:terminate', () => {
  test
    .stdout()
    .command(['queries:terminate', '123', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal(['terminated'])
    })

  test
    .stdout()
    .command(['queries:terminate', '456', '--service', 'pgtop_test'])
    .it('warns with pid', ({ stdout }) => {
      let { warnings } = stdoutParser(stdout)
      expect(warnings[0]).to.match(/PID 456/)
    })
})
