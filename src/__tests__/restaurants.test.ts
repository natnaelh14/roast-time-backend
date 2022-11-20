import app from '../app';
import request from 'supertest';

describe('GET /retaurants', () => {
  test('should return a 200 success', async () => {
    const response = await request(app).get('/restaurants');
    expect(response.statusCode).toBe(200);
  });
});
