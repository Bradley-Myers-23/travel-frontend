import apiClient from "./services";

export default {
  getTripSites() {
    return apiClient.get("tripSites");
  },
  getTripSitesForTrip(tripId) {
    return apiClient.get("trips/" + tripId + "/tripSites");
  },
  getTripSitesForTripDay(tripId, tripDayId) {
    return apiClient.get(
      "trips/" +
        tripId +
        "/tripDays/" +
        tripDayId +
        "/tripSitesWithSites"
    );
  },
  getTripSite(tripSite) {
    return apiClient.get(
      "trips/" +
        tripSite.tripId +
        "/tripSites/" +
        tripSite.id
    );
  },
  addTripSite(tripSite) {
    return apiClient.post(
      "trips/" + tripSite.tripId + "/tripSites",
      tripSite
    );
  },
  updateTripSite(tripSite) {
    return apiClient.put(
      "trips/" +
        tripSite.tripId +
        "/tripSites/" +
        tripSite.id,
      tripSite
    );
  },
  deleteTripSite(tripSite) {
    return apiClient.delete(
      "trips/" +
        tripSite.tripId +
        "/tripSites/" +
        tripSite.id
    );
  },
};
