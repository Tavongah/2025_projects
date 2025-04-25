import fs from 'fs/promises';

export async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
    } catch (error) {
        throw new Error(`Error reading file: ${filePath}`);
    }
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        throw new Error(`Error writing file: ${filePath}`);
    }
}

