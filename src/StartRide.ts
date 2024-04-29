import crypto from "crypto";
import RideDAO from "./RideDAO";
import AccountDAO from "./AccountDAO";

class StartRide {
    constructor(private rideDAO: RideDAO) {}

    async execute(input: any) {
        const ride = await this.rideDAO.getById(input.rideId);
        ride.status = "in_progress"
        await this.rideDAO.update(ride);
    }
}

export default StartRide;