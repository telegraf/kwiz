module.exports = {
  nanoQuiz: {
    questions: [{ message: 'Hey' }]
  },
  microQuiz: {
    questions: [{ message: 'Hey' }, { message: 'Bye' }]
  },
  milliQuiz: {
    questions: [
      { message: 'Hey' },
      { message: 'What is your name?', answer: { type: 'string', hint: 'Really?', id: 'name' } },
      { message: 'Bye {{answers.name}}' }
    ]
  },
  centiQuiz: {
    questions: [
      { message: 'Hey' },
      { message: 'What is your name?', answer: { type: 'string', id: 'name' } },
      { message: '{{answers.name}}, how old are you?', answer: { type: 'int', id: 'age' } },
      { message: '{{answers.name}}, are you sure?', answer: { type: 'truthy', hint: 'Yes or No, {{answers.name}} :)', id: 'sure' } },
      { message: 'Bye {{answers.name}}' }
    ]
  },
  kiloQuiz: {
    questions: [
      { message: 'What is your name?', answer: { type: 'string', id: 'name' } },
      { message: 'Got it!\n{{answers.name}}, how old are you?', answer: { type: 'int', id: 'age' } },
      { message: 'Coke or Pepsi?', answer: { type: 'choise', items: ['Coke', 'Pepsi'], id: 'beverage' }, criteria: { 'answers.age': { $lt: 21 } } },
      { message: 'Beer or Vine?', answer: { type: 'choise', items: ['Beer', 'Vine'], id: 'beverage' }, criteria: { 'answers.age': { $gte: 21 } } },
      { message: 'Bye {{answers.name}}' }
    ]
  },
  megaQuiz: {
    questions: [
      {
        questions: [
          { message: 'Hi there!', answer: { id: 'something' } }
        ]
      },
      { message: 'What is your name?', answer: { type: 'string', id: 'name' } },
      { message: 'Got it!\n{{answers.name}}, how old are you?', answer: { type: 'int', id: 'age' } },
      {
        criteria: { 'answers.age': { $lt: 21 } },
        questions: [
          { message: 'Coke or Pepsi?', answer: { type: 'choise', items: ['Coke', 'Pepsi'], id: 'beverage' } }
        ]
      },
      { message: 'Do you drink any alcohol?', answer: { type: 'truthy', id: 'alcohol' }, criteria: { 'answers.age': { $gte: 21 } } },
      {
        criteria: { 'answers.alcohol': 'yes' },
        questions: [
          { message: 'Beer or Vine?', answer: { type: 'choise', items: ['Beer', 'Vine'], id: 'beverage' } },
          {
            criteria: { 'answers.beverage': 'Beer' },
            questions: [
              { message: 'IPA or Stout?', answer: { type: 'choise', items: ['IPA', 'Stout'], id: 'beer_kind' } },
              { message: 'What is your favorite IPA?', answer: { type: 'string', id: 'favorite_ipa' }, criteria: { 'answers.beer_kind': 'IPA' } }]
          }
        ]
      },
      { message: 'Bye {{answers.name}}' }
    ]
  },
  semiInitalizedQuiz: {
    questions: [
      { message: '', answer: { type: 'int', hint: 'Really?', id: 'number' } },
      { message: 'Answer: {{answers.number}}' }
    ]
  },
  customQuestionTypeQuiz: {
    questions: [{ message: 'What is the speed limit in California?', answer: { id: 'ca_speed_limit', type: 'speed', hint: 'Use MPH' } }]
  }
}
