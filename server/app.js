import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

app.use('/*', createProxyMiddleware({
    // for windows
    // target: 'http://127.0.0.1:4000',
    target: 'http://localhost:4000',
    pathRewrite: (path, req) => req.baseUrl,
    changeOrigin: true
}))

export default app;
