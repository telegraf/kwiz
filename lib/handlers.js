var _ = require('lodash')

module.exports = {
  string: function (question, answer) {
    return _.isString(answer) && answer.length > 0
      ? Promise.resolve(answer)
      : Promise.reject(question.hint || 'Answer must be string')
  },
  int: function (question, answer) {
    return !isNaN(parseInt(answer, 10))
      ? Promise.resolve(parseInt(answer, 10))
      : Promise.reject(question.hint || 'Answer must be int')
  },
  choise: function (question, answer) {
    var isValid = answer.toLowerCase && _.some(question.items, function (item) {
      return item.toLowerCase() === answer.toLowerCase()
    })
    return isValid
      ? Promise.resolve(answer)
      : Promise.reject(question.hint || 'Invalid choise')
  },
  truthy: function (question, answer) {
    if (/ye+(p|s+)?/i.test(answer)) {
      return Promise.resolve('yes')
    }
    if (/no+(pe)?/i.test(answer)) {
      return Promise.resolve('no')
    }
    return Promise.reject(question.hint || 'Yes or no')
  }
}
