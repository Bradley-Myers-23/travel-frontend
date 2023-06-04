<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import UserTypeServices from "../services/UserTypeServices.js";

const userTypes = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newUserType = ref({
  id: undefined,
  name: undefined,				 
  description: undefined,
});

onMounted(async () => {
  await getUserTypes();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getUserTypes() {
  await UserTypeServices.getUserTypes()
    .then((response) => {
      userTypes.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addUserType() {
  isAdd.value = false;
  delete newUserType.id;
  await UserTypeServices.addUserType(newUserType.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newUserType.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getUserTypes();
}

async function updateUserType() {
  isEdit.value = false;
  await UserTypeServices.updateUserType(newUserType.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newUserType.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getUserTypes();
}

function openAdd() {
  newUserType.value.name = undefined;									
  newUserType.value.description = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newUserType.value.id = item.id;
  newUserType.value.name = item.name;
  newUserType.value.description = item.description;
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
            >User Types
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Add</v-btn
          >
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>									  
            <th class="text-left">Description</th>
											  
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userTypes" :key="item.name">

            <td>{{ item.name }}</td>								   
            <td>{{ item.description }}</td>
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
              >{{ isAdd ? "Add User Type" : isEdit ? "Edit User Type" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>

            <v-text-field
              v-model="newUserType.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newUserType.description"
              label="Description"
              required
            ></v-text-field>
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
                isAdd ? addUserType() : isEdit ? updateUserType() : false
              "
              >{{
                isAdd ? "Add User Type" : isEdit ? "Update User Type" : ""
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
