import { Validation, HttpRequest, AddSurvey } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { mockAddSurveyParams } from '@/domain/test'
import { mockValidation } from '@/validation/test'
import { mockAddSurvey } from '@/presentation/test'

const makeHttpRequest = (): HttpRequest => ({
  body: mockAddSurveyParams()
})

describe('AddSurvey Controller', () => {
  let _sut: AddSurveyController
  let _validationStub: Validation
  let _addSurveyStub: AddSurvey

  beforeEach(() => {
    _validationStub = mockValidation()
    _addSurveyStub = mockAddSurvey()
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
