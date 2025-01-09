import { MongoClient } from "mongodb";

let client;
export const initializeDBConnection = async () => {
    client = await new MongoClient(process.env.DATABASE).connect();
};

export const getDBConnection = (dbName) => {
    const db = client.db(dbName);
    return db;
};
