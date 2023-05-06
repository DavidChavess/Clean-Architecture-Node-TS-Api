export class QueryBuilder {
  private readonly query: object[] = []

  match (matcher: object): QueryBuilder {
    this.query.push({ $match: matcher })
    return this
  }

  group (group: object): QueryBuilder {
    this.query.push({ $group: group })
    return this
  }

  unwind (obj: object): QueryBuilder {
    this.query.push({ $unwind: obj })
    return this
  }

  lookup (obj: object): QueryBuilder {
    this.query.push({ $lookup: obj })
    return this
  }

  project (structure: object): QueryBuilder {
    this.query.push({ $project: structure })
    return this
  }

  sort (data: object): QueryBuilder {
    this.query.push({ $sort: data })
    return this
  }

  toQuery (): object[] {
    return this.query
  }
}
