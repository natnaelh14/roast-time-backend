import * as dotenv from 'dotenv';
import express from 'express';
import router from './router';
import morgan from 'morgan';

dotenv.config();
const app = express();

// * morgan is a middleware that logs requests
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(3009, () => {
  console.log('hello on http://localhost:3009');
});
