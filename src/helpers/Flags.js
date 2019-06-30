const { flags } = require('@oclif/command')

module.exports = {
  BASE: {
    service: flags.string({
      char: 's',
      description:
        'Postgres service to use (must be defined in ~/.pg_service.conf)'
    }),
    verbose: flags.boolean({
      char: 'v',
      description: 'Enable verbose output'
    }),
    html: flags.boolean({
      description: 'Set output format to HTML'
    })
  },

  DISPLAY: {
    columns: flags.string({
      char: 'c',
      description: 'Select columns to output (comma-separated)'
    }),
    order: flags.string({
      char: 'o',
      description: 'Order (column number (Integer) or name (String))'
    }),
    limit: flags.integer({
      char: 'l',
      description: 'Limit number of rows returned'
    })
  },

  DISPLAY_STATEMENT: {
    truncate: flags.integer({
      char: 't',
      default: 0,
      description: 'Truncate statement to the given number of characters'
    })
  }
}
