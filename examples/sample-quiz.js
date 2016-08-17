const readline = require('readline')
const Kwiz = require('../lib/kwiz')
const { megaQuiz } = require('../test/stub')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Convert Promise
const askUser = (question) => {
  return new Promise((resolve, reject) => {
    rl.question((question || '') + ' ', (userAnswer) => {
      resolve(userAnswer)
    })
  })
}

// Quiz init
const quiz = new Kwiz(megaQuiz)

// Start
quiz.start()
  .then((message) => {
    loop(message.message)
  })

function loop (question) {
  askUser(question)
    .then((reply) => {
      if (reply === '/state') {
        console.log(quiz.getState())
        return loop()
      }
      if (reply === '/quit') {
        rl.close()
        return console.log(quiz.getState())
      }
      quiz.processMessage(reply)
        .then((question) => {
          loop(question.message)
        })
        .catch((e) => {
          console.log(e)
        })
    })
}
