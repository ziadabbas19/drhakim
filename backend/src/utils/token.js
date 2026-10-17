import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const ACCESS_TOKEN_HEADER = 'X-Access-Token';

const ALGORITHM = 'HS256';
const MS_PER_SECOND = 1000;

export const signAccessToken = (user) =>
  jwt.sign({ role: user.role }, env.jwt.secret, {
    subject: user.id,
    expiresIn: env.jwt.expiresIn,
    algorithm: ALGORITHM,
  });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.secret, { algorithms: [ALGORITHM] });

export const isPastHalfLife = ({ iat, exp }) => Date.now() / MS_PER_SECOND > (iat + exp) / 2;

export const isIssuedBefore = ({ iat }, date) => Boolean(date) && iat < Math.floor(date.getTime() / MS_PER_SECOND);
