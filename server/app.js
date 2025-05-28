import express from 'express';
import cookieParser from 'cookie-parser';
import sessions from 'express-session';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

import apiRouter from './routes/api/api.js'
import models from './models.js';

import dotenv from 'dotenv';
import WebAppAuthProvider from 'msal-node-wrapper';

dotenv.config();

const authConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        // redirectUri: "/redirect"
        redirectUri: "https://typesprint.ryancho.me/redirect"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
};

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ** AUTH **
// SESSION
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// Initialize MSAL
const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);

app.use(authProvider.authenticate());
app.use(authProvider.interactionErrorHandler());

// auth endpoints
app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next);
});

app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);
});
// ** END AUTH **

// API
app.use('/api', apiRouter);

// Models
app.use((req, res, next) => {
    req.models = models
    next();
});

// Serve static files from `public/` in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// PROXY
// app.use('/*', createProxyMiddleware({
//     // for windows
//     // target: 'http://127.0.0.1:4000',
//     target: 'http://localhost:4000',
//     pathRewrite: (path, req) => req.baseUrl,
//     changeOrigin: true,
//     ws: true
// }))

export default app;
