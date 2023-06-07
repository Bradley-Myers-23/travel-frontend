import apiClient from "./services";

class UploadFilesService {

  upload(file) {
    let formData = new FormData();

    formData.append("file", file);

  }

}

export default new UploadFilesService();