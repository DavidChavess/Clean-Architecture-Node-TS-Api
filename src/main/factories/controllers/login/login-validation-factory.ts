import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../presentation/helpers/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = ['email', 'password'].map(field => new RequiredFieldValidation(field))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
