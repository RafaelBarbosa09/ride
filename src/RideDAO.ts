interface RideDAO {
    save(ride: any): Promise<void>;
    getById(rideId: string): Promise<any>;
}

export default RideDAO;