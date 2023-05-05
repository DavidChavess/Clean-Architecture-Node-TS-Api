import { accessTokenModelSchema, errorModelSchema, loginParamsSchema, surveyResultModelSchema, surveyResultParamsSchema } from './schemas/'

export default {
  accessToken: accessTokenModelSchema,
  loginParams: loginParamsSchema,
  error: errorModelSchema,
  surveyResultParamsSchema: surveyResultParamsSchema,
  surveyResultModelSchema: surveyResultModelSchema
}
