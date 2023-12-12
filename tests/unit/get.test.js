const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // tests to check the contents of the fragments array
  test('authenticated user can see created text/plain fragments\' ids', async () => {
    const post_res = await request(app).post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send("This is a fragment");
    let post_body = JSON.parse(post_res.text);

    const get_res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    let get_body = JSON.parse(get_res.text);

    expect(get_body.fragments[0]).toBe(post_body.fragment.id);
  });
});
