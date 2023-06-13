import apiClient from "./services";

export default {
  getHotelDays() {
    return apiClient.get("hotelDays");
  },
  getHotelDaysForTrip(tripId) {
    return apiClient.get("trips/" + tripId + "/hotelDays");
  },
  getHotelDaysForTripDay(tripId, tripDayId) {
    return apiClient.get(
      "trips/" +
        tripId +
        "/tripDays/" +
        tripDayId +
        "/hotelDaysWithHotels"
    );
  },
  getHotelDay(hotelDay) {
    return apiClient.get(
      "trips/" +
        hotelDay.tripId +
        "/hotelDays/" +
        hotelDay.id
    );
  },
  addHotelDay(hotelDay) {
    return apiClient.post(
      "trips/" + hotelDay.tripId + "/hotelDays",
      hotelDay
    );
  },
  updateHotelDay(hotelDay) {
    return apiClient.put(
      "trips/" +
        hotelDay.tripId +
        "/hotelDays/" +
        hotelDay.id,
      hotelDay
    );
  },
  deleteHotelDay(hotelDay) {
    return apiClient.delete(
      "trips/" +
        hotelDay.tripId +
        "/hotelDays/" +
        hotelDay.id
    );
  },
};
