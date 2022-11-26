import app from '../app';
import request from 'supertest';

describe('Validate user', () => {
  // eslint-disable-next-line jest/expect-expect
  test('validate email and return a boolean', async () => {
    const response = await request(app)
      .get('/v1/validate/email')
      .send({ email: 'test@test.com' })
      .set('Accept', 'application/json')
      .expect(200);
    expect(response.body.isValid).toBe(true);
  });
  // eslint-disable-next-line jest/expect-expect
  test('validate phoneNumber and return a boolean', async () => {
    const response = await request(app)
      .get('/v1/validate/phonenumber')
      .send({ phoneNumber: '0000000000' })
      .set('Accept', 'application/json')
      .expect(200);
    expect(response.body.isValid).toBe(true);
  });

  test('should catch incorrect login credentials.', async () => {
    const response = await request(app)
      .post('/v1/login')
      .send({ email: 'test@test.com', password: '00000000000' })
      .set('Accept', 'application/json')
      .expect(401);
    expect(response.body).toStrictEqual({
      message: 'Unable to find account with the given email',
    });
  });
});
