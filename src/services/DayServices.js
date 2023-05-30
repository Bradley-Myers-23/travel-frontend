import apiClient from "./services";

export default {
  getDays() {
    return apiClient.get("days");
  },
  getDay(id) {
    return apiClient.get("days/" + id);
  },
  addDay(day) {
    return apiClient.post("days", day);
  },
  updateDay(day) {
    return apiClient.put("days/" + day.id, day);
  },
  deleteDay(dayId) {
    return apiClient.delete("days/" + dayId);
  },
};
