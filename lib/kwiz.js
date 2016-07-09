const debug = require('debug')('kwiz:core')
const _ = require('lodash')
const Mingo = require('mingo')
const Handlebars = require('handlebars')
const defaultHandlers = require('./handlers')

class Kwiz {

  constructor (quizDefinition, state, handlers) {
    debug('Init Kwiz', quizDefinition, state, handlers)
    this.quiz = Object.assign({questions: []}, quizDefinition)
    this.quiz.questions = flatten(this.quiz.questions, [])
    this.state = Object.assign({answers: {}}, state)
    this.handlers = Object.assign(defaultHandlers, handlers)
  }

  start (message) {
    this.state.cursor = message ? 0 : -1
    this.state.completed = false
    return this.processMessage(message)
  }

  addHandler (type, handler) {
    this.handlers[type] = handler
  }

  getState () {
    return this.state
  }

  isCompleted () {
    return this.state.completed || false
  }

  processMessage (answer) {
    if (this.quiz.questions.length === 0) {
      return this.finish({
        message: 'Empty quiz definition',
        error: true,
        completed: true
      })
    }
    return this.transformAnswer(answer)
      .then((answer) => {
        const state = this.state
        const questions = this.quiz.questions

        const previousQuestion = state.cursor >= 0 ? questions[state.cursor] : {}
        if (previousQuestion && previousQuestion.answer && answer) {
          state.answers[previousQuestion.answer.id] = answer
        }

        while (true) {
          state.cursor++
          if (state.cursor >= questions.length) {
            return this.finish({
              completed: true
            })
          }
          const question = questions[state.cursor]
          if (question.criteria) {
            const query = new Mingo.Query(question.criteria)
            if (!query.test(state)) {
              continue
            }
          }
          const message = Handlebars.compile(question.message)(state)
          if (state.cursor === (questions.length - 1) && !question.answer) {
            return this.finish({
              message: message,
              attachment: question.attachment,
              completed: true
            })
          }
          return Promise.resolve({
            message: message,
            attachment: question.attachment
          })
        }
      })
      .catch((error) => {
        if (!_.isString(error)) {
          throw error
        }
        return {
          message: Handlebars.compile(error)(this.state),
          error: true
        }
      })
  }

  finish (result) {
    this.state.completed = true
    return Promise.resolve(result)
  }

  transformAnswer (answer) {
    const previousQuestion = this.state.cursor >= 0 ? this.quiz.questions[this.state.cursor] : {}
    if (previousQuestion && previousQuestion.answer) {
      const handler = this.handlers[previousQuestion.answer.type]
      if (handler) {
        return handler(previousQuestion.answer, answer)
      }
    }
    return Promise.resolve(answer)
  }
}

function flatten (questions, parentCriteria) {
  var result = []
  for (var i = 0; i < questions.length; i++) {
    const question = questions[i]
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

Kwiz.Handlebars = Handlebars
module.exports = Kwiz
