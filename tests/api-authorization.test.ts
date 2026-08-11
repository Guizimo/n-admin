import assert from 'node:assert/strict';
import test from 'node:test';
import { sign } from 'jsonwebtoken';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { getJwtSecret } from '@/lib/jwt';

const user = {
  id: 7,
  email: 'admin@example.com',
  username: 'admin',
  avatar: '/avatars/default.jpg',
  roleId: '1'
};

function authenticatedRequest() {
  const token = sign(user, getJwtSecret());
  return new Request('http://localhost/api/users', {
    headers: { cookie: `token=${token}` }
  });
}

test('rejects unauthenticated API requests with 401', async () => {
  const result = await authorizeApiRequest(
    new Request('http://localhost/api/users')
  );

  assert.equal(result.authorized, false);
  if (result.authorized) return;
  assert.equal(result.response.status, 401);
});

test('rejects authenticated users without the required permission', async () => {
  const result = await authorizeApiRequest(
    authenticatedRequest(),
    'account.user.read',
    async () => false
  );

  assert.equal(result.authorized, false);
  if (result.authorized) return;
  assert.equal(result.response.status, 403);
});

test('returns the authenticated user when permission is granted', async () => {
  const result = await authorizeApiRequest(
    authenticatedRequest(),
    'account.user.read',
    async (permissionCode, userId) => {
      assert.equal(permissionCode, 'account.user.read');
      assert.equal(userId, user.id);
      return true;
    }
  );

  assert.equal(result.authorized, true);
  if (!result.authorized) return;
  assert.equal(result.user.id, user.id);
  assert.equal(result.user.email, user.email);
});
