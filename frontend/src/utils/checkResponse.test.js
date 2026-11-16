import checkResponse from './checkResponse';

const createResponse = ({ ok = true, status = 200, body = '' } = {}) => ({
  ok,
  status,
  text: jest.fn().mockResolvedValue(body),
});

test('returns parsed JSON for a successful response', async () => {
  const response = createResponse({ body: '{"items":[]}' });

  await expect(checkResponse(response)).resolves.toEqual({ items: [] });
});

test('reports an API error message for an unsuccessful response', async () => {
  const response = createResponse({
    ok: false,
    status: 400,
    body: '{"message":"Invalid request"}',
  });

  await expect(checkResponse(response)).rejects.toThrow('Invalid request');
});

test('accepts an empty 204 response', async () => {
  const response = createResponse({ status: 204 });

  await expect(checkResponse(response)).resolves.toBeNull();
});

test('rejects unreadable successful responses', async () => {
  const response = createResponse({ body: '<html>not JSON</html>' });

  await expect(checkResponse(response)).rejects.toThrow(
    'The API returned an unreadable response.'
  );
});
