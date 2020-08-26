import { User, UserRef } from "../model/user";
import * as jwt from 'jsonwebtoken';

export class UserManager {

  // encode
  public generateNewAuthToken(user: User): string {
    // copy only relevant info we want encoded in the token.
    let payload: UserRef = {
      id: user.id,
      username: user.username,
    };

    let signed = jwt.sign(payload, 'RANDOM_TOKEN_SECRET', { expiresIn: '1 day' });
    return signed;
  }

  // decode
  public async getValidUserFromToken(token: string): Promise<User> {
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.id;
    // ensure the user id exists, and that it appears valid
    if (typeof userId != 'string' || userId.length == 0) {
      throw new Error('Failed to extract valid user from jwt');
    }
    // grab from database
    return {
      id: userId,
      username: 'asdf',
      passwordHash: 'alsdkf'
    }
  }

}
