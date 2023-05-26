import { makeLoginValidation } from '@/main/factories/controllers'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { mockEmailValidator } from '@/tests/validation/mocks'
import { Validation } from '@/presentation/protocols'

jest.mock('@/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = ['email', 'password'].map(field => new RequiredFieldValidation(field))
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
