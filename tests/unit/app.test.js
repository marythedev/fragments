const request = require('supertest');

const app = require('../../src/app');

describe('/ 404error', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/invalid_route');
    expect(res.statusCode).toBe(404);
  });
});
