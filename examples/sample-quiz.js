var debug = require('debug')('kwiz:example')
var readline = require('readline')
var Kwiz = require('../lib/kwiz')
var stub = require('../test/stub')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var askUser = function (question) {
  return new Promise(function (resolve, reject) {
    rl.question(question + ' ', function (userAnswer) {
      resolve(userAnswer)
    })
  })
}

var quiz = new Kwiz(stub.megaQuiz)
quiz.start()
  .then(function (engineReply) {
    askUser(engineReply.message)
      .then(function (userAnswer) {
        loop(userAnswer)
      })
  })

function loop (message) {
  quiz.processMessage(message)
    .then(function (engineReply) {
      if (engineReply.completed) {
        rl.close()
        return console.log(quiz.getState())
      }
      askUser(engineReply.message)
        .then(function (reply) {
          loop(reply)
        })
    })
}
