const request = require('supertest');
const hash = require('../../src/hash');     // for hashing email addresses

const app = require('../../src/app');

describe('POST /v1/fragments', () => {

    test('unauthenticated requests are denied', async () =>
        await request(app).post('/v1/fragments')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment")
            .expect(401));

    test('incorrect credentials are denied', async () =>
        await request(app).post('/v1/fragments')
            .auth('invalid@email.com', 'incorrect_password')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment")
            .expect(401));

    test('authenticated user can\'t create fragment of unsupported type', async () => {
        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'invalid/type').send("This is a fragment").expect(415);

        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/text').send("This is a fragment").expect(415);

        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html').send("This is a fragment").expect(415);

        await request(app).post('/v1/fragments').auth('user2@email.com', 'password2')
            .set('Content-Type', 'image/jpg').send("This is a fragment").expect(415);

        await request(app).post('/v1/fragments').auth('user2@email.com', 'password2')
            .set('Content-Type', 'image/gif').send("This is a fragment").expect(415);
    });

    test('authenticated user can create text/plain fragment', async () => {
        const res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.fragment).toBe("object");

        expect(res.body.fragment.id).toBeDefined();
        const hashed_email = hash("user1@email.com");
        expect(res.body.fragment.ownerId).toBe(hashed_email);
        expect(res.body.fragment.created).toBeDefined();
        expect(res.body.fragment.updated).toBeDefined();
        expect(res.body.fragment.type).toBe("text/plain");
        expect(res.body.fragment.size).toBe(18);

        const location = res.header['location'];
        const location_without_host = new URL(location).pathname;
        const expected_location_without_host = `/v1/fragments/${res.body.fragment.id}`; 
        expect(location_without_host).toBe(expected_location_without_host);
    });

});
