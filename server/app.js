import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import sessions from 'express-session';
import logger from 'morgan';

import apiRouter from './routes/api/api.js'
import models from './models.js';

import dotenv from 'dotenv';
import WebAppAuthProvider from 'msal-node-wrapper';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const authConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        redirectUri: "/redirect"
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
        postLoginRedirectUri: "/",
    })(req, res, next);
});

app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/",
    })(req, res, next);
});
// ** END AUTH **

// Session middleware
app.use((req, res, next) => {
    const acct = req.authContext?.account?.idTokenClaims;
    
    if (acct && !req.session.isAuthenticated) {
        req.session.isAuthenticated = true;
        req.session.account = {
            email: acct.preferred_username || acct.email, 
            username: acct.name,
            name: acct.name,
        };
        
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
            }
            next();
        });
    } else {
        next();
    }
});

// Models
app.use((req, res, next) => {
    req.models = models
    next();
});

// API
app.use('/api', apiRouter);

// Deployment
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));
app.get('/*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

export default app;