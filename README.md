pgtop-cli
=========

[![Version](https://img.shields.io/npm/v/pgtop-cli.svg)](https://npmjs.org/package/pgtop-cli)
[![License](https://img.shields.io/npm/l/pgtop-cli.svg)](https://github.com/timothee-alby/pgtop-cli/blob/master/package.json)

Analyse PostgreSQL from your terminal


<!-- toc -->
* [Overview](#overview)
* [Usage](#usage)
* [Connecting to the Database](#connecting-to-the-database)
* [Commands](#commands)
* [Contributing](#contributing)
<!-- tocstop -->

# Overview

PGTop helps you running some specifically crafted queries to analyse the state of your database right from your terminal:

```
$ pgtop queries:long-running
running query... done
  pid  | duration |           query
-------+----------+-------------------------
 12345 | 00:12:34 | SELECT                 +
       |          |   my_column            +
       |          | FROM large_table       +
       |          | WHERE                  +
       |          |   some_column LIKE 'foo'
```

Quickly check your database for:

- long-running queries
- blocking queries
- vacuum stats
- unused indexes
- and more...

# Usage
<!-- usage -->
```sh-session
$ npm install -g pgtop-cli
$ pgtop COMMAND
running command...
$ pgtop (-v|--version|version)
pgtop-cli/0.3.0 darwin-x64 node-v13.13.0
$ pgtop --help [COMMAND]
USAGE
  $ pgtop COMMAND
...
```
<!-- usagestop -->

# Connecting to the Database

## With Connection String

Pass a `--dbname` (or `-d`) flag with your connection string. This can be a local
database or a full connection string.

## With Predefined Service

Define your database connection(s) in the `~/.pg_service.conf` as follow:

```
[service_name]
host=
port=
dbname=
user=
password=
```

If more than one connection is defined PGTop will ask you to choose one of the connections each time you run a command.

You can also pass a `--service service_name` to connect directly.

# Commands
<!-- commands -->
* [`pgtop commands`](#pgtop-commands)
* [`pgtop health:table-size`](#pgtop-healthtable-size)
* [`pgtop health:total-size`](#pgtop-healthtotal-size)
* [`pgtop health:vacuum-stats`](#pgtop-healthvacuum-stats)
* [`pgtop help [COMMAND]`](#pgtop-help-command)
* [`pgtop index:size`](#pgtop-indexsize)
* [`pgtop index:total-size`](#pgtop-indextotal-size)
* [`pgtop index:unused`](#pgtop-indexunused)
* [`pgtop index:usage`](#pgtop-indexusage)
* [`pgtop queries:blocking`](#pgtop-queriesblocking)
* [`pgtop queries:cancel PID`](#pgtop-queriescancel-pid)
* [`pgtop queries:idle`](#pgtop-queriesidle)
* [`pgtop queries:long-running`](#pgtop-querieslong-running)
* [`pgtop queries:stats`](#pgtop-queriesstats)
* [`pgtop queries:terminate PID`](#pgtop-queriesterminate-pid)

## `pgtop commands`

list all the commands

```
USAGE
  $ pgtop commands

OPTIONS
  -h, --help  show CLI help
  -j, --json  output in json format
  --hidden    also show hidden commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v1.2.2/src/commands/commands.ts)_

## `pgtop health:table-size`

list table sizes

```
USAGE
  $ pgtop health:table-size

OPTIONS
  -c, --columns=columns  Select columns to output (comma-separated)
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -l, --limit=limit      Limit number of rows returned
  -o, --order=order      Order (column number (Integer) or name (String))
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  List all tables and their size with and without indexes.

  Columns:
     * `namespace`: namespace name
     * `table`: table name
     * `kind`: table kind
     * `size`: table size
     * `size_with_index`: total table size including indexes
```

_See code: [src/commands/health/table-size.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/health/table-size.js)_

## `pgtop health:total-size`

show database size

```
USAGE
  $ pgtop health:total-size

OPTIONS
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  Show database size.

  Columns:
     * `size`: database size
```

_See code: [src/commands/health/total-size.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/health/total-size.js)_

## `pgtop health:vacuum-stats`

show vacuum statistics

```
USAGE
  $ pgtop health:vacuum-stats

OPTIONS
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -c, --columns=columns  Select columns to output (comma-separated)
  -l, --limit=limit      Limit number of rows returned
  -o, --order=order      Order (column number (Integer) or name (String))
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  Show basic vacuum-related informations.

  Columns:
     * `namespace`: namespace name
     * `table`: table name
     * `last`: last vacuum (manual or auto)
     * `rows`: estimated number of rows
     * `dead_rows`: estimated number of dead rows
     * `threshold`: autovacuum threshold (in number of dead rows)
     * `expected`: is autovacuum expected
```

_See code: [src/commands/health/vacuum-stats.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/health/vacuum-stats.js)_

## `pgtop help [COMMAND]`

display help for pgtop

```
USAGE
  $ pgtop help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `pgtop index:size`

list indexes size

```
USAGE
  $ pgtop index:size

OPTIONS
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -c, --columns=columns  Select columns to output (comma-separated)
  -l, --limit=limit      Limit number of rows returned
  -o, --order=order      Order (column number (Integer) or name (String))
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  List each index with their size

  Columns:
     * `namespace`: namespace name
     * `table`: table name
     * `index`: index name
     * `size`: total index size
```

_See code: [src/commands/index/size.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/index/size.js)_

## `pgtop index:total-size`

show total index size

```
USAGE
  $ pgtop index:total-size

OPTIONS
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  Show total index size.

  Columns:
     * `size`: total index size
```

_See code: [src/commands/index/total-size.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/index/total-size.js)_

## `pgtop index:unused`

list unused indexes

```
USAGE
  $ pgtop index:unused

OPTIONS
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -c, --columns=columns  Select columns to output (comma-separated)
  -l, --limit=limit      Limit number of rows returned
  -o, --order=order      Order (column number (Integer) or name (String))
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  List all non-unique indexes used less than 50 times.

  Columns:
     * `namespace`: namespace name
     * `table`: table name
     * `index`: index name
     * `index_scans`: number of time the index was used
     * `index_size`: size of the index
```

_See code: [src/commands/index/unused.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/index/unused.js)_

## `pgtop index:usage`

show indexes usage

```
USAGE
  $ pgtop index:usage

OPTIONS
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -c, --columns=columns  Select columns to output (comma-separated)
  -l, --limit=limit      Limit number of rows returned
  -o, --order=order      Order (column number (Integer) or name (String))
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  Show how many times each table has been queried by index and by sequential scan.

  Columns:
     * `namespace`: namespace name
     * `table`: table name
     * `index_scans`: number of time the index was used
     * `sequential_scans`: number of time the index was NOT used
     * `percent`: index usage in percent
```

_See code: [src/commands/index/usage.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/index/usage.js)_

## `pgtop queries:blocking`

list blocking queries

```
USAGE
  $ pgtop queries:blocking

OPTIONS
  -d, --dbname=dbname      Name of the Postgres database to connect to. Overwrite service flag.
  -c, --columns=columns    Select columns to output (comma-separated)
  -l, --limit=limit        Limit number of rows returned
  -o, --order=order        Order (column number (Integer) or name (String))
  -s, --service=service    Postgres service to use (must be defined in ~/.pg_service.conf)
  -t, --truncate=truncate  Truncate statement to the given number of characters
  -v, --verbose            Enable verbose output
  --html                   Set output format to HTML

DESCRIPTION
  List all blocking queries and the queries being blocked.

  Columns:
     * `blocking_pid`: pid of the blocking query
     * `blocking_duration`: how long the query has been blocking for
     * `blocking_statement`: full statement of the blocking query
     * `blocked_pid`: pid of the blocked query
     * `blocked_duration`: how long the query has been blocked for
     * `blocked_statement`: full statement of the blocked query
```

_See code: [src/commands/queries/blocking.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/queries/blocking.js)_

## `pgtop queries:cancel PID`

cancel query

```
USAGE
  $ pgtop queries:cancel PID

ARGUMENTS
  PID  query to cancel

OPTIONS
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  Cancel the query specified by pid.

  Columns:
     * `cancelled`: true (`t`) if the query was cancelled
```

_See code: [src/commands/queries/cancel.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/queries/cancel.js)_

## `pgtop queries:idle`

list idle queries

```
USAGE
  $ pgtop queries:idle

OPTIONS
  -d, --dbname=dbname      Name of the Postgres database to connect to. Overwrite service flag.
  -c, --columns=columns    Select columns to output (comma-separated)
  -l, --limit=limit        Limit number of rows returned
  -o, --order=order        Order (column number (Integer) or name (String))
  -s, --service=service    Postgres service to use (must be defined in ~/.pg_service.conf)
  -t, --truncate=truncate  Truncate statement to the given number of characters
  -v, --verbose            Enable verbose output
  --html                   Set output format to HTML

DESCRIPTION
  List all idle queries running for more than 10 seconds.

  Columns:
     * `pid`: pid of the query
     * `duration`: how long the query has been running for
     * `statement`: full statement of the query
```

_See code: [src/commands/queries/idle.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/queries/idle.js)_

## `pgtop queries:long-running`

list long-running queries

```
USAGE
  $ pgtop queries:long-running

OPTIONS
  -d, --dbname=dbname      Name of the Postgres database to connect to. Overwrite service flag.
  -c, --columns=columns    Select columns to output (comma-separated)
  -l, --limit=limit        Limit number of rows returned
  -o, --order=order        Order (column number (Integer) or name (String))
  -s, --service=service    Postgres service to use (must be defined in ~/.pg_service.conf)
  -t, --truncate=truncate  Truncate statement to the given number of characters
  -v, --verbose            Enable verbose output
  --html                   Set output format to HTML

DESCRIPTION
  List all non-idle queries running for more than 10 seconds.

  Columns:
     * `pid`: pid of the query
     * `duration`: how long the query has been running for
     * `statement`: full statement of the query
```

_See code: [src/commands/queries/long-running.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/queries/long-running.js)_

## `pgtop queries:stats`

show queries statistics

```
USAGE
  $ pgtop queries:stats

OPTIONS
  -d, --dbname=dbname      Name of the Postgres database to connect to. Overwrite service flag.
  -c, --columns=columns    Select columns to output (comma-separated)
  -l, --limit=limit        Limit number of rows returned
  -o, --order=order        Order (column number (Integer) or name (String))
  -s, --service=service    Postgres service to use (must be defined in ~/.pg_service.conf)
  -t, --truncate=truncate  Truncate statement to the given number of characters
  -v, --verbose            Enable verbose output
  --html                   Set output format to HTML

DESCRIPTION
  Show queries statistics from `pg_stat_statements`.
  Limited to the first 50 rows by default.

  Columns:
     * `total_time`: total time spent for all queries
     * `percent`: total time as percentage
     * `calls`: total number of calls
     * `avg`: average query duration (ms)
     * `min`: minimum query duration (ms)
     * `max`: maximum query duration (ms)
     * `query`: full statement of the query
```

_See code: [src/commands/queries/stats.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/queries/stats.js)_

## `pgtop queries:terminate PID`

terminate query

```
USAGE
  $ pgtop queries:terminate PID

ARGUMENTS
  PID  query to terminate

OPTIONS
  -d, --dbname=dbname    Name of the Postgres database to connect to. Overwrite service flag.
  -s, --service=service  Postgres service to use (must be defined in ~/.pg_service.conf)
  -v, --verbose          Enable verbose output
  --html                 Set output format to HTML

DESCRIPTION
  Terminate the query specified by pid.

  Columns:
     * `terminated`: true (`t`) if the query was terminated
```

_See code: [src/commands/queries/terminate.js](https://github.com/timothee-alby/pgtop-cli/blob/v0.2.0/src/commands/queries/terminate.js)_
<!-- commandsstop -->

# Contributing

Feel free to contribute by opening a Pull Request.

## Testing

Tests are running against a sample database inside Docker.

```
make test
```

By default the tests are absorbing all outputs to stdout as this is what's tested. To view all stdout for debugging, run the tests with:

```
make test_verbose
```

## Linting and formatting

The codebase is linted with eslint and formatted with prettier. Configure your editor accordingly to avoid linting / formatting errors.

## Releasing

```
ROOT=`pwd` npm version patch|minor|major
```
