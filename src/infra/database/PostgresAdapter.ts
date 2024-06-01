import pgp from "pg-promise";
import DatabaseConnection from "./DatabaseConnection";

// framework and driver(conector da tecnologia)
class PostgresAdapter implements DatabaseConnection{
    connection: any;

    constructor() {
        this.connection = pgp()("postgres://postgres:postgres@localhost:5433/app");
    }

    query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }

    close(): Promise<void> {
        return this.connection.$pool.end();
    }

}

export default PostgresAdapter;