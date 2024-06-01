import AccountRepository from "../repository/AccountRepository";

class GetAccount {
    constructor(private accountRepository: AccountRepository) {
    }

    async execute(accountId: string) {
        return await this.accountRepository.getById(accountId);
    }
}

export default GetAccount;