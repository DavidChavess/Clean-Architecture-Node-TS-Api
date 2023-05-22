export const surveyResultModelSchema = {
  type: 'object',
  properties: {
    surveyId: { type: 'string' },
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          answer: {
            type: 'string'
          },
          image: {
            type: 'string'
          },
          count: {
            type: 'number'
          },
          percent: {
            type: 'number'
          },
          isCurrentAccountAnswer: {
            type: 'boolean'
          }
        },
        required: ['answer', 'count', 'percent', 'isCurrentAccountAnswer']
      }
    },
    date: { type: 'string' }
  },
  required: ['surveyId', 'question', 'answers', 'date']
}
