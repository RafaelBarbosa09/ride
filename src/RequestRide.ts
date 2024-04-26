import crypto from "crypto";
import Logger from "./Logger";
import RideDAO from "./RideDAO";

class RequestRide {
    constructor(private rideDAO: RideDAO, private logger: Logger) {}

    async execute(input: any) {
        this.logger.log(`requestRide ${input.name}`);
        input.rideId = crypto.randomUUID();
        input.status = 'requested';
        input.date = new Date();
        await this.rideDAO.save(input);
        return {
            rideId: input.rideId
        };
    }
}

export default RequestRide;