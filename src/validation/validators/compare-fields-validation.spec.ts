import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare Fields Validation', () => {
  test('Should return InvalidParamError if fieldName is not equal fieldNameToCompare', () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
    expect(sut.validate({ password: '123', passwordConfirmation: '321' })).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return null if fieldName is equal fieldNameToCompare', () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
    expect(sut.validate({ password: '123', passwordConfirmation: '123' })).toEqual(null)
  })
})
