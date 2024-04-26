import RideDAO from "./RideDAO";
import Logger from "./Logger";
import rideDAO from "./RideDAO";

class GetRide {
    constructor(private rideDAO: RideDAO, private logger: Logger) {}

    async execute(rideId: string) {
        this.logger.log(`Get Ride`);
        return await this.rideDAO.getById(rideId);
    }
}

export default GetRide;