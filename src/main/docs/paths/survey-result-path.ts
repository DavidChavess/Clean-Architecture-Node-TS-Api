export const surveyResultPaths = {
  put: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey Result'],
    summary: 'API para responder uma enquete',
    description: 'Essa rota só pode ser acessada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'surveyId',
      description: 'id da enquete',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyResultParamsSchema'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'api',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultModelSchema'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorized'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
