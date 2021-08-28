const inquirer = require('inquirer')

const validateEmpty = (errorMessage) => (val) => {
  if (!Number.isNaN(val)) return Promise.resolve(true)
  if (!val || !val.length) return Promise.reject(new Error(errorMessage))
  return Promise.resolve(true)
}

module.exports = async (subscriptions) => {
  const result = await inquirer.prompt({
    name: 'subscriptions',
    type: 'checkbox',
    message: 'Select subscriptions',
    choices: subscriptions.map((subscription) => ({
      name: subscription,
      value: subscription,
    })),
    validate: validateEmpty('You must select a subscription'),
  })
  return result.subscriptions
}
