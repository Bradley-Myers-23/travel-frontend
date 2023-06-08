import apiClient from "./services";

export default {
  getTripDays() {
    return apiClient.get("tripDays");
  },
  getTripDaysForTrip(tripId) {
    return apiClient.get("trips/" + tripId + "/tripDays");
  },
  getTripDaysForTripWithSites(tripId) {
    return apiClient.get("trips/" + tripId + "/tripDaysWithSites");
  },
  getTripDay(tripDay) {
    return apiClient.get(
      "trips/" + tripDay.tripId + "/tripDays/" + tripDay.id
    );
  },
  addTripDay(tripDay) {
    return apiClient.post(
      "trips/" + tripDay.tripId + "/tripDays",
      tripDay
    );
  },
  updateTripDay(tripDay) {
    return apiClient.put(
      "trips/" + tripDay.tripId + "/tripDays/" + tripDay.id,
      tripDay
    );
  },
  deleteTripDay(tripDay) {
    return apiClient.delete(
      "trips/" + tripDay.tripId + "/tripDays/" + tripDay.id
    );
  },
};
