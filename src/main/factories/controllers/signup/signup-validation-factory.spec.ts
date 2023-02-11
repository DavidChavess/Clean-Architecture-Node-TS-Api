import { CompareFieldsValidation, RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../../validation/validators'
import { makeSigunUpValidation } from './signup-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../validation/protocols/email-validator'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

jest.mock('../../../../validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSigunUpValidation()
    const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirmation']
      .map(field => new RequiredFieldValidation(field))
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
