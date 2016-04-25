var should = require('should')
var Kwiz = require('../lib/kwiz')
var stub = require('./stub')

describe('Kwiz', function () {
  describe('core:', function () {
    it('should work with undefined quiz definitions', function () {
      var quiz = new Kwiz()
      return quiz.start()
    })

    it('should work with empty quiz definitions', function () {
      var quiz = new Kwiz({})
      return quiz.start()
    })

    it('should not have empty state', function () {
      var quiz = new Kwiz()
      should.exist(quiz.getState())
      return quiz.start()
    })

    it('should work with simple message', function () {
      var quiz = new Kwiz(stub.nanoQuiz)
      return quiz.start()
        .then((reply) => {
          should.exist(reply)
          reply.should.have.property('message')
          reply.message.should.be.equal('Hey')
          quiz.isCompleted().should.be.true()
        })
    })

    it('should work with messages', function () {
      var quiz = new Kwiz(stub.microQuiz)
      return quiz.start()
        .then((reply) => {
          reply.message.should.be.equal('Hey')
          return quiz.processMessage()
        })
        .then((reply) => {
          reply.message.should.be.equal('Buy')
        })
    })

    it('should return answers on complete', function () {
      var quiz = new Kwiz(stub.milliQuiz)
      return quiz.start()
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage()
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('John')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage()
        })
        .then((reply) => {
          quiz.getState().answers.should.deepEqual({name: 'John'})
        })
    })
  })

  describe('templates:', function () {
    it('should templates use context', function () {
      var quiz = new Kwiz(stub.milliQuiz)
      return quiz.start()
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage()
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('John')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          should.exist(reply.message)
          reply.message.should.be.equal('Buy John')
        })
    })
  })

  describe('handlers:', function () {
    it('should process primitive types', function () {
      var quiz = new Kwiz(stub.centiQuiz)
      return quiz.start()
        .then((reply) => {
          return quiz.processMessage()
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage(12312312)
        })
        .then((reply) => {
          should.exist(reply.error)
          reply.error.should.be.true()
          return quiz.processMessage({})
        })
        .then((reply) => {
          should.exist(reply.error)
          reply.error.should.be.true()
          return quiz.processMessage('John')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage({})
        })
        .then((reply) => {
          should.exist(reply.error)
          reply.error.should.be.true()
          return quiz.processMessage('x33')
        })
        .then((reply) => {
          should.exist(reply.error)
          reply.error.should.be.true()
          return quiz.processMessage('33')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('sdsvdsv')
        })
        .then((reply) => {
          reply.message.should.be.equal('Yes or No, John :)')
          should.exist(reply.error)
          reply.error.should.be.true()
          return quiz.processMessage('yep')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          quiz.getState().answers.should.deepEqual({name: 'John', sure: 'yes', age: 33})
        })
    })

    it('should process custom types', function () {
      var quiz = new Kwiz(stub.customQuestionTypeQuiz)

      quiz.addHandler('speed', function (question, answer) {
        var matches = /(\d+) +mph/i.exec(answer)
        return matches ? Promise.resolve(parseInt(matches[1], 10)) : Promise.reject(question.hint || 'Wrong speed value')
      })
      return quiz.start()
        .then((reply) => {
          return quiz.processMessage('d')
        })
        .then((reply) => {
          should.exist(reply.error)
          return quiz.processMessage(12312312)
        })
        .then((reply) => {
          should.exist(reply.error)
          return quiz.processMessage('42 MpH')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          quiz.getState().answers.should.deepEqual({ca_speed_limit: 42})
        })
    })
  })

  describe('criteria:', function () {
    it('should process simple criteria', function () {
      var quiz = new Kwiz(stub.kiloQuiz)
      return quiz.start()
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('John')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('22')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('vine')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          quiz.getState().answers.should.deepEqual({name: 'John', age: 22, beverage: 'vine'})
        })
    })

    it('should process simple criteria again', function () {
      var quiz = new Kwiz(stub.kiloQuiz)
      return quiz.start()
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('John')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('15')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('Coke')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          quiz.getState().answers.should.deepEqual({name: 'John', age: 15, beverage: 'Coke'})
        })
    })
  })

  describe('groups:', function () {
    it('should works with groups', function () {
      var quiz = new Kwiz(stub.megaQuiz)
      return quiz.start()
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage()
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('John')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('18')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('Coke')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          quiz.getState().answers.should.deepEqual({name: 'John', age: 18, beverage: 'Coke'})
        })
    })

    it('should works with groups with criteria', function () {
      var quiz = new Kwiz(stub.megaQuiz)
      return quiz.start()
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage()
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('John')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('42')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('yes')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('Vine')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          quiz.getState().answers.should.deepEqual({name: 'John', age: 42, beverage: 'Vine', alcohol: 'yes'})
        })
    })

    it('should works with groups with criteria again', function () {
      var quiz = new Kwiz(stub.megaQuiz)
      return quiz.start()
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage()
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('John')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('42')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('Yep')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('Beer')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('IPA')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          return quiz.processMessage('noname')
        })
        .then((reply) => {
          should.not.exist(reply.error)
          quiz.getState().answers.should.deepEqual({name: 'John', age: 42, beverage: 'Beer', beer_kind: 'IPA', favorite_ipa: 'noname', alcohol: 'yes'})
        })
    })
  })
})
