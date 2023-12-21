import jsonwebtoken from 'jsonwebtoken';
import crypto from 'node:crypto';

export const jwt = {
  sign(payload: any) {
    const secret = crypto.randomBytes(256).toString('base64');

    return {
      secret,
      jwt: jsonwebtoken.sign(payload, `${secret}.${process.env.SECRET}`),
    };
  },

  verify(token: string, secret: string) {
    return jsonwebtoken.verify(token, `${secret}.${process.env.SECRET}`);
  },
};
