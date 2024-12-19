import Database from "better-sqlite3";

interface Message {
    mid: number;
    sender: string;
    receiver: string;
    content: string;
    // TODO: change to number
    timestamp: string;
}

class DatabaseService {


    private db: Database.Database;

    constructor() {
        this.db = new Database("db.sqlite");
        this.initialize();
    }

    private initialize() {
        // Create the table if it doesn't exist
        // config table : id, key, value
        // messages table : id, sender, receiver, message, timestamp
        // abandon: contacts table : id, nickname, username, avatar, email, phone, area

        const createTableQueries = [
            `CREATE TABLE IF NOT EXISTS config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE,
                value TEXT
            );`,
            `CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mid INTEGER UNIQUE,
                sender TEXT,
                receiver TEXT,
                content TEXT,
                timestamp TEXT,
                status INTEGER DEFAULT 0
            );`,
            `CREATE TABLE IF NOT EXISTS groups_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mid INTEGER UNIQUE,
                sender TEXT,
                receiver TEXT,
                content TEXT,
                timestamp TEXT,
                status INTEGER DEFAULT 0
            );`,
            `CREATE TABLE IF NOT EXISTS local_login (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
                );`

        ];


        createTableQueries.forEach(query => {
            this.db.exec(query);
        });

        const checkConfigQuery = `SELECT COUNT(*) as count
                                  FROM config;`;
        const stmt = this.db.prepare(checkConfigQuery);
        const result: any = stmt.get();

        if (result.count === 0) {
            const insertConfigQueries = [
                `INSERT INTO config (key, value) VALUES ('lastSyncMessageId', '0');`,
                `INSERT INTO config (key, value) VALUES ('lastSyncGroupMessageId', '0');`,
                `INSERT INTO config (key, value) VALUES ('lastSyncTime', '0');`,
                `INSERT INTO config (key, value) VALUES ('theme', 'light');`
            ];

            insertConfigQueries.forEach(query => {
                try {
                    this.db.exec(query);
                } catch (error) {
                    console.error('Insert config error:', error);
                }
            });
        }

    }

    async query(sql: string, params: any[]): Promise<any> {
        try {
            console.log('Executing query:', sql, 'with params:', params);
            const stmt = this.db.prepare(sql);
            return JSON.stringify(stmt.all(params));
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    async saveMessages(messages: any[], type: string): Promise<void> {
        let Query: string = '';
        switch (type) {
            case 'friend':
                Query = `INSERT INTO messages (mid, sender, receiver, content, timestamp) VALUES (?, ?, ?, ?,?);`;
                break;
            case 'group':
                Query = `INSERT INTO groups_messages (mid, sender, receiver, content, timestamp) VALUES (?, ?, ?, ?,?);`;
                break;
        }
        const Stmt = this.db.prepare(Query);
        this.db.transaction((messages) => {
            messages.forEach((message: Message) => {
                try {
                    Stmt.run(message.mid, message.sender, message.receiver, message.content, message.timestamp);
                } catch (error: any) {
                    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                        return
                    }
                }
            });

            const lastMessage = messages[messages.length - 1];
            if (lastMessage) {
                const lastMid = lastMessage.mid;
                try {
                    if (type === 'friend') {
                        const updateConfigQuery = `UPDATE config SET value = ? WHERE key = 'lastSyncMessageId';`;
                        this.db.prepare(updateConfigQuery).run(lastMid.toString());
                    }
                    if (type === 'group') {
                        const updateConfigQuery = `UPDATE config SET value = ? WHERE key = 'lastSyncGroupMessageId';`;
                        this.db.prepare(updateConfigQuery).run(lastMid.toString());
                    }
                } catch (error) {
                    console.error('Error updating lastSyncMessageId in config:', error);
                }
            }
        })(messages);
    }

    // src/db/index.ts
    async getMessages(param: string, type: string): Promise<any> {
        let query: string = '';

        if (type === 'friend') {
            query = `SELECT *
                     FROM messages
                     WHERE receiver = ?
                        OR sender = ?;`;
            const stmt = this.db.prepare(query);
            return JSON.stringify(stmt.all([param, param]));
        } else if (type === 'group') {
            query = `SELECT *
                     FROM groups_messages
                     WHERE receiver = ?;`;
            const stmt = this.db.prepare(query);
            return JSON.stringify(stmt.all([param]));
        }

    }

    async getLocalLogin(): Promise<any> {
        try {
            const query = `SELECT *
                           FROM local_login;`;
            const stmt = this.db.prepare(query);
            return JSON.stringify(stmt.all());
        } catch (error) {
            console.error('Database getLocalLogin error:', error);
            throw error;
        }
    }


    async getConfig(): Promise<any> {
        try {
            const query = `SELECT *
                           FROM config;`;
            const stmt = this.db.prepare(query);
            return JSON.stringify(stmt.all());
        } catch (error) {
            console.error('Database getConfig error:', error);
            throw error;
        }
    }

    async setLocalLogin(data: any) {
        try {
            const query = `INSERT INTO local_login (username, password) VALUES (?, ?);`;
            const stmt = this.db.prepare(query);
            stmt.run(data.username, data.password);
        } catch (error) {
            console.error('Database setLocalLogin error:', error);
            throw error;
        }
    }
}

export default DatabaseService;
