import { makeSigunUpValidation } from './signup-validation-factory'
import { Validation } from '@/presentation/protocols/validation'
import { mockEmailValidator } from '@/validation/test'
import { EmailValidation, RequiredFieldValidation, ValidationComposite, CompareFieldsValidation } from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSigunUpValidation()
    const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirmation']
      .map(field => new RequiredFieldValidation(field))
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
