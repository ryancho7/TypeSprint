import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import apiRouter from './routes/api/api.js'
import models from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter)

app.use((req, res, next) => {
    req.models = models
    next();
})

app.use('/*', createProxyMiddleware({
    // for windows
    // target: 'http://127.0.0.1:4000',
    target: 'http://localhost:4000',
    pathRewrite: (path, req) => req.baseUrl,
    changeOrigin: true
}))

export default app;
