const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {

    test('unauthenticated requests are denied', async () =>
        await request(app).put('/v1/fragments/123')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a new fragment</h1>")
            .expect(401));

    test('incorrect credentials are denied', async () =>
        await request(app).put('/v1/fragments/123')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a new fragment</h1>")
            .expect(401));

    test('authenticated user cannot update fragment that does not exist', async () =>
        await request(app).put(`/v1/fragments/123`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a new fragment</h1>")
            .expect(404));

    test('authenticated user can update fragment of that exists with the same supported type', async () => {
        let res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");
        let body = JSON.parse(res.text);

        res = await request(app).put(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a new fragment").expect(200);
        body = JSON.parse(res.text);

        let fragment_by_id = await request(app).get(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1');
        expect(fragment_by_id.text).toBe("This is a new fragment");


        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a fragment</h1>");
        body = JSON.parse(res.text);

        res = await request(app).put(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a new fragment</h1>").expect(200);
        body = JSON.parse(res.text);

        fragment_by_id = await request(app).get(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1');
        expect(fragment_by_id.text).toBe("<h1>This is a new fragment</h1>");

        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send("### This is a fragment");
        body = JSON.parse(res.text);

        res = await request(app).put(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send("### This is a new fragment").expect(200);
        body = JSON.parse(res.text);

        fragment_by_id = await request(app).get(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1');
        expect(fragment_by_id.text).toBe("### This is a new fragment");

        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json')
            .send('{"status": "testing"}');

        res = await request(app).put(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json')
            .send('{"status": "updating"}').expect(200);
        body = JSON.parse(res.text);

        fragment_by_id = await request(app).get(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1');
        expect(fragment_by_id.text).toBe('{"status": "updating"}');

    });

    test('authenticated user cannot update fragment of that exists with the different type from that a fragment already has', async () => {
        let res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");
        let body = JSON.parse(res.text);

        res = await request(app).put(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a new fragment</h1>").expect(400);


        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a fragment</h1>");
        body = JSON.parse(res.text);

        res = await request(app).put(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a new fragment").expect(400);


        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send("### This is a fragment");
        body = JSON.parse(res.text);

        res = await request(app).put(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json')
            .send('{"status": "updating"}').expect(400);


        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json')
            .send('{"status": "testing"}');

        res = await request(app).put(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send("### This is a new fragment").expect(400);

    });

    test('authenticated user cannot update fragment with unsupported type', async () => {
        let res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");
        let body = JSON.parse(res.text);

        res = await request(app).put(`/v1/fragments/${body.fragment.id}`)
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'invalid/type')
            .send("This is a new fragment").expect(415)
    });

});
