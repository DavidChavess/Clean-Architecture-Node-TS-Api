import { CompareFieldsValidation, RequiredFieldValidation, EmailValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators'

export const makeSigunUpValidation = (): Validation => {
  const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirmation']
    .map(field => new RequiredFieldValidation(field))
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
