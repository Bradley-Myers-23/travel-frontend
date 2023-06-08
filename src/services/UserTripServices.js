import apiClient from "./services";

export default {
  getUserTrips() {
    return apiClient.get("userTrips");
  },
  getUserForTrip(tripId) {
    return apiClient.get("trips/" + tripId + "/userTrips");
  },

  getUserTrip(userTrip) {
    return apiClient.get(
      "trips/" +
        userTrip.tripId +
        "/userTrips/" +
        userTrip.id
    );
  },
  addUserTrip(userTrip) {
    return apiClient.post(
      "trips/" + userTrip.tripId + "/userTrips",
      userTrip
    );
  },
  updateUserTrip(userTrip) {
    return apiClient.put(
      "trips/" +
        userTrip.tripId +
        "/userTrips/" +
        userTrip.id,
      userTrip
    );
  },
  deleteUserTrip(userTrip) {
    return apiClient.delete(
      "trips/" +
      userTrip.tripId +
        "/userTrips/" +
        userTrip.id
    );
  },
};
