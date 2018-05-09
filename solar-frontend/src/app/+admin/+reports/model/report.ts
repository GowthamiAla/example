/**
 *This is model Template class to store Template details
 */

export class Report {
  constructor(
    public id: number,
    public name: string,
    public content: string,
    public role: UserRole[]
  ) { }
}

export class UserRole {
  constructor(
    public id: number,
    public name: string
  ) { }
}


