export const unauthorizedErrorComponent = {
  description: 'Credenciais inválidas',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
