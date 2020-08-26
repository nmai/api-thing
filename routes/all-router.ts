import express from 'express';
import { AuthMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/login/:username/:password', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/** Routes below require the JWT authorization token */

router.get('/parse/:url', AuthMiddleware, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/translate/:url', AuthMiddleware, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', AuthMiddleware, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/download/:identifier', AuthMiddleware, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export { router as allRouter }
