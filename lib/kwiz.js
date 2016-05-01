var debug = require('debug')('kwiz:core')
var _ = require('lodash')
var Mingo = require('mingo')
var defaultHandlers = require('./handlers')

var kwiz = Kwiz.prototype
module.exports = Kwiz

function Kwiz (quizDefinition, state, handlers) {
  this.quiz = Object.assign({questions: []}, quizDefinition)
  this.quiz.questions = flatten(this.quiz.questions, [])
  this.state = Object.assign({answers: {}}, state)
  this.handlers = Object.assign(defaultHandlers, handlers)
  this.Handlebars = require('handlebars')
}

kwiz.start = function (message) {
  this.state.cursor = message ? 0 : -1
  this.state.completed = false
  return this.processMessage(message)
}

kwiz.addHandler = function (type, handler) {
  this.handlers[type] = handler
}

kwiz.getState = function () {
  return this.state
}

kwiz.isCompleted = function () {
  return this.state.completed || false
}

kwiz.processMessage = function (answer) {
  if (this.quiz.questions.length === 0) {
    return this._finish({
      completed: true
    })
  }
  return this._transform(answer)
    .then(function (answer) {
      var state = this.state
      var questions = this.quiz.questions

      var previousQuestion = state.cursor >= 0 ? questions[state.cursor] : {}
      if (previousQuestion && previousQuestion.answer && answer) {
        state.answers[previousQuestion.answer.id] = answer
      }

      while (true) {
        state.cursor++
        if (state.cursor >= questions.length) {
          return this._finish({
            completed: true
          })
        }

        var question = questions[state.cursor]
        if (question.criteria) {
          var query = new Mingo.Query(question.criteria)
          if (!query.test(state)) {
            continue
          }
        }

        if (state.cursor === (questions.length - 1) && !question.answer) {
          return this._finish({
            message: this.Handlebars.compile(question.message)(state),
            attachment: question.attachment,
            completed: true
          })
        }
        return Promise.resolve({
          message: this.Handlebars.compile(question.message)(state),
          attachment: question.attachment
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

kwiz._finish = function (result) {
  this.state.completed = true
  return Promise.resolve(result)
}

kwiz._transform = function (answer) {
  var previousQuestion = this.state.cursor >= 0 ? this.quiz.questions[this.state.cursor] : {}
  if (previousQuestion && previousQuestion.answer) {
    var handler = this.handlers[previousQuestion.answer.type]
    if (handler) {
      return handler(previousQuestion.answer, answer)
    }
  }
  return Promise.resolve(answer)
}

function flatten (questions, parentCriteria) {
  var result = []
  for (var i = 0; i < questions.length; i++) {
    var question = questions[i]
    if (!question.questions) {
      if (parentCriteria.length > 0) {
        question.criteria = {$and: _.filter(parentCriteria.concat(question.criteria))}
      }
      result.push(question)
    } else {
      result = result.concat(flatten(question.questions, _.filter(parentCriteria.concat(question.criteria))))
    }
  }
  return result
}
