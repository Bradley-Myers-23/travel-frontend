import apiClient from "./services";
const db = require("../models");
const { hashPassword } = require("./crypto");

class UploadFilesService {

  upload(file) {
    let formData = new FormData();

    formData.append("file", file);

  }

}

export default new UploadFilesService();