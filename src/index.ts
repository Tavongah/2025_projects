import fs from 'fs/promises';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { readJsonFile, writeJsonFile } from './utils';
import { Animal, User } from './types';

const DATA_PATH = './data';
const SECRET_KEY = 'your_secret_key';

async function displayAllAnimals() {
    const animals = await readJsonFile<Animal[]>(`${DATA_PATH}/animals.json`);
    console.log(animals);
}

async function displayOneAnimal(id: string) {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
        console.error("Error 400: Invalid animal ID. Must be a valid integer.");
        return;
    }

    const animals = await readJsonFile<Animal[]>(`${DATA_PATH}/animals.json`);
    const animal = animals.find(a => a.id === parsedId);

    if (!animal) {
        console.error("Error 404: Animal not found.");
        return;
    }

    console.log(animal);
}

async function createAnimal(token: string, animalData: string) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
        const animals = await readJsonFile<Animal[]>(`${DATA_PATH}/animals.json`);
        const newAnimal = JSON.parse(animalData);

        if (!newAnimal.name || newAnimal.description.length < 2 || newAnimal.images.length < 1) {
            console.error('Error 400: Invalid data.');
            return;
        }

        newAnimal.id = animals.length ? Math.max(...animals.map(a => a.id)) + 1 : 1;
        newAnimal.createdByUser = decoded.id;
        animals.push(newAnimal);
        await writeJsonFile(`${DATA_PATH}/animals.json`, animals);
        console.log('Animal added successfully.');
    } catch (error) {
        console.error('Error 401: Invalid token or data.');
    }
}

async function login(username: string, password: string) {
    const users = await readJsonFile<User[]>(`${DATA_PATH}/users.json`);
    const hash = crypto.createHash('sha256').update(`${username}:${password}`).digest('hex');
    const user = users.find(u => u.hash === hash);

    if (user) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        console.log(`Token: ${token}`);
    } else {
        console.error('Error 401: Invalid credentials.');
    }
}

async function getUserInfo(token: string) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
        const users = await readJsonFile<User[]>(`${DATA_PATH}/users.json`);
        const user = users.find(u => u.id === decoded.id);
        const animals = await readJsonFile<Animal[]>(`${DATA_PATH}/animals.json`);

        if (user) {
            console.log(`User ID: ${user.id}, Name: ${user.name}`);
            console.log('You’ve added the following animals:');
            animals.filter(a => a.createdByUser === user.id).forEach(a => console.log(`ID: ${a.id}, Name: ${a.name}`));
        } else {
            console.error('Error 404: User not found.');
        }
    } catch (error) {
        console.error('Error 401: Invalid token.');
    }
}

const args = process.argv.slice(2);
switch (args[0]) {
    case 'animals':
        if (args[1] === 'all') displayAllAnimals();
        else if (args[1] === 'one' && args[2]) displayOneAnimal(args[2]);
        else if (args[1] === 'create' && args[2] && args[3]) createAnimal(args[2], args[3]);
        break;
    case 'login':
        if (args[1] && args[2]) login(args[1], args[2]);
        break;
    case 'user':
        if (args[1]) getUserInfo(args[1]);
        break;
    default:
        console.error('Error 400: Invalid command.');
}
