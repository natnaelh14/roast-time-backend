import * as dotenv from 'dotenv';
import express from 'express';
import router from './router';
import morgan from 'morgan';
import cors from 'cors';
import corsOptions from './config/corsOptions';

dotenv.config();
const app = express();

// Morgan is a middleware that logs requests
app.use(morgan('dev'));
// Cross Origin Resource Sharing
app.use(cors(corsOptions));
//It lets the app use json form the body of the request.
app.use(express.json());
// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(3009, () => {
  console.log('hello on http://localhost:3009');
});
