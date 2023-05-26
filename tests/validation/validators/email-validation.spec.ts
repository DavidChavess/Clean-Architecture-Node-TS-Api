import { EmailValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/tests/domain/mocks'
import { mockEmailValidator } from '@/tests/validation/mocks'
import { EmailValidator } from '@/validation/protocols'

describe('Email Validation', () => {
  let _sut: EmailValidation
  let _emailValidatorStub: EmailValidator

  beforeEach(() => {
    _emailValidatorStub = mockEmailValidator()
    _sut = new EmailValidation('email', _emailValidatorStub)
  })

  test('Should return an InvalidParamError if an invalid email is provided', () => {
    jest.spyOn(_emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const validateResponse = _sut.validate({ email: 'any_email' })
    expect(validateResponse).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const isValidSpy = jest.spyOn(_emailValidatorStub, 'isValid')
    _sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if EmailValidator thorws', () => {
    jest.spyOn(_emailValidatorStub, 'isValid').mockImplementationOnce(throwError)
    expect(() => _sut.validate({ email: 'any_email@mail.com' })).toThrow()
  })
})
