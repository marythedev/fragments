const request = require('supertest');
const hash = require('../../src/hash');     // for hashing email addresses
const fs = require('fs');
const path = require('path');

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

        await request(app).post('/v1/fragments').auth('user2@email.com', 'password2')
            .set('Content-Type', 'image/psd').send("This is a fragment").expect(415);

        await request(app).post('/v1/fragments').auth('user2@email.com', 'password2')
            .set('Content-Type', 'application/xml').send("This is a fragment").expect(415);
    });

    test('authenticated user can fragments of supported type', async () => {
        const res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");
        let body = JSON.parse(res.text);


        expect(res.statusCode).toBe(201);
        expect(body.status).toBe('ok');
        expect(typeof body.fragment).toBe("object");

        expect(body.fragment.id).toBeDefined();
        const hashed_email = hash("user1@email.com");
        expect(body.fragment.ownerId).toBe(hashed_email);
        expect(body.fragment.created).toBeDefined();
        expect(body.fragment.updated).toBeDefined();
        expect(body.fragment.type).toBe("text/plain");
        expect(body.fragment.size).toBe(18);

        const location = res.header['location'];
        const location_without_host = new URL(location).pathname;
        const expected_location_without_host = `/v1/fragments/${body.fragment.id}`;
        expect(location_without_host).toBe(expected_location_without_host);


        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html').send("<h1>This is a fragment</h1>").expect(201);

        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown').send("### This is a fragment").expect(201);

        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json').send('{"status": "testing"}').expect(201);

        let data = fs.readFileSync(path.join(__dirname, '../data', 'image.png'));
        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png').send(data).expect(201);

        data = fs.readFileSync(path.join(__dirname, '../data', 'image.jpg'));
        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/jpeg').send(data).expect(201);

        data = fs.readFileSync(path.join(__dirname, '../data', 'image.webp'));
        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/webp').send(data).expect(201);

        data = fs.readFileSync(path.join(__dirname, '../data', 'image.gif'));
        await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/gif').send(data).expect(201);
    });

});
