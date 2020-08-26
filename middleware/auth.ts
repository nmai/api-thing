import { UserManager } from '../lib/user-manager';
const userManager = new UserManager();

export async function AuthMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await userManager.getValidUserFromToken(token);
    req.user = user;
    next();
  } catch(e) {
    res.status(403).json({
      error: new Error('Authentication failed')
    });
  }
};
