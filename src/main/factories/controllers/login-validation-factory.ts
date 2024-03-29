import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = ['email', 'password'].map(field => new RequiredFieldValidation(field))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
