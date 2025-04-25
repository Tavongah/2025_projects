import crypto from 'crypto';

function generatePasswordHash(username: string, password: string): string {
    return crypto.createHash('sha256').update(`${username}:${password}`).digest('hex');
}

const username = "tavonga";
const password = "password";

const hash = generatePasswordHash(username, password);
console.log(`Hashed Password for '${username}': ${hash}`);
