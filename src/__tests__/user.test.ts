import app from '../app';
import request from 'supertest';

describe('Validate user', () => {
  // eslint-disable-next-line jest/expect-expect
  test('validate email and return a boolean', async () => {
    const response = await request(app)
      .get('/validate/email')
      .send({ email: 'test@test.com' })
      .set('Accept', 'application/json')
      .expect(200);
    expect(response.body.isValid).toBe(true);
  });
});

describe('validate phone number', () => {
  // eslint-disable-next-line jest/expect-expect
  test('validate phoneNumber and return a boolean', async () => {
    const response = await request(app)
      .get('/validate/phonenumber')
      .send({ phoneNumber: '0000000000' })
      .set('Accept', 'application/json')
      .expect(200);
    expect(response.body.isValid).toBe(true);
  });
});
