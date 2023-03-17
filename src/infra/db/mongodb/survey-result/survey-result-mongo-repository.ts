import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from './survey-result-mongo-repository-protocols'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    const surveyResult = await surveyResultsCollection.findOneAndUpdate(
      {
        accountId: data.accountId,
        surveyId: data.surveyId
      },
      {
        $set: {
          answer: data.answer,
          date: data.date
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return surveyResult.value && MongoHelper.map(surveyResult.value)
  }
}
