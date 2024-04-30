import express, {Request, Response} from "express";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";
import LoggerConsole from "./LoggerConsole";

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
    try {
        const input = req.body;
        const accountRepository = new AccountRepositoryDatabase();
        const logger = new LoggerConsole();
        const signup = new Signup(accountRepository, logger);
        const output = await signup.execute(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId;
    const accountRepository = new AccountRepositoryDatabase();
    const getAccount = new GetAccount(accountRepository);
    const output = await getAccount.execute(accountId);
    res.json(output);
});

app.listen(3333)