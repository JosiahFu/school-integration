import fs from 'fs';

const SAVE_FILE = 'save/events.json';

interface SavedData {
    events: string[];
}

// Create file if it doesn't exist
if (!fs.existsSync(SAVE_FILE)) {
    writeData({ events: [] });
}

function readData(): SavedData {
    return JSON.parse(fs.readFileSync(SAVE_FILE, 'utf-8'));
}

function writeData(data: SavedData) {
    fs.writeFileSync(SAVE_FILE, JSON.stringify(data));
}

export { readData, writeData }
