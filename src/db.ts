import fs from 'fs';

const SAVE_FILE = 'save/events.json';

interface SavedData {
    events: Entry[];
}

interface Entry {
    content: string;
}

// File handling

function readDataFileSync(): SavedData {
    return JSON.parse(fs.readFileSync(SAVE_FILE, 'utf-8'));
}

async function writeDataFile(data: SavedData) {
    await fs.promises.writeFile(SAVE_FILE, JSON.stringify(data));
}

// Create file if it doesn't exist
if (!fs.existsSync(SAVE_FILE)) {
    const initialData: SavedData = { events: [] };
    fs.writeFileSync(SAVE_FILE, JSON.stringify(initialData));
}

// Internal data handling

const data = readDataFileSync().events;

async function updateWithData() {
    await writeDataFile({ events: data });
}

// API methods

async function addEntry(entry: Entry) {
    data.push(entry);
    await updateWithData();
}

function query(condition?: Partial<Entry> | ((entry: Entry) => boolean)): readonly Entry[] {
    if (!condition) return [...data]; // Prevent mutating root data

    const predicate = typeof condition === 'object' ? (entry: Entry) => (
        (Object.keys(condition) as (keyof Entry)[]).every(key => condition[key] === entry[key])
    ) : condition;
    return data.filter(predicate);
}

export { addEntry, query };
