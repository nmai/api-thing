import { UserManager } from '../lib/user-manager';

export async function AuthMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await UserManager.getValidUserFromToken(token);
    req.user = user;
    next();
  } catch(e) {
    res.status(403)
    next(new Error('Authentication failed'));
  }
};
