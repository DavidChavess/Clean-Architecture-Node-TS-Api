const errorComponent = (description: string): any => ({
  description,
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
})

export const badRequestComponent = errorComponent('Requisição inválida')
export const forbiddenErrorComponent = errorComponent('Acesso negado')
export const serverErrorComponent = errorComponent('Problemas no servidor')
export const unauthorizedErrorComponent = errorComponent('Credenciais inválidas')
