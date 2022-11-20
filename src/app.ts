import router from './router';
import { corsOptions } from './config/corsOptions';
import { errorHandler } from './middleware/errorHandler';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Morgan is a middleware that logs requests
app.use(morgan('dev'));

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// It lets the app use json form the body of the request.
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use(errorHandler);

export default app;
