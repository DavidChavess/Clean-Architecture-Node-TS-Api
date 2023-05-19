export const loginPaths = {
  post: {
    tags: ['Login'],
    summary: 'API para autenticar usuários',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParamsSchema'
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
              $ref: '#/schemas/accountModelSchema'
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
