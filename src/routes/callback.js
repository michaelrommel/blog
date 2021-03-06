import got from 'got';
const tokenURL = 'https://github.com/login/oauth/access_token';
const userURL = 'https://api.github.com/user';

export async function get(request) {
  const code = request.url.searchParams.get('code');
  const token = await getToken(code);
  const user = await getUser(token);

  request.locals.user = user.login;

  return {
    status: 302,
    headers: {
      Location: '/'
    }
  };
}

async function getUser(token) {
  return got(userURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then((reply) => reply.json());
}

async function getToken(code) {
  return got(tokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      code
    })
  })
    .then((reply) => reply.json())
    .then((reply) => reply.access_token);
}
