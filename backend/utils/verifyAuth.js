import jwt from 'jsonwebtoken';

const JSONWT_KEY = process.env.JSONWT_KEY;

const verifyAuth = (req) => {
  const errors = [];

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, JSONWT_KEY, { ignoreExpiration: true });
        return user;
      } catch (err) {
        errors.push({
          uncategorizedErrors: 'Nieprawidłowy/nieaktualny token',
        });
        return errors;
      }
    }
    errors.push({
      uncategorizedErrors: 'Nie odnaleziono tokenu w formacie "Bearer <token>',
    });
    return errors;
  }
  errors.push({
    uncategorizedErrors: 'Nie odnaleziono nagłówka autoryzacyjnego',
  });
  return errors;
};

export default verifyAuth;
