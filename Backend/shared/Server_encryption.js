import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encryptMessage(message) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export function decryptMessage(encryptedMessage) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(encryptedMessage.iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(encryptedMessage.encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
