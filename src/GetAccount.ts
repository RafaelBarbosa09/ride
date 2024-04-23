import AccountDAO from "./AccountDAO";

class GetAccount {
    accountDAO: AccountDAO;

    constructor() {
        this.accountDAO = new AccountDAO();
    }

    async execute(accountId: string) {
        const accountDAO = new AccountDAO();
        return await accountDAO.getById(accountId);
    }
}

export default GetAccount;