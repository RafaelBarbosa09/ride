import PostgresAdapter from "./infra/database/PostgresAdapter";
import HttpServer from "./infra/http/HttpServer";
import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import LoggerConsole from "./infra/logger/LoggerConsole";
import Signup from "./application/usecase/Signup";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import GetAccount from "./application/usecase/GetAccount";
import MainController from "./infra/controller/MainController";

// composition root ou entry point
// tem como objetivo criar o grafo de dependências utilizado no projeto

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PostgresAdapter();

// interface adapter
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();

// use case
const signup = new Signup(accountRepository, logger);
const getAccount = new GetAccount(accountRepository);

// interface adapter
new MainController(httpServer, signup, getAccount);
httpServer.listen(3333);