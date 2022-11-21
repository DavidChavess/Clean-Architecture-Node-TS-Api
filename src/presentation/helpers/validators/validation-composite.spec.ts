import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (input: any): Error | null {
    return null
  }
}

describe('Validation Composite', () => {
  let _validationStubs: ValidationStub[]
  let _sut: ValidationComposite

  beforeEach(() => {
    _validationStubs = [new ValidationStub(), new ValidationStub()]
    _sut = new ValidationComposite(_validationStubs)
  })

  test('Should return an error if any validation fails', () => {
    jest.spyOn(_validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('name'))
    expect(_sut.validate({ email: 'any_email' })).toEqual(new MissingParamError('name'))
  })

  test('Should return the first error if more than one validation fails', () => {
    jest.spyOn(_validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(_validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('name'))
    expect(_sut.validate({ email: 'any_email' })).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    expect(_sut.validate({ email: 'any_email' })).toBeFalsy()
  })
})
