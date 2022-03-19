import { Result } from '../../libs/result.js';

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

  static fromSRC(srcUser: SRCUser) {
    return new User(
      srcUser.id,
      srcUser.username,
      srcUser.item_id,
    );
  }

  static resFromSRC(srcUser: SRCUser) {
    return Result.success(User.fromSRC(srcUser));
  }

  static resFromSRCList(srcUsers: SRCUser[]) {
    return Result.success(srcUsers.map(User.fromSRC));
  }
}
