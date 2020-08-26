import jwt from 'jsonwebtoken';
import { Datastore } from '@google-cloud/datastore';
import { User, UserRef } from "../model/user";
import { entity } from '@google-cloud/datastore/build/src/entity';

const datastore = new Datastore();

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

  // proof of concept
  // datastore is pretty weak compared to firestore but lets just stick with it, we dont need anything advanced
  public async getUser(id: string): Promise<any> {
    let key = datastore.key(['user', id]);
    let res = await datastore.get(key);
    return res;
  }

}

/**
 * @todo tomorrow:
 * 
 * Switch user.id to user.key or user.path, maybe take it off the model entirely.
 * UserRef will still need some identifier though, as that will be embedded in tokens,
 * and we don't want to be basing the system on the username.
 */
