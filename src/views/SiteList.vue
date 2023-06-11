<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import SiteServices from "../services/SiteServices.js";
import UploadImage from "../components/UploadImage.vue"

const sites = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newSite = ref({
  id: undefined,
  name: undefined,
  address: undefined,
  description: undefined,
  picture: "",
});

onMounted(async () => {
  await getSites();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getSites() {
  function siteConvert(site){
    if(site.picture != null){
      //console.log(site.picture);
    }
    return site;
  }

  await SiteServices.getSites()
    .then((response) => {
      sites.value = response.data;
      sites.value = sites.value.map(siteConvert);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addSite() {
  isAdd.value = false;
  delete newSite.id;
  await SiteServices.addSite(newSite.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newSite.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getSites();
}

async function updateSite() {
  isEdit.value = false;
  await SiteServices.updateSite(newSite.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newSite.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getSites();
}

function openAdd() {
  newSite.value.name = undefined;
  newSite.value.address = undefined;
  newSite.value.description = undefined;
  newSite.value.picture = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newSite.value.id = item.id;
  newSite.value.name = item.name;
  newSite.value.address = item.address;
  newSite.value.description = item.description;
  newSite.value.picture = item.picture;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Sites
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && user.userType == 'Admin'" color="accent" @click="openAdd()"
            >Add</v-btn
          >
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Address</th>
            <th class="text-left">Description</th>
            <th class="text-left">Image</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sites" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.description }}</td>
            <td>
              <div style="max-height:auto; max-width:100%; width: auto;">
                <img v-if="item.picture !== null" v-bind:src="'data:image/jpeg;base64,'+item.picture" style="height: 300px; width: auto; object-fit:cover"/>
              </div>
            </td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Site" : isEdit ? "Edit Site" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newSite.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newSite.address"
              label="Address"
              required
            ></v-text-field>
            <v-text-field
              v-model="newSite.description"
              label="Description"
              required
            ></v-text-field>
            <upload-image
              :newSite="newSite"
              v-model="newSite.picture"
              label="Picture"
              ref="img"
            ></upload-image>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAdd ? closeAdd() : isEdit ? closeEdit() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAdd ? addSite() : isEdit ? updateSite() : false
              "
              >{{
                isAdd ? "Add Site" : isEdit ? "Update Site" : ""
              }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
