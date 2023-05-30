import apiClient from "./services";

export default {
  getTripDays() {
    return apiClient.get("TripDays");
  },
  getTripDaysForTrip(TripId) {
    return apiClient.get("Trips/" + TripId + "/TripDays");
  },
  getTripDaysForTripWithIngredients(TripId) {
    return apiClient.get("Trips/" + TripId + "/TripDaysWithIngredients");
  },
  getTripDay(TripDay) {
    return apiClient.get(
      "Trips/" + TripDay.TripId + "/TripDays/" + TripDay.id
    );
  },
  addTripDay(TripDay) {
    return apiClient.post(
      "Trips/" + TripDay.TripId + "/TripDays",
      TripDay
    );
  },
  updateTripDay(TripDay) {
    return apiClient.put(
      "Trips/" + TripDay.TripId + "/TripDays/" + TripDay.id,
      TripDay
    );
  },
  deleteTripDay(TripDay) {
    return apiClient.delete(
      "Trips/" + TripDay.TripId + "/TripDays/" + TripDay.id
    );
  },
};
