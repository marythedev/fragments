const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments:id/info', () => {
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', async () => {

        // Create a fragment(from authorized user)
        const res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");
        let body = JSON.parse(res.text);

        // Try to get the existing fragment's metadata without authorization
        await request(app).get(`/v1/fragments${body.fragment.id}/info`).expect(401);

        // Try to get a non-existing fragment without authorization
        await request(app).get(`/v1/fragments123/info`).expect(401);
    });

    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', async () => {

        // Create a fragment(from authorized user with correct credentials)
        const res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");
        let body = JSON.parse(res.text);

        // Try to get the existing fragment's metadata with incorrect credentials
        await request(app).get(`/v1/fragments${body.fragment.id}/info`)
            .auth('invalid@email.com', 'incorrect_password').expect(401);

        // Try to get a non-existing fragment with incorrect credentials
        await request(app).get(`/v1/fragments123/info`)
            .auth('invalid@email.com', 'incorrect_password').expect(401);
    });

    // Using a valid username/password pair should but looking for inexistant fragment should give a 404
    test('authenticated user cannot see metadata of fragment that does not exist', async () => {

        await request(app).get(`/v1/fragments/1234/info`)
            .auth('user1@email.com', 'password1').expect(404);
    });

    // Using a valid username/password pair should give a success result with a fragment's metadata
    test('authenticated user can see metadata of fragment that exists', async () => {

        // Create and test a fragment of type text/plain 
        let res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");
        let body = JSON.parse(res.text);

        let fragment_by_id = await request(app).get(`/v1/fragments/${body.fragment.id}/info`)
            .auth('user1@email.com', 'password1');

        expect(fragment_by_id.text).toContain(body.fragment.type);
        expect(fragment_by_id.text).toContain(body.fragment.size.toString());
    });
});
