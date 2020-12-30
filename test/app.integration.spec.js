// test/app.integration.spec.js
const request = require('supertest');
const app = require('../app');
const connection = require('../connection');

describe('Test routes', () => {
    beforeEach(done => connection.query('TRUNCATE bookmark', done));

  it('GET / sends "Hello World" as json', (done) => {
    request(app) // request to app.js
      .get('/') // test GET method on '/' URL
      .expect(200) // Expect error 200
      .expect('Content-Type', /json/) // and header Content-Type containing Json file
      .then(response => { // Callback with expect result -> data expect receive in rep to request
        const expected = { message: 'Hello World!'};
        expect(response.body).toEqual(expected); // Check if response.body === expected String value
        done();
      });
  });

  it('POST /bookmarks - error (fields missing) ', (done) => {
    request(app)
      .post('/bookmarks')
      .send({})
      .expect(422)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = {error: 'required field(s) missing'};
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks - OK (fields provided) ', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ url: 'https://jestjs.io', title: 'Jest' })
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { id: expect.any(Number), url: 'https://jestjs.io', title: 'Jest' };
        expect(response.body).toEqual(expected);
        done();
      })
      .catch(done);
  });

});

describe('GET /bookmarks/:id', () => {
    const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
    beforeEach((done) => connection.query(
      'TRUNCATE bookmark', () => connection.query(
        'INSERT INTO bookmark SET ?', testBookmark, done
      )
    ));
  
    it('GET /bookmarks/:id', (done) => {
        request(app) // request to app.js
          .get('/bookmarks/10') // test GET method on define URL
          .expect(404) // Expect error 
          .expect('Content-Type', /json/) // and header Content-Type containing Json file
          .then(response => { // Callback with expect result -> data expect receive in rep to request
            const expected = { error: 'Bookmark not found'};
            expect(response.body).toEqual(expected); // Check if response.body === expected String value
            done();
          });
      });

    it('GET /bookmarks/:id', (done) => {
        testBookmark.id = 1
        let testBookmarkFormatted = [testBookmark]
        request(app) // request to app.js
            .get('/bookmarks/1') // test GET method on define URL
            .expect(200) // Expect error 
            .expect('Content-Type', /json/) // and header Content-Type containing Json file
            .then(response => { // Callback with expect result -> data expect receive in rep to request
                expect(response.body).toEqual(testBookmarkFormatted); // Check if response.body === testBookmarkFormatted
                done();
            });
    });
});