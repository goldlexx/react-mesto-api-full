require('dotenv').config();

const {
  after,
  before,
  describe,
  test,
} = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const testMongoUri = process.env.MONGODB_TEST_URI;
process.env.JWT_SECRET = 'integration-tests-only-secret-value-over-32-chars';
if (testMongoUri) process.env.DATABASE_URL = testMongoUri;
const app = require('../app');
const Card = require('../models/card');
const User = require('../models/user');
const { handleError } = require('../middlewares/handleError');

const testToken = jwt.sign(
  { _id: new mongoose.Types.ObjectId().toString() },
  process.env.JWT_SECRET,
  { algorithm: 'HS256' },
);

const suiteOptions = testMongoUri
  ? {}
  : { skip: 'Set MONGODB_TEST_URI to a disposable database ending in _test' };

function sendRequest(port, path, { method = 'GET', token, body } = {}) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : JSON.stringify(body);
    const headers = {};
    if (payload) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);

    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers,
    }, (res) => {
      let responseBody = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        let parsedBody = responseBody;
        try {
          parsedBody = responseBody ? JSON.parse(responseBody) : null;
        } catch (parseError) {
          parsedBody = { error: parseError.message, response: responseBody };
        }
        resolve({ status: res.statusCode, body: parsedBody });
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

test('rejects invalid signup passwords and card URLs before database access', async () => {
  const server = await new Promise((resolve) => {
    const httpServer = app.listen(0, () => {
      resolve(httpServer);
    });
  });
  const { port } = server.address();

  try {
    const signup = await sendRequest(port, '/signup', {
      method: 'POST',
      body: { name: 'Test User', email: 'test@example.test', password: 'short' },
    });
    const unauthorizedCards = await sendRequest(port, '/cards');
    const card = await sendRequest(port, '/cards', {
      method: 'POST',
      token: testToken,
      body: { name: 'Invalid', link: 'not-a-url' },
    });

    assert.equal(signup.status, 400);
    assert.equal(unauthorizedCards.status, 401);
    assert.equal(card.status, 400);
  } finally {
    await new Promise((resolve) => {
      server.close(() => resolve());
    });
  }
});

test('hides internal error details from API responses', () => {
  let responseStatus;
  let responseBody;
  const response = {
    status(status) {
      responseStatus = status;
      return this;
    },
    send(body) {
      responseBody = body;
      return this;
    },
  };

  handleError(new Error('database connection details'), {}, response, () => {});

  assert.equal(responseStatus, 500);
  assert.deepEqual(responseBody, { message: 'На сервере произошла ошибка' });
});

test('Mongoose rejects invalid avatar and card URLs without a database', () => {
  const owner = new mongoose.Types.ObjectId();
  const card = new Card({ name: 'Place', link: 'not-a-url', owner });
  const user = new User({
    email: 'test@example.test',
    password: 'valid-password-123',
    avatar: 'not-a-url',
  });

  assert.ok(card.validateSync().errors.link);
  assert.ok(user.validateSync().errors.avatar);
});

describe('Mesto API integration', suiteOptions, () => {
  let server;
  let port;

  before(async () => {
    const dbName = new URL(testMongoUri).pathname.replace(/^\/+/, '');
    if (!/_test$/i.test(dbName)) {
      throw new Error('Refusing to run integration tests against a database not ending in _test');
    }

    await mongoose.connect(testMongoUri);
    await mongoose.connection.dropDatabase();
    server = await new Promise((resolve) => {
      const httpServer = app.listen(0, () => {
        resolve(httpServer);
      });
    });
    port = server.address().port;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
    if (mongoose && mongoose.connection.readyState) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  test('registers and authenticates users; protects card deletion and validates input', async () => {
    const suffix = Date.now();
    const owner = {
      name: 'Owner',
      email: `owner-${suffix}@example.test`,
      password: 'valid-password-123',
    };
    const other = {
      name: 'Other',
      email: `other-${suffix}@example.test`,
      password: 'valid-password-456',
    };

    const shortPassword = await sendRequest(port, '/signup', {
      method: 'POST',
      body: {
        ...owner,
        email: `short-${suffix}@example.test`,
        password: 'short',
      },
    });
    assert.equal(shortPassword.status, 400);

    const registration = await sendRequest(port, '/signup', {
      method: 'POST',
      body: owner,
    });
    assert.equal(registration.status, 200);
    assert.equal(Object.hasOwn(registration.body, 'password'), false);

    await sendRequest(port, '/signup', {
      method: 'POST',
      body: other,
    });
    const ownerLogin = await sendRequest(port, '/signin', {
      method: 'POST',
      body: { email: owner.email, password: owner.password },
    });
    const otherLogin = await sendRequest(port, '/signin', {
      method: 'POST',
      body: { email: other.email, password: other.password },
    });
    assert.equal(ownerLogin.status, 200);
    assert.equal(otherLogin.status, 200);

    const profile = await sendRequest(port, '/users/me', { token: ownerLogin.body.token });
    assert.equal(profile.status, 200);
    assert.equal(profile.body.email, owner.email);
    assert.equal(Object.hasOwn(profile.body, 'password'), false);

    const invalidCard = await sendRequest(port, '/cards', {
      method: 'POST',
      token: ownerLogin.body.token,
      body: { name: 'Invalid', link: 'not-a-url' },
    });
    assert.equal(invalidCard.status, 400);

    const created = await sendRequest(port, '/cards', {
      method: 'POST',
      token: ownerLogin.body.token,
      body: { name: 'Lake', link: 'https://example.test/lake.jpg' },
    });
    assert.equal(created.status, 200);

    const forbiddenDelete = await sendRequest(port, `/cards/${created.body._id}`, {
      method: 'DELETE',
      token: otherLogin.body.token,
    });
    assert.equal(forbiddenDelete.status, 403);

    const stillPresent = await sendRequest(port, '/cards', {
      token: ownerLogin.body.token,
    });
    assert.equal(stillPresent.status, 200);
    assert.ok(stillPresent.body.some((card) => card._id === created.body._id));

    const ownerDelete = await sendRequest(port, `/cards/${created.body._id}`, {
      method: 'DELETE',
      token: ownerLogin.body.token,
    });
    assert.equal(ownerDelete.status, 200);
  });
});
