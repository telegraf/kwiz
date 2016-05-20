var readline = require('readline')
var Kwiz = require('../lib/kwiz')
var stub = require('../test/stub')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Convert Promise
var askUser = function (question) {
  return new Promise(function (resolve, reject) {
    rl.question((question || '') + ' ', function (userAnswer) {
      resolve(userAnswer)
    })
  })
}

// Quiz init
var quiz = new Kwiz(stub.megaQuiz)

// Start
quiz.start().then(function (message) {
  loop(message.message)
})

function loop (question) {
  askUser(question)
    .then(function (reply) {
      if (reply === '/state') {
        console.log(quiz.getState())
        return loop()
      }
      if (reply === '/quit') {
        rl.close()
        return console.log(quiz.getState())
      }
      quiz.processMessage(reply)
        .then(function (question) {
          loop(question.message)
        })
        .catch(function (e) {
          console.log(e)
        })
    })
}
