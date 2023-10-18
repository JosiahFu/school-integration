import fs from 'fs';

interface SavedData<T> {
    entries: T[];
}

type Condition<T extends object> = Partial<T> | ((entry: T) => boolean);

interface DbApi<T extends object> {
    addEntry(entry: T): void
    removeEntry(entry: T): void;
    remove(condition?: Condition<T>): void;
    query(condition?: Condition<T>): T[]
    readOnlyQuery(condition?: Condition<T>): (Readonly<T>)[]
}

function predicate<T extends object>(condition: Condition<T>) {
    return typeof condition === 'object' ? (entry: T) => (
        (Object.keys(condition) as (keyof T)[]).every(key => condition[key] === entry[key])
    ) : condition;
}

class DB<T extends object> implements DbApi<T> {
    // File handling

    private saveFile: string;

    private readDataFileSync(): SavedData<T> {
        return JSON.parse(fs.readFileSync(this.saveFile, 'utf-8'));
    }

    private async writeDataFile(data: SavedData<T>) {
        await fs.promises.writeFile(this.saveFile, JSON.stringify(data));
    }

    constructor(saveFile: string, initialData: T[] = []) {
        this.saveFile = saveFile;

        this.data = fs.existsSync(this.saveFile) ? this.readDataFileSync().entries : initialData;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleUpdate = <T extends (...args: any[]) => boolean>(reflectMethod: T): T => {
            return (((...args) => {
                const result = reflectMethod(...args);
                this.updateWithData();
                return result;
            }) as T);
        }

        this.modificationProxy = (entry: T) => {
            return new Proxy<T>(entry, {
                set: handleUpdate(Reflect.set),
                deleteProperty: handleUpdate(Reflect.deleteProperty),
                defineProperty: handleUpdate(Reflect.defineProperty),
            });
        }
    }

    // Internal data handling

    private data: T[];

    private async updateWithData() {
        await this.writeDataFile({ entries: this.data });
    }


    private modificationProxy: (entry: T) => T;

    // API methods

    async addEntry(entry: T) {
        this.data.push(entry);
        await this.updateWithData();
    }

    async removeEntry(entry: T) {
        this.data.splice(this.data.findIndex(e => e === entry), 1);
        await this.updateWithData();
    }

    async remove(condition?: Condition<T>) {
        this.readOnlyQuery(condition).forEach(this.removeEntry);
    }

    query(condition?: Condition<T>): T[] {
        return this.readOnlyQuery(condition).map(this.modificationProxy);
    }

    readOnlyQuery(condition?: Condition<T>): (Readonly<T>)[] {
        return condition ? this.data.filter(predicate(condition)) : [...this.data];
    }
}

export { DB };
