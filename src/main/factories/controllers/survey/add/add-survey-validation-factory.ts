import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = ['question', 'answers'].map(field => new RequiredFieldValidation(field))
  return new ValidationComposite(validations)
}
