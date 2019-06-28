const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('queries:cancel', () => {
  test
    .stdout()
    .command(['queries:cancel', '123', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal(['cancelled'])
    })

  test
    .stdout()
    .command(['queries:cancel', '456', '--service', 'pgtop_test'])
    .it('warns with pid', ({ stdout }) => {
      let { warnings } = stdoutParser(stdout)
      expect(warnings[0]).to.match(/PID 456/)
    })
})
