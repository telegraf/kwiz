var _ = require('lodash')

module.exports = {
  string: function (question, answer) {
    return _.isString(answer) && answer.length > 0 ? Promise.resolve(answer) : Promise.reject(question.hint || 'Answer must be string')
  },
  int: function (question, answer) {
    return !isNaN(parseInt(answer, 10)) ? Promise.resolve(parseInt(answer, 10)) : Promise.reject(question.hint || 'Answer must be int')
  },
  chiose: function (question, answer) {
    return (question.items && question.items.indexOf(answer) !== -1) ? Promise.resolve(answer) : Promise.reject(question.hint || 'Wrong choise')
  }
}
