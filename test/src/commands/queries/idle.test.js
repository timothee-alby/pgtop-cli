const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('queries:idle', () => {
  test
    .stdout()
    .command(['queries:idle', '--service', 'pgtop_test'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal(['pid', 'duration', 'query'])
    })

  test
    .stdout()
    .command([
      'queries:idle',
      '--service',
      'pgtop_test',
      '--order',
      'duration DESC, query ASC'
    ])
    .it('allows order flag with direction', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal(['pid', 'duration', 'query'])
    })

  test
    .stdout()
    .command([
      'queries:idle',
      '--service',
      'pgtop_test',
      '--order',
      '1; select 1; --'
    ])
    .catch(/Flag value not allowed/)
    .it('sanitizes order flag')

  test
    .stdout()
    .command([
      'queries:idle',
      '--service',
      'pgtop_test',
      '--columns',
      '(select 1+2)'
    ])
    .catch(/Flag value not allowed/)
    .it('sanitizes columns flag')

  test
    .stdout()
    .command([
      'queries:idle',
      '--service',
      'pgtop_test',
      '--columns',
      'duration'
    ])
    .it('uses columns flag', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal(['duration'])
    })
})
