module.exports = {
  query(table, limit, alias) {
    alias = alias || 'query'
    if (limit === 0) {
      return `${table}.query AS ${alias}`
    }
    return `\
CASE
  WHEN length(${table}.query) <= ${limit}
    THEN ${table}.query
  ELSE substring(${table}.query from 1 for ${limit}) || '…'
END AS ${alias}`
  }
}
