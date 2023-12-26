import { SignJWT, jwtVerify } from 'jose';
import { v4 as uuid } from 'uuid';

export const jwt = {
  async sign(payload: any, exp: string | number | Date = '30 day') {
    const secret = uuid();

    return {
      secret,
      token: await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .sign(new TextEncoder().encode(`${secret}.${process.env.SECRET}`)),
    };
  },

  async verify(token: string, secret: string) {
    return await jwtVerify(
      token,
      new TextEncoder().encode(`${secret}.${process.env.SECRET}`),
    )
      .then((r) => r.payload)
      .catch((e) => e);
  },
};
