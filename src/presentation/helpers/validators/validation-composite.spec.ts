import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (input: any): Error | null {
    return null
  }
}

describe('Validation Composite', () => {
  let _validationStub: ValidationStub
  let _sut: ValidationComposite

  beforeEach(() => {
    _validationStub = new ValidationStub()
    _sut = new ValidationComposite([_validationStub])
  })

  test('Should return an error if any validation fails', () => {
    jest.spyOn(_validationStub, 'validate').mockReturnValueOnce(new MissingParamError('name'))
    expect(_sut.validate({ email: 'any_email' })).toEqual(new MissingParamError('name'))
  })
})
