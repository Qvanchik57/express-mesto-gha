class NotAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotAuthError';
    this.statusCode = 401;
  }
}

module.exports = NotAuthError;
