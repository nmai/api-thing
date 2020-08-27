import express from 'express';
import { FileManager } from '../lib/file-manager';
import { ParseManager } from '../lib/parse-manager';
import { TranslateManager } from '../lib/translate-manager';
import { AuthMiddleware } from '../middleware/auth';
import { uploader } from '../lib/uploader';

const router = express.Router();

router.post('/login/:username/:password', async (req, res, next) => {
  res.render('index', { title: 'Express' });
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

/** looks for the file under the 'file' field of form data. */
router.post('/upload', AuthMiddleware, uploader.single('file'), async (req, res, next) => {
  try {
    const data = await FileManager.processUpload(req.file);
    res.send(data);
  } catch(e) {
    next(e);
  }
});

router.get('/download/:identifier', AuthMiddleware, async (req, res, next) => {
  try {
    
  } catch(e) {
    next(e);
  }
});

export { router as allRouter }
