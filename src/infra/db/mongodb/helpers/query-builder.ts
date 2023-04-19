export class QueryBuilder {
  private readonly query: any[] = []

  match (matcher: any): QueryBuilder {
    return this.execute('match', matcher)
  }

  group (group: any): QueryBuilder {
    return this.execute('group', group)
  }

  unwind (obj: any): QueryBuilder {
    return this.execute('unwind', obj)
  }

  lookup (obj: any): QueryBuilder {
    return this.execute('lookup', obj)
  }

  addFields (fields: any): QueryBuilder {
    return this.execute('addFields', fields)
  }

  project (structure: any): QueryBuilder {
    return this.execute('project', structure)
  }

  execute (alias: string, config: any): QueryBuilder {
    const action = {
      [`$${alias}`]: config
    }
    this.query.push(action)
    return this
  }

  toQuery (): any[] {
    return this.query
  }
}
