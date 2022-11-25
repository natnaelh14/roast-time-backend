import app from '../app';
import request from 'supertest';

describe('GET all restaurants', () => {
  // eslint-disable-next-line jest/expect-expect
  test('should return a 200 success', async () => {
    await request(app).get('/restaurants').expect(200);
  });
});

describe('GET single restaurant', () => {
  // eslint-disable-next-line jest/expect-expect
  test('should return a 200 success', async () => {
    await request(app)
      .get('/search/restaurant/401ec1d7-e447-436a-b7ce-34e63ed262e5')
      .expect(200);
  });
});
