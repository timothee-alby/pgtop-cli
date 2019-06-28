const util = require('util')
const readFile = util.promisify(require('fs').readFile)
const ini = require('ini')
const inquirer = require('inquirer')
const { CLIError } = require('@oclif/errors')

const PgServices = {
  async list() {
    const config = ini.parse(
      await readFile(`${process.env.HOME}/.pg_service.conf`, 'utf-8')
    )
    return Object.keys(config)
  },

  async select() {
    const servicesList = await PgServices.list()

    if (!servicesList.length) {
      throw new CLIError('No services found')
    }

    if (servicesList.length === 1) {
      return servicesList[0]
    }

    let servicesPrompt = await inquirer.prompt([
      {
        name: 'service',
        message: 'select a service',
        type: 'list',
        choices: servicesList
      }
    ])
    return servicesPrompt.service
  }
}
module.exports = PgServices
