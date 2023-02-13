import { AddSurvey, AddSurveyModel, HttpRequest } from './add-survey-protocols'
import { Validation } from '../../../protocols/validation'
import { AddSurveyController } from './add-survey-controller'
import { MissingParamError } from '../../../errors'
import { badRequest, serverError } from '../../../helpers/http/http-helper'

class ValidationStub implements Validation {
  validate (input: string): Error | null {
    return null
  }
}

class AddSurveyStub implements AddSurvey {
  async add (data: AddSurveyModel): Promise<void> {
    return Promise.resolve()
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

describe('AddSurvey Controller', () => {
  let _sut: AddSurveyController
  let _validationStub: ValidationStub
  let _addSurveyStub: AddSurveyStub

  beforeEach(() => {
    _validationStub = new ValidationStub()
    _addSurveyStub = new AddSurveyStub()
    _sut = new AddSurveyController(_validationStub, _addSurveyStub)
  })

  test('Should call Validation with correct values', async () => {
    const spyAuthentication = jest.spyOn(_validationStub, 'validate')
    await _sut.handle(makeHttpRequest())
    expect(spyAuthentication).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('Should return badRequest if Validation return an error', async () => {
    jest.spyOn(_validationStub, 'validate').mockReturnValueOnce(new MissingParamError('question'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('question')))
  })

  test('Should call AddSurvey with correct values', async () => {
    const spyAddSurvey = jest.spyOn(_addSurveyStub, 'add')
    await _sut.handle(makeHttpRequest())
    expect(spyAddSurvey).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('Should return serverError if AddSurvey throws', async () => {
    jest.spyOn(_addSurveyStub, 'add').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })
})
