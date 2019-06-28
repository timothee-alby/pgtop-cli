let stdoutParser = {
  parser(stdoutString) {
    let stdoutObject = {}
    let stdoutArray = stdoutString.split('\n')

    // remove empty lines
    stdoutArray = stdoutArray.filter(line => line !== '')

    // remove spinner lines
    while (stdoutArray[0].match(/^running query/)) {
      stdoutArray.shift()
    }

    // store warning messages
    stdoutObject.warnings = []
    while (stdoutArray[stdoutArray.length - 1].match(/^WARNING/)) {
      stdoutObject.warnings.unshift(stdoutArray.pop())
    }

    // store pre-results output
    let delimiterLineIndex = stdoutArray.findIndex(line => line.match('-----'))
    stdoutObject.pre = stdoutArray.splice(0, delimiterLineIndex - 1)

    // store header
    stdoutObject.header = stdoutParser.lineParser(stdoutArray.shift())

    // removed delimiter
    stdoutArray.shift()

    // at this point stdoutArray contains the rows only
    stdoutArray = stdoutArray.map(line => stdoutParser.lineParser(line))

    // records can be displayed on multiple rows (e.g. query statements). Here
    // we try to merge records into a single row
    stdoutObject.rows = []
    let onGoingLine
    for (let line of stdoutArray) {
      onGoingLine = onGoingLine || line
      if (line.some(column => column[column.length - 1] === '+')) {
        onGoingLine = stdoutParser.mergeLines(onGoingLine, line)
      } else {
        stdoutObject.rows.push(onGoingLine)
        onGoingLine = null
      }
    }

    return stdoutObject
  },

  lineParser(line) {
    return line.split('|').map(column => column.trim())
  },

  mergeLines(currentLine, newLine) {
    let indexCurrentLine
    for (let column in currentLine) {
      if (newLine[column]) {
        indexCurrentLine = currentLine[column].slice(0, -1)
        currentLine[column] = `${indexCurrentLine}\n${newLine[column]}`
      }
    }
    return currentLine
  }
}

module.exports = stdoutParser
