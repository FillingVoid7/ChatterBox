import CryptoJS from 'crypto-js';

const algorithm = 'AES';
const key = CryptoJS.enc.Hex.parse('your-256-bit-key'); // Replace with your key
const iv = CryptoJS.enc.Hex.parse('your-128-bit-iv');   // Replace with your IV

export function encryptMessage(message) {
  const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv }).toString();
  return encrypted;
}

export function decryptMessage(encryptedMessage) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, key, { iv: iv });
  return bytes.toString(CryptoJS.enc.Utf8);
}
