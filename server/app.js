import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import sessions from 'express-session';
import logger from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import apiRouter from './routes/api/api.js'
import models from './models.js';
import enableWs from 'express-ws';
import dotenv from 'dotenv';
import WebAppAuthProvider from 'msal-node-wrapper';

dotenv.config();

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
enableWs(app);

let allSockets = [];

app.ws('/chatSocket', (ws) => {
    console.log("✅ Client connected");
    allSockets.push(ws);

    ws.on('message', (msg) => {
        console.log("📩 Received from client:", msg);
        allSockets.forEach(socket => {
            if (socket.readyState === 1) {
                socket.send("New message: " + msg);
            }
        });
    });

    ws.on('close', () => {
        console.log("❌ Client disconnected");
        allSockets = allSockets.filter(socket => socket !== ws);
    });
});

// let allSockets = [];

// app.ws('/chatSocket', (ws) => {
//     allSockets.push(ws);

//     ws.on('message', (msg) => {
//         console.log("Received from client:", msg); 
//         // Broadcast to all sockets
//         allSockets.forEach(socket => {
//             if (socket.readyState === 1) { // 1 = OPEN
//                 socket.send(msg);
//             }
//         });
//     });

//     ws.on('close', () => {
//         allSockets = allSockets.filter(socket => socket !== ws);
//     });
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// auth
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));
const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use('/api', apiRouter);

app.use((req, res, next) => {
    req.models = models
    next();
});

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/dashboard", // redirect here after login
    })(req, res, next);
});

app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);
});

app.use(authProvider.interactionErrorHandler());

app.use((req, res, next) => {
  if (req.path === '/chatSocket') {
    // Let the WebSocket handler take over
    return next();
  }
  // For all other paths, proxy the request
  createProxyMiddleware({
    target: 'http://127.0.0.1:4000',
    pathRewrite: (path) => path,  // or your actual rewrite logic
    changeOrigin: true,
    ws: true,
  })(req, res, next);
});

// app.use('/*', createProxyMiddleware({
//     // for windows
//     target: 'http://127.0.0.1:4000',
//     // target: 'http://localhost:4000',
//     pathRewrite: (path, req) => req.baseUrl,
//     changeOrigin: true,
//     ws: true,
// }))

export default app;
