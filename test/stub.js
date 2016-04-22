module.exports = {
  customQuestionTypeQuiz: {
    messages: [{message: 'What is the speed limit in California?', question: {id: 'ca_speed_limit', type: 'speed', hint: 'Use MPH'}}]
  },
  nanoQuiz: {
    messages: [{message: 'Hey'}]
  },
  microQuiz: {
    messages: [{message: 'Hey'}, {message: 'Buy'}]
  },
  milliQuiz: {
    messages: [
      {message: 'Hey'},
      {message: 'What is your name?', question: {type: 'string', hint: 'Really?', id: 'name'}},
      {message: 'Buy {{answers.name}}'}
    ]
  },
  centiQuiz: {
    messages: [
      {message: 'Hey'},
      {message: 'What is your name?', question: {type: 'string', id: 'name'}},
      {message: '{{answers.name}}, how old are you?', question: {type: 'int', id: 'age'}},
      {message: '{{answers.name}}, are you sure?', question: {type: 'chiose', items: ['Yes', 'No'], hint: 'Yes or No, {{answers.name}}', id: 'sure'}},
      {message: 'Buy {{answers.name}}'}
    ]
  },
  kiloQuiz: {
    messages: [
      {message: 'What is your name?', question: {type: 'string', id: 'name'}},
      {message: 'Got it!\n{{answers.name}}, how old are you?', question: {type: 'int', id: 'age'}},
      {message: 'Coke or Pepsi?', question: {type: 'chiose', items: ['Coke', 'Pepsi'], id: 'beverage'}, criteria: {'answers.age': {$lt: 21}}},
      {message: 'Beer or Vine?', question: {type: 'chiose', items: ['Beer', 'Vine'], id: 'beverage'}, criteria: {'answers.age': {$gte: 21}}},
      {message: 'Buy {{answers.name}}'}
    ]
  },
  megaQuiz: {
    messages: [
      {
        messages: [
          {message: 'Hi there!', question: {id: 'something'}}
        ]
      },
      {message: 'What is your name?', question: {type: 'string', id: 'name'}},
      {message: 'Got it!\n{{answers.name}}, how old are you?', question: {type: 'int', id: 'age'}},
      {
        criteria: {'answers.age': {$lt: 21}},
        messages: [
          {message: 'Coke or Pepsi?', question: {type: 'chiose', items: ['Coke', 'Pepsi'], id: 'beverage'}}
        ]
      },
      {
        criteria: {'answers.age': {$gte: 21}},
        messages: [
          {message: 'Beer or Vine?', question: {type: 'chiose', items: ['Beer', 'Vine'], id: 'beverage'}},
          {
            criteria: {'answers.beverage': 'Beer'},
            messages: [
              {message: 'IPA or Stout?', question: {type: 'chiose', items: ['IPA', 'Stout'], id: 'beer_kind'}},
              {message: 'What is your favorite IPA?', question: {type: 'string', id: 'favorite_ipa'}, criteria: {'answers.beer_kind': 'IPA'}}]
          }
        ]
      },
      {message: 'Buy {{answers.name}}'}
    ]
  }
}
