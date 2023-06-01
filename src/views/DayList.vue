<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import DayServices from "../services/DayServices.js";

const days = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newDay = ref({
  id: undefined,
  dayId: undefined,
  name: undefined,
					 
  description: undefined,
});

onMounted(async () => {
  await getDays();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getDays() {
  await DayServices.getDays()
    .then((response) => {
      days.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addDay() {
  isAdd.value = false;
  delete newDay.id;
  await DayServices.addDay(newDay.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newDay.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getDays();
}

async function updateDay() {
  isEdit.value = false;
  await DayServices.updateDay(newDay.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newDay.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getDays();
}

function openAdd() {
  newDay.value.dayId = undefined;
  newDay.value.name = undefined;
									
  newDay.value.description = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newDay.value.id = item.id;
  newDay.value.dayId = item.dayId;
  newDay.value.name = item.name;
  newDay.value.description = item.description;
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
            >Days
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
            <th class="text-left">Day Id</th>
            <th class="text-left">Name</th>
											  
            <th class="text-left">Description</th>
											  
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in days" :key="item.dayId">
            <td>{{ item.dayId }}</td>
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
              >{{ isAdd ? "Add Day" : isEdit ? "Edit Day" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newDay.dayId"
              label="Day Id"
              required
            ></v-text-field>
            <v-text-field
              v-model="newDay.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newDay.description"
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
                isAdd ? addDay() : isEdit ? updateDay() : false
              "
              >{{
                isAdd ? "Add Day" : isEdit ? "Update Day" : ""
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
