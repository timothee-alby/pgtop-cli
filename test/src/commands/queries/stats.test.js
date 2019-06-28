const { expect, test } = require('@oclif/test')
const stdoutParser = require(`${process.env.ROOT}/test/helpers/stdout`).parser

describe('queries:stats', () => {
  test
    .stdout()
    .command(['queries:stats', '--service', 'pgtop_test', '-l', '1'])
    .it('returns correct header', ({ stdout }) => {
      let { header } = stdoutParser(stdout)
      expect(header).to.deep.equal([
        'total_time',
        'percent',
        'calls',
        'avg',
        'min',
        'max',
        'query'
      ])
    })

  test
    .stdout()
    .command([
      'queries:stats',
      '--service',
      'pgtop_test',
      '-c',
      'query',
      '-t',
      '1',
      '-l',
      '1'
    ])
    .it('truncates query statements', ({ stdout }) => {
      let { rows } = stdoutParser(stdout)
      expect(rows[0][0]).to.match(/^.…$/)
    })
})
