import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecase/Signup";
import GetAccount from "../../application/usecase/GetAccount";

// interface adapter
class MainController {
    constructor(readonly httpServer: HttpServer, signup: Signup, getAccount: GetAccount) {
        httpServer.register("post", "/signup", async (params: any, body: any) => {
            return await signup.execute(body);
        });

        httpServer.register("get", "/accounts/:accountId", async (params: any, body: any) => {
            return await getAccount.execute(params.accountId);
        });
    }
}

export default MainController;