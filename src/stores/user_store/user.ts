export interface SRCUser {
  id: string;
  username: string;
  name: string;
  item_id: string;
  created_at: string;
  updated_at: string;
}

export class User {
  constructor(
    public id: string,
    public username: string,
    public itemId: string,
  ) {}

  static fromSRC(srcUser: SRCUser): User {
    return new User(
      srcUser.id,
      srcUser.username,
      srcUser.item_id,
    );
  }

  static fromSRCS(srcUsers: SRCUser[]): User[] {
    return srcUsers.map(User.fromSRC);
  }
}
