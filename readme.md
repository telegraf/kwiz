# kwiz
[![Build Status](https://img.shields.io/travis/telegraf/kwiz.svg?branch=master&style=flat-square)](https://travis-ci.org/telegraf/kwiz)
[![NPM Version](https://img.shields.io/npm/v/kwiz.svg?style=flat-square)](https://www.npmjs.com/package/kwiz)

Highly flexible JavaScript Quiz/Survey engine 

## Installation

```js
$ npm install kwiz
```

## Example
  
```js

const Kwiz = require('kwiz')

const quizDefinition = {
  questions: [
    { message: 'Hey' },
    { message: 'What is your name?', answer: {type: 'string', hint: 'Really?', id: 'name'} },
    { message: 'Buy {{answers.name}}' }
  ]
}

const quiz = new Kwiz(quizDefinition)
  quiz.start()
  .then((reply) => {
    return quiz.processMessage('John')
  })
  .then((reply) => {
    return quiz.processMessage()
  })
  .then((reply) => {
    console.log(quiz.getState())
  })
```

There are some other [examples](https://github.com/telegraf/kwiz/tree/master/examples).

## Api

* `Kwiz`
  * [`new Kwiz(quizDefinition ,[state], [handlers])`](#new)
  * [`.addHandler(type, handler)`](#add-handler)
  * [`.start()`](#start)
  * [`.isCompleted()`](#is-completed)
  * [`.processMessage(message)`](#process-message)

* * *

<a name="new"></a>
#### `Kwiz.new(quizDefinition, [state], [handlers])`

Initialize new quiz.

| Param | Type | Description |
| --- | --- | --- |
| quizDefinition | `Object` | [Quiz definition](#quiz-definition) |
| state | `Object` | Optional state |
| handlers | `Object` | Custom answer type handlers |

* * *

<a name="add-handler"></a>
#### `Kwiz.addHandler(type, handler)`

Add custom [type handler](#type-handlers).

| Param | Type | Description |
| --- | --- | --- |
| type | `String` |  [Answer type](#answer-types) |
| handler | `Function` | [Handler function](#type-handlers) |

* * *

<a name="start"></a>
#### `Kwiz.start() -> Promise`

Start quiz.

> Returns promise with [engine reply](#engine-reply).

* * *

<a name="is-completed"></a>
#### `Kwiz.isCompleted() -> Bool`

Checks for quiz complete.

* * *

<a name="process-message"></a>
#### `Kwiz.processMessage(message) -> Promise`

Process user reply.

> Returns promise with [engine reply](#engine-reply).

| Parameter | Type | Description |
| --- | --- | --- |
| message | `Any` | User reply |

<a name="quiz-definition"></a>
### Quiz definition

Quiz defiunition is plain object with array of questions.

```js
var quiz = {
  questions: [
    { message: 'Hey' },
    {
      message: 'What is your name?', 
      answer: {type: 'string', hint: 'Really?', id: 'name' }
    },
    { message: 'Wow', criteria: {'answers.age': {$lt: 21}}}
    { message: 'Buy {{answers.name}}'}
  ]
}
```

Question structure:

| Field | Type | Description |
| --- | --- | --- |
| message | 'String' | [Handlebars template](#handlebars) (must be empty for question groups) |
| answer | 'Object' | Answer options (Optional) |
| criteria | 'String' | [Criteria](#criteria) (Optional) |
| messages | 'Array' | Array of questons (Optional) |
| attachment | 'Any' | Question attachment (Optional) |

Answer options structure:

| Field | Type | Description |
| --- | --- | --- |
| id | 'String' | Answer id. Will used as key for store user answer |
| type | 'String' | [Answer type](#answer-types) |
| items | 'Array' | Items for  `choise` answer type. (Optional) |

There are some [examples](https://github.com/telegraf/kwiz/tree/master/test/stub.js).

<a name="criteria"></a>
### Criteria

mongodb-like query.

Supported Operators:

 * Array Operators (`$all`, `$elemMatch`, `$size`)
 * Comparisons Operators (`$gt`, `$gte`, `$lt`, `$lte`, `$ne`, `$nin`, `$in`)
 * Element Operators (`$exists`, `$type`)
 * Evaluation Operators (`$regex`, `$mod`, `$where`)
 * Logical Operators (`$and`, `$or`, `$nor`, `$not`)

For documentation on using query operators see [mongodb](http://docs.mongodb.org/manual/reference/operator/query/)

<a name="engine-reply"></a>
### Engine reply

Engine reply structure:

| Field | Type | Description |
| --- | --- | --- |
| message | 'String' | Engine message (Optional)  |
| error | 'Bool' | Error flag (Optional) |
| completed | 'Bool' | Is quiz completed (Optional)  |
| attachment | 'Any' | Question attachment (Optional) |

<a name="answer-types"></a>
### Answer types

Supported answer types:

* `text` - any non-empty string
* `int` - any integer value
* `choise` - list of predefined answers
* `truthy` - yes/no, yep/nope handler

<a name="type-handlers"></a>
### Custom answer type handlers

Answer type handler used for checking/converting user answer.

`function (question, answer) -> Promise `

| Parameter | Type | Description |
| --- | --- | --- |
| question | `Any` | Question definition |
| answer | `Any` | User answer |

The handler must reject promise when the type check failed otherwise will resolve with a message or anything you want.
This value will be stored in quiz state.

#### Example

```js
quiz.addHandler('speed', function (question, answer) {
  var matches = /(\d+) +mph/i.exec(answer)
  return matches 
    ? Promise.resolve(parseInt(matches[1], 10)) 
    : Promise.reject(question.hint || 'Wrong speed value')
})
```

## License

The MIT License (MIT)

Copyright (c) 2016 Vitaly Domnikov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

