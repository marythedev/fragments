const request = require('supertest');
const fs = require('fs');
const path = require('path');

const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {

    test('unauthenticated requests are denied', async () =>
        await request(app).delete('/v1/fragments/123').expect(401));

    test('incorrect credentials are denied', async () =>
        await request(app).delete('/v1/fragments/123')
            .auth('invalid@email.com', 'incorrect_password')
            .expect(401));

    test('authenticated user cannot delete fragment that does not exist', async () =>
        await request(app).delete('/v1/fragments/123')
            .auth('user1@email.com', 'password1')
            .expect(404));

    test('authenticated user can delete fragment of that exists of all of the supported types', async () => {
        let res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain').send("This is a fragment");
        let body = JSON.parse(res.text);
        await request(app).delete(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1').expect(200);

        res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html').send("<h1>This is a fragment</h1>");
        body = JSON.parse(res.text);
        await request(app).delete(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1').expect(200);

        res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown').send("### This is a fragment");
        body = JSON.parse(res.text);
        await request(app).delete(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1').expect(200);

        res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json').send('{"status": "testing"}');
        await request(app).delete(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1').expect(200);

        let data = fs.readFileSync(path.join(__dirname, '../data', 'image.png'));
        res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/png').send(data);
        let location = res.headers.location;
        let url = location.match(/fragments\/([\w-]+)/)[0];
        await request(app).delete(`/v1/${url}`)
            .auth('user1@email.com', 'password1').expect(200);

        data = fs.readFileSync(path.join(__dirname, '../data', 'image.jpg'));
        res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/jpeg').send(data);
        location = res.headers.location;
        url = location.match(/fragments\/([\w-]+)/)[0];
        await request(app).delete(`/v1/${url}`)
            .auth('user1@email.com', 'password1').expect(200);

        data = fs.readFileSync(path.join(__dirname, '../data', 'image.webp'));
        res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/webp').send(data);
        location = res.headers.location;
        url = location.match(/fragments\/([\w-]+)/)[0];
        await request(app).delete(`/v1/${url}`)
            .auth('user1@email.com', 'password1').expect(200);

        data = fs.readFileSync(path.join(__dirname, '../data', 'image.gif'));
        res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1')
            .set('Content-Type', 'image/gif').send(data);
        location = res.headers.location;
        url = location.match(/fragments\/([\w-]+)/)[0];
        await request(app).delete(`/v1/${url}`)
            .auth('user1@email.com', 'password1').expect(200);

    });

});
