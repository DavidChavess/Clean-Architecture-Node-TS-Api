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
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultModelSchema'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequestErrorComponent'
      },
      401: {
        $ref: '#/components/unauthorizedErrorComponent'
      },
      403: {
        $ref: '#/components/forbiddenErrorComponent'
      },
      500: {
        $ref: '#/components/serverErrorComponent'
      }
    }
  },
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey Result'],
    summary: 'API para buscar repostas de uma enquete',
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
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultModelSchema'
            }
          }
        }
      },
      401: {
        $ref: '#/components/unauthorizedErrorComponent'
      },
      403: {
        $ref: '#/components/forbiddenErrorComponent'
      },
      500: {
        $ref: '#/components/serverErrorComponent'
      }
    }
  }
}
