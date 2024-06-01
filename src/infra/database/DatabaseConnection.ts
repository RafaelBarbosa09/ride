// port - interface adapter
interface DatabaseConnection {
    query(statement: string, params: any): Promise<any>;
    close(): Promise<void>;
}

export default DatabaseConnection;