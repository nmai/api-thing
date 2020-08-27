import express from 'express';
import { ParseManager } from '../lib/parse-manager';
import { AuthMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/login/:username/:password', async (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/** Routes below require the JWT authorization token */

router.get('/parse/:url', AuthMiddleware, async (req, res, next) => {
  const parsedUrl = decodeURIComponent(req.params['url']);
  const data = await ParseManager.parseFromUrl(parsedUrl);
  // res.render('index', { title: data });
  res.send(data);
});

router.get('/translate/:url', AuthMiddleware, async (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/upload', AuthMiddleware, async (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/download/:identifier', AuthMiddleware, async (req, res, next) => {
  res.render('index', { title: 'Express' });
});

export { router as allRouter }
