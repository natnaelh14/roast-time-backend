import * as dotenv from 'dotenv';
import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';
import { errorHandler } from './middleware/errorHandler';
const PORT = process.env.PORT || 3009;
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// Morgan is a middleware that logs requests
app.use(morgan('dev'));

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

//It lets the app use json form the body of the request.
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
