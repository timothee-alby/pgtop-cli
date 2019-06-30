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
      description: 'Select columns to output (comma-separated)',
      parse: strickSQLParser
    }),
    order: flags.string({
      char: 'o',
      description: 'Order (column number (Integer) or name (String))',
      parse: strickSQLParser
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

// validate input to allow ordering and selecting columns while being as strick
// as possible to prevent SQL injection.
// Allows alphnumerical characters and underscores separated by a comma and a
// space (optional), plus the strings ` asc` or ` desc` (case-insensitive)
function strickSQLParser(input) {
  let columns = input.split(/, ?/)
  for (let column of columns) {
    column = column.toLowerCase()
    column = column.replace(' asc', '')
    column = column.replace(' desc', '')

    if (!/^[a-z0-9_]+$/.test(column)) {
      throw new Error(`Flag value not allowed: '${input}' ('${column}')`)
    }
  }
  return input
}
