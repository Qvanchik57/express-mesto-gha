const allowedCors = [
  'localhost:3000',
  'sergo.students.nomoredomainsmonster.ru',
  'api.sergo.students.nomoredomainsmonster.ru',
  'http://sergo.students.nomoredomainsmonster.ru',
  'https://sergo.students.nomoredomainsmonster.ru',
  'http://api.sergo.students.nomoredomainsmonster.ru',
  'https://api.sergo.students.nomoredomainsmonster.ru',
  'http://51.250.13.155',
  'https://51.250.13.155',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return (next());
};
