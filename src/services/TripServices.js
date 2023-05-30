import apiClient from "./services";

export default {
  getTrips() {
    return apiClient.get("Trips");
  },
  getTripsByUserId(userId) {
    return apiClient.get("Trips/user/" + userId);
  },
  getTrip(id) {
    return apiClient.get("Trips/" + id);
  },
  addTrip(Trip) {
    return apiClient.post("Trips", Trip);
  },
  updateTrip(TripId, Trip) {
    return apiClient.put("Trips/" + TripId, Trip);
  },
  deleteTrip(TripId) {
    return apiClient.delete("Trips/" + TripId);
  },
};
