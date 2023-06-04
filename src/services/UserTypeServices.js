import apiClient from "./services";

export default {
  getUserTypes() {
    return apiClient.get("userTypes");
  },
  getUserType(id) {
    return apiClient.get("userTypes/" + id);
  },
  addUserType(userType) {
    return apiClient.post("userTypes", userType);
  },
  updateUserType(userType) {
    return apiClient.put("userTypes/" + userType.id, userType);
  },
  deleteUserType(userTypeId) {
    return apiClient.delete("userTypes/" + userTypeId);
  },
};
