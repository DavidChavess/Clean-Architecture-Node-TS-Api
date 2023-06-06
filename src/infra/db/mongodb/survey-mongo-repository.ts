import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder } from '@/infra/db'
import { LoadSurveyByIdRepository, AddSurveyRepository, LoadSurveysRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyIdRepository } from '@/data/protocols/db'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository,
  LoadSurveyByIdRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyIdRepository {

  async add (survey: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)]
                  }
                }
              }
            },
            1
          ]
        }
      })
      .toQuery()

    const surveys = await surveyCollection.aggregate(query).toArray()
    return surveys.map(value => MongoHelper.map(value))
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1 } })
    return survey !== null
  }

  async loadAnswersBySurveyId (id: string): Promise<LoadAnswersBySurveyIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        answers: '$answers.answer'
      })
      .toQuery()
    const survey = await surveyCollection.aggregate(query).toArray()
    return survey[0]?.answers || []
  }
}
