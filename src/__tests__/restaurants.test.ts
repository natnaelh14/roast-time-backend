import request from 'supertest';
import app from '../app';

describe('GET /retaurants', () => {
  test('should return a 200 success', async () => {
    const response = await request(app).get('/restaurants');
    expect(response.statusCode).toBe(200);
  });
});
