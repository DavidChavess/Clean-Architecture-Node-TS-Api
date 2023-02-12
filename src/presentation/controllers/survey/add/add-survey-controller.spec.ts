import { HttpRequest } from './add-survey-protocols'
import { Validation } from '../../../protocols/validation'
import { AddSurveyController } from './add-survey-controller'

class ValidationStub implements Validation {
  validate (input: string): Error | null {
    return null
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      asnwer: 'any_answer'
    }]
  }
})

describe('AddSurvey Controller', () => {
  let _sut: AddSurveyController
  let _validationStub: Validation

  beforeEach(() => {
    _validationStub = new ValidationStub()
    _sut = new AddSurveyController(_validationStub)
  })

  test('Should call Validation with correct values', async () => {
    const spyAuthentication = jest.spyOn(_validationStub, 'validate')
    await _sut.handle(makeHttpRequest())
    expect(spyAuthentication).toHaveBeenCalledWith(makeHttpRequest().body)
  })
})
