var debug = require('debug')('kwiz:core')
var _ = require('lodash')
var Mingo = require('mingo')
var defaultHandlers = require('./handlers')

var kwiz = Kwiz.prototype
module.exports = Kwiz

function Kwiz (quizDefinition, state) {
  if (!(this instanceof Kwiz)) {
    return new Kwiz(quizDefinition, state)
  }
  debug('Initialize', quizDefinition, state)
  this.quiz = Object.assign({messages: []}, quizDefinition)
  this.quiz.messages = flatten(this.quiz.messages, [])
  this.state = Object.assign({answers: {}}, state)
  this.handlers = defaultHandlers
  this.Handlebars = require('handlebars')
}

kwiz.finish = function (result) {
  this.state.completed = true
  return Promise.resolve(result)
}

kwiz.addHandler = function (type, handler) {
  this.handlers[type] = handler
}

kwiz.getState = function () {
  return this.state
}

kwiz.processMessage = function (answer) {
  if (this.quiz.messages.length == 0) {
    return this.finish({
      completed: true
    })
  }
  return this.transform(answer)
    .then(function (answer) {
      var state = this.state
      var previousMessage = state.cursor >= 0 ? this.quiz.messages[state.cursor] : {}
      if (previousMessage.question && answer) {
        this.state.answers[previousMessage.question.id] = answer
      }

      while(true) {
        state.cursor++
        if (state.cursor >= this.quiz.messages.length) {
          return this.finish({
            completed: true
          })
        }

        var message = this.quiz.messages[state.cursor]
        if (message.criteria) {
          var query = new Mingo.Query(message.criteria)
          if (!query.test(this.state)) {
            continue
          }
        }

        if (state.cursor === (this.quiz.messages.length - 1) && !message.answer) {
          return this.finish({
            message: this.Handlebars.compile(message.message)(state),
            completed: true
          })
        }
        return Promise.resolve({
          message: this.Handlebars.compile(message.message)(state)
        })
      }
    }.bind(this))
    .catch(function (error) {
      if (!_.isString(error)) {
        throw error
      }
      return {
        message: this.Handlebars.compile(error)(this.state),
        error: true
      }
    }.bind(this))
}

kwiz.transform = function (answer) {
  var previousMessage = this.state.cursor >= 0 ? this.quiz.messages[this.state.cursor] : {}
  if (previousMessage.question) {
    var handler = this.handlers[previousMessage.question.type]
    if (handler) {
      return handler(previousMessage.question, answer)
    }
  }
  return Promise.resolve(answer)
}

kwiz.start = function () {
  this.state.cursor = -1
  this.state.completed = false
  return this.processMessage()
}

function flatten (messages, parentCriteria) {
  var result = []
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i]
    if (!message.messages) {
      if (parentCriteria.length > 0) {
        message.criteria = {$and: _.filter(parentCriteria.concat(message.criteria))}
      }
      result.push(message)
    } else {
      result = result.concat(flatten(message.messages, _.filter(parentCriteria.concat(message.criteria))))
    }
  }
  return result
}
