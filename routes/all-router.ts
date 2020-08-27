import express from 'express';
import { FileManager, uploader } from '../lib/file-manager';
import { ParseManager } from '../lib/parse-manager';
import { TranslateManager } from '../lib/translate-manager';
import { UserManager } from '../lib/user-manager';
import { AuthMiddleware } from '../middleware/auth';
import { UploadResponse } from '../model/file';
import { User, UserRef } from '../model/user';

const router = express.Router();

/**
 * Create a new user account. Returns some basic info about the newly created user, but no token.
 */
router.post('/register/:username/:password', async (req, res, next) => {
  try {
    const user: User = await UserManager.createUser(req.params['username'], req.params['password']);
    const ref: UserRef = { id: user.id, username: user.username };
    res.send(ref);
  } catch(e) {
    next(e);
  }
});

/**
 * Returns some basic info about the user, and a JWT which can be used in a bearer token.
 */
router.post('/login/:username/:password', async (req, res, next) => {
  try {
    const data = await UserManager.loginWithCredentials(req.params['username'], req.params['password']);
    res.send(data);
  } catch(e) {
    next(e);
  }
});

/** Routes below require the JWT authorization token */

router.get('/parse/:url', AuthMiddleware, async (req, res, next) => {
  try {
    const parsedUrl = decodeURIComponent(req.params['url']);
    const data = await ParseManager.parseFromUrl(parsedUrl);
    res.send(data);
  } catch(e) {
    next(e);
  }
});

router.get('/translate/:url', AuthMiddleware, async (req, res, next) => {
  try {
    const parsedUrl = decodeURIComponent(req.params['url']);
    const data = await TranslateManager.translateFromUrl(parsedUrl);
    res.send(data);
  } catch(e) {
    next(e);
  }
});

/**
 * Looks for the file under the 'file' field of form data. 
 * The returned identifier includes original file extension, but it's not the
 * original filename - all uploads are uniquely saved.
*/
router.post('/upload', AuthMiddleware, uploader.single('file'), async (req, res, next) => {
  try {
    const identifier = await FileManager.processUpload(req.file);
    const response: UploadResponse = {
      identifier: identifier,
    }
    res.send(response);
  } catch(e) {
    next(e);
  }
});

router.get('/download/:identifier', AuthMiddleware, async (req, res, next) => {
  try {
    const identifier = req.params['identifier'];
    res.attachment(identifier);
    const stream = await FileManager.getFilestream(identifier);
    stream.pipe(res);
  } catch(e) {
    next(e);
  }
});

export { router as allRouter }
