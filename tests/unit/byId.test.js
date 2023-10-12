const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments:id', () => {
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', async () => {

        // Create a fragment(from authroized user)
        const res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");

        // Try to get the existing fragment without authorization
        await request(app).get(`/v1/fragments${res.body.fragment.id}`).expect(401);

        // Try to get a non-existing fragment without authorization
        await request(app).get(`/v1/fragments123`).expect(401);
    });

    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', async () => {

        // Create a fragment(from authroized user with correct credentials)
        const res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");

        // Try to get the existing fragment with incorrect credentials
        await request(app).get(`/v1/fragments${res.body.fragment.id}`)
            .auth('invalid@email.com', 'incorrect_password').expect(401);

        // Try to get a non-existing fragment with incorrect credentials
        await request(app).get(`/v1/fragments123`)
            .auth('invalid@email.com', 'incorrect_password').expect(401);
    });

    // Using a valid username/password pair should give a success result with a fragment's data
    test('authenticated user can see created text/plain fragment data by id', async () => {

        // Create a fragment
        const res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");

        const fragment_by_id = await request(app).get(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1');

        expect(fragment_by_id.header['content-type']).toBe(res.body.fragment.type);
        expect(fragment_by_id.header['content-length']).toBe(res.body.fragment.size.toString());
        expect(fragment_by_id.text).toBe("This is a fragment");
    });

    // Using a valid username/password pair should give a error if seeking a non-existing fragment
    test('authenticated user gets 404 error if fragment doesn\'t exist', async () => {

        await request(app).get(`/v1/fragments/1234567890`)
            .auth('user1@email.com', 'password1').expect(404);

        // Create some additional fragment
        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain').send("This is a fragment");

        await request(app).get(`/v1/fragments/1234567890`)
            .auth('user1@email.com', 'password1').expect(404);
    });
});
