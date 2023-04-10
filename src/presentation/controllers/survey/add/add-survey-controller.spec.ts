import { AddSurvey, AddSurveyParams, Validation, HttpRequest } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

class ValidationStub implements Validation {
  validate (input: string): Error | null {
    return null
  }
}

class AddSurveyStub implements AddSurvey {
  async add (data: AddSurveyParams): Promise<void> {
    return Promise.resolve()
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
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

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.set(new Date())
  })

  test('Should call Validation with correct values', async () => {
    const spyAuthentication = jest.spyOn(_validationStub, 'validate')
    await _sut.handle(makeHttpRequest())
    expect(spyAuthentication).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('Should return 400 if Validation return an error', async () => {
    jest.spyOn(_validationStub, 'validate').mockReturnValueOnce(new MissingParamError('question'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('question')))
  })

  test('Should call AddSurvey with correct values', async () => {
    const spyAddSurvey = jest.spyOn(_addSurveyStub, 'add')
    await _sut.handle(makeHttpRequest())
    expect(spyAddSurvey).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    jest.spyOn(_addSurveyStub, 'add').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should return 204 on success', async () => {
    const httpResponse = await _sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
