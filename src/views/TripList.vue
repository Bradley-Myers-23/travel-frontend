<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import TripCard from "../components/TripCardComponent.vue";
import TripServices from "../services/TripServices.js";
import moment from "moment";
import TripDayServices from "../services/TripDayServices";

// import { useVuerify } from "vuetify";

// import { vDate } from '../../plugins/vuerify/lib/validators';

// useVuerify({
//   rules: {
//     vDate,
//   },
// });
const date = ref(new Date().toISOString().substr(0, 10));
const menu1 = ref(false);
const trips = ref([]);
const isAdd = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


// const computedDateFormattedMomentjs = computed(() => {
//   return date.value ? moment(date.value).format("dddd, MMMM Do YYYY") : "";
// });
// const computedDateFormattedDatefns = computed(() => {
//   return date.value ? format(date.value, "dddd, MMMM Do YYYY") : "";
// });
const newTrip = ref({
  name: "",
  description: "",
  startDate: null,
  endDate: null,
});

onMounted(async () => {
  await getTrips();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getTrips() {
  await TripServices.getTrips()

    .then((response) => {
      trips.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}
async function addTrip() {
  isAdd.value = false;
  newTrip.value.userId = user.value.id;

  await TripServices.addTrip(newTrip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newTrip.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTrips();
}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
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
            >Trips
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && user.userType == 'Admin'" color="accent" @click="openAdd()"
            >Add</v-btn
          >
        </v-col>
      </v-row>

      <TripCard
        v-for="trip in trips"
        :key="trip.id"
        :trip="trip"
        @deletedList="getLists()"
      />

      <v-dialog persistent v-model="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add Trip </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newTrip.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newTrip.startDate"
              type="date"
              label="Date"
            ></v-text-field>
            <v-text-field
              v-model="newTrip.endDate"
              type="date"
              label="End Date"
            ></v-text-field>
            <v-textarea
              v-model="newTrip.description"
              label="Description"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addTrip()"
              >Add Trip</v-btn
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
