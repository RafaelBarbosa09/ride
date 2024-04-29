import AccountRepository from "./AccountRepository";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";

class GetAccount {
    constructor(private accountDAO: AccountRepository) {
    }

    async execute(accountId: string) {
        return await this.accountDAO.getById(accountId);
    }
}

export default GetAccount;