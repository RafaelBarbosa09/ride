import AccountRepository from "../repository/AccountRepository";
import Logger from "../logger/Logger";
import Account from "../../domain/Account";

class Signup {
    accountRepository: AccountRepository;
    logger: Logger;

    constructor(accountRepository: AccountRepository, logger: Logger) {
        this.accountRepository = accountRepository;
        this.logger = logger;
    }

    async execute(input: Input): Promise<Output> {
        this.logger.log(`signup ${input.name}`);
        const existingAccount = await this.accountRepository.getByEmail(input.email);
        if (existingAccount) throw new Error("Duplicated account");

        const account = Account.create(input.name, input.email, input.cpf, input.carPlate || "", !!input.isPassenger, !!input.isDriver);
        await this.accountRepository.save(account)

        return {
            accountId: account.accountId
        };
    }
}

type Input = {
    name: string,
    email: string,
    cpf: string,
    carPlate?: string,
    isPassenger?: boolean,
    isDriver?: boolean,
    password: string,
}

type Output = {
    accountId: string,

}

export default Signup;