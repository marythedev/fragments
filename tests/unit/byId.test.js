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
    test('authenticated user can see created fragments data of supported types by id', async () => {

        // Create and test a fragment of type text/plain 
        let res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");

        let fragment_by_id = await request(app).get(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1');

        expect(fragment_by_id.header['content-type']).toBe(res.body.fragment.type);
        expect(fragment_by_id.header['content-length']).toBe(res.body.fragment.size.toString());
        expect(fragment_by_id.text).toBe("This is a fragment");


        // Create and test a fragment of type text/markdown
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send("# This is a fragment");

        // Get the fragment by id and request conversion to text/html
        fragment_by_id = await request(app).get(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1');

        expect(fragment_by_id.header['content-type']).toBe('text/markdown');
        expect(fragment_by_id.text).toContain('# This is a fragment');


        // Create and test a fragment of type text/html
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a fragment</h1>");

        // Get the fragment by id and request conversion to text/html
        fragment_by_id = await request(app).get(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1');

        expect(fragment_by_id.header['content-type']).toBe('text/html');
        expect(fragment_by_id.text).toContain('<h1>This is a fragment</h1>');


        // Create and test a fragment of type application/json
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json; charset=utf-8')
            .send("{'fragment': 'This is a fragment'}");

        // Get the fragment by id and request conversion to text/html
        fragment_by_id = await request(app).get(`/v1/fragments/${res.body.fragment.id}`)
            .auth('user1@email.com', 'password1');

        expect(fragment_by_id.header['content-type']).toBe('application/json; charset=utf-8');
        expect(fragment_by_id.text).toContain("{'fragment': 'This is a fragment'}");

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

    // Supported conversions should give a success result and appropriate fragment's data
    test('supported conversions are successful', async () => {

        // Create fragment of type text/plain
        let res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");

        //Convert fragment to text/plain
        let converted_fragment = await request(app).get(`/v1/fragments/${res.body.fragment.id}.txt`)
            .auth('user1@email.com', 'password1');
        expect(converted_fragment.text).toContain("This is a fragment");


        // Create fragment of type text/markdown
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send("# This is a fragment");

        //Convert fragment to text/html
        converted_fragment = await request(app).get(`/v1/fragments/${res.body.fragment.id}.html`)
            .auth('user1@email.com', 'password1');
        expect(converted_fragment.text).toContain("<h1>This is a fragment</h1>");

        //Convert fragment to text/plain
        converted_fragment = await request(app).get(`/v1/fragments/${res.body.fragment.id}.txt`)
            .auth('user1@email.com', 'password1');
        expect(converted_fragment.text).toContain("This is a fragment");

        //Convert fragment to text/markdown
        converted_fragment = await request(app).get(`/v1/fragments/${res.body.fragment.id}.md`)
            .auth('user1@email.com', 'password1');
        expect(converted_fragment.text).toContain("# This is a fragment");


        // Create and test a fragment of type text/html
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a fragment</h1>");

        //Convert fragment to text/plain
        converted_fragment = await request(app).get(`/v1/fragments/${res.body.fragment.id}.txt`)
            .auth('user1@email.com', 'password1');
        expect(converted_fragment.text).toContain("This is a fragment");

        //Convert fragment to text/html
        converted_fragment = await request(app).get(`/v1/fragments/${res.body.fragment.id}.html`)
            .auth('user1@email.com', 'password1');
        expect(converted_fragment.text).toContain("<h1>This is a fragment</h1>");

        // Create and test a fragment of type application/json
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json; charset=utf-8')
            .send("{'fragment': 'This is a fragment'}");

        //Convert fragment to text/plain
        converted_fragment = await request(app).get(`/v1/fragments/${res.body.fragment.id}.txt`)
            .auth('user1@email.com', 'password1');
        expect(converted_fragment.text).toContain("{'fragment': 'This is a fragment'}");

        //Convert fragment to text/json
        converted_fragment = await request(app).get(`/v1/fragments/${res.body.fragment.id}.json`)
            .auth('user1@email.com', 'password1');
        expect(converted_fragment.text).toContain("{'fragment': 'This is a fragment'}");

    });

    // Unsupported conversions should give an appropriate error
    test('unsupported conversion give error', async () => {

        // Fragment of type text/plain
        let res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send("This is a fragment");

        //Try to convert fragment to text/markdown
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.md`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to text/html
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.html`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to application/json
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.json`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/png
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.png`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/jpeg
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.jpeg`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/webp
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.webp`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image.gif
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.gif`)
            .auth('user1@email.com', 'password1').expect(415);


        // Create fragment of type text/markdown
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/markdown')
            .send("# This is a fragment");

        //Try to convert fragment to application/json
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.json`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/png
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.png`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/jpeg
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.jpeg`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/webp
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.webp`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image.gif
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.gif`)
            .auth('user1@email.com', 'password1').expect(415);


        // Create and test a fragment of type text/html
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/html')
            .send("<h1>This is a fragment</h1>");

        //Try to convert fragment to text/markdown
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.md`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to application/json
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.json`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/png
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.png`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/jpeg
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.jpeg`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/webp
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.webp`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image.gif
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.gif`)
            .auth('user1@email.com', 'password1').expect(415);


        // Create and test a fragment of type application/json
        res = await request(app).post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'application/json; charset=utf-8')
            .send("{'fragment': 'This is a fragment'}");

        //Try to convert fragment to text/markdown
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.md`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to text/html
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.html`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/png
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.png`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/jpeg
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.jpeg`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image/webp
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.webp`)
            .auth('user1@email.com', 'password1').expect(415);
        //Try to convert fragment to image.gif
        await request(app).get(`/v1/fragments/${res.body.fragment.id}.gif`)
            .auth('user1@email.com', 'password1').expect(415);


    });

});
