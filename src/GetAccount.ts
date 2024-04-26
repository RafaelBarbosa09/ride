import AccountDAO from "./AccountDAO";
import AccountDAODatabase from "./AccountDAODatabase";

class GetAccount {
    constructor(private accountDAO: AccountDAO) {
    }

    async execute(accountId: string) {
        return await this.accountDAO.getById(accountId);
    }
}

export default GetAccount;