import apiClient from "./services";

export default {
  getTrips() {
    return apiClient.get("trips");
  },
  getTrip(id) {
    return apiClient.get("trips/" + id);
  },
  addTrip(trip) {
    return apiClient.post("trips", trip);
  },
  updateTrip(trip) {
    return apiClient.put("trips/" + trip.id, trip);
  },
  deleteTrip(tripId) {
    return apiClient.delete("trips/" + tripId);
  },
};
