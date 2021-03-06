import jwt from 'jsonwebtoken';
import { Datastore } from '@google-cloud/datastore';
import { LoginResponse, User, UserRef } from "../model/user";
import { hash, compare } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { v1 as SecretManager } from '@google-cloud/secret-manager';

const secretManager = new SecretManager.SecretManagerServiceClient();
const datastore = new Datastore();

export class UserManager {

  private static _tokenSecret: string;

  /** returns JWT auth token upon successful validation of credentials */
  public static async loginWithCredentials(username: string, password: string): Promise<LoginResponse> {
    const user = await this.getUserByUsername(username);
    if (user == null)
      throw new Error('There are no users with that username');

    const isPasswordValid = await this.doesPasswordMatchHash(password, user.passwordHash);
    if (isPasswordValid == false)
      throw new Error('Incorrect password');

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      token: await this.generateNewAuthToken(user),
    }
  }

  /** was useful during testing, but currently not exposed on any endpoint */
  public static async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.getUserByUsername(username);
    if (existingUser)
      throw new Error('That username is taken')

    const user: User = {
      id: uuid(),
      username: username,
      passwordHash: await this.hashPassword(password),
    }
    const key = datastore.key(['user', user.id]);
    await datastore.insert({ key: key, data: user, excludeFromIndexes: ['passwordHash'] });
    return user;
  }

  public static async getUser(id: string): Promise<any> {
    const key = datastore.key(['user', id]);
    const res = await datastore.get(key);
    return res;
  }


  // decode
  public static async getValidUserFromToken(token: string): Promise<User> {
    const decodedToken = jwt.verify(token, await this.getTokenSecret());
    const userId = decodedToken.id;
    // ensure the user id exists, and that it appears valid
    if (typeof userId != 'string' || userId.length == 0) {
      throw new Error('Failed to extract valid user from jwt');
    }
    // grab from database
    const user = await this.getUser(userId);
    return user;
  }

  // encode
  private static async generateNewAuthToken(user: User): Promise<string> {
    // copy only relevant info we want encoded in the token.
    const payload: UserRef = {
      id: user.id,
      username: user.username,
    };

    const signed = jwt.sign(payload, await this.getTokenSecret(), { expiresIn: '1 day' });
    return signed;
  }

  // helpers

  private static async hashPassword(password: string): Promise<string> {
    // hash the password with an automatically generated salt of length 10
    return await hash(password, 10);
  }

  private static async doesPasswordMatchHash(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  private static async getUserByUsername(username: string): Promise<User | undefined> {
    const query = datastore.createQuery('user').filter('username', username);
    const results = await datastore.runQuery(query);
    return results[0]?.[0] as User;
  }

  /** caches the secret */
  private static async getTokenSecret(): Promise<string> {
    if (this._tokenSecret == null) {
      const [version] = await secretManager.accessSecretVersion({ name: 'projects/115643477901/secrets/token_secret/versions/1' });
      this._tokenSecret = version.payload.data.toString();
    }
    return this._tokenSecret;
  }

}
