import jwt, { Algorithm } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { TOptions } from './type';

const privateKEY = fs.readFileSync(path.join(__dirname, '../../keys/private.key'), 'utf8');
const publicKEY = fs.readFileSync(path.join(__dirname, '../../keys/public.key'), 'utf8');

export const JWT = {
  sign: (payload: { id: string; role: number }, $Options: TOptions) => {
    // Token signing options
    var signOptions = {
      issuer: $Options.issuer,
      subject: $Options.subject,
      audience: $Options.audience,
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60, // ! hour only
      algorithm: 'RS256' as Algorithm,
    };
    return jwt.sign({ id: payload.id, role: payload.id }, privateKEY, signOptions);
  },
  verify: (token: string, $Option: TOptions) => {
    var verifyOptions = {
      issuer: $Option.issuer,
      subject: $Option.subject,
      audience: $Option.audience,
      expiresIn: '1h',
      algorithm: ['RS256'],
    };
    try {
      return jwt.verify(token, publicKEY, verifyOptions);
    } catch (err) {
      return false;
    }
  },
  decode: (token: string) => {
    return jwt.decode(token, { complete: true });
  },
};
