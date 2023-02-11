import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('Should return MissingParamError if invalid field are provided', () => {
    const sut = new RequiredFieldValidation('name')
    expect(sut.validate({ email: 'any_email' })).toEqual(new MissingParamError('name'))
  })

  test('Should return null valid field are provided', () => {
    const sut = new RequiredFieldValidation('name')
    expect(sut.validate({ name: 'any_name' })).toEqual(null)
  })
})
