export const loginPaths = {
  post: {
    tags: ['Login'],
    summary: 'API para autenticar usuários',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
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
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        description: 'Bad-request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/error'
            }
          }
        }
      }
    }
  }
}
