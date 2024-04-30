import Ride from "./Ride";

interface RideRepository {
    save(ride: Ride): Promise<void>;
    update(ride: Ride): Promise<void>;
    getById(rideId: string): Promise<Ride | undefined>;
    list(): Promise<Ride[]>;
    getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>;
}

export default RideRepository;