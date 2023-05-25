import apiClient from "./services";

export default {
  createTrip(tripData) {
    return apiClient.post("trips", tripData);
  },
  getTrip(tripId) {
    return apiClient.get("trips/" + tripId);
  },
  updateTrip(tripId, tripData) {
    return apiClient.put("trips/" + tripId, tripData);
  },
  deleteTrip(tripId) {
    return apiClient.delete("trips/" + tripId);
  },
};
