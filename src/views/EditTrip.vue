<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import DatePicker from "vue3-datepicker";
import TripServices from "../services/TripServices";
import HotelServices from "../services/HotelServices.js";
import SiteServices from "../services/SiteServices.js";

const sites = ref([]);
const route = useRoute();
const hotels = ref([]);
const trip = ref({});
const showCalendarDialog = ref(false);
const selectedDates = ref([]);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getTrip();
  await getHotels();
  await getSites();
});
// async function getHotelsByDate() {
//   const start = new Date(trip.value.startDate);
//   const end = new Date(trip.value.endDate);
//   const dayCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
//   hotels.value = Array.from({ length: dayCount }, () => ({}));

//   const formattedStartDate = start.toISOString().substr(0, 10);
//   const formattedEndDate = end.toISOString().substr(0, 10);

//   await HotelServices.getHotelsByDate(formattedStartDate, formattedEndDate)
//     .then((response) => {
//       const hotelsData = response.data;
//       hotelsData.forEach((hotel, index) => {
//         hotels.value[index] = { date: hotel.date, name: hotel.name };
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       snackbar.value.value = true;
//       snackbar.value.color = "error";
//       snackbar.value.text = error.response.data.message;
//     });
// }
async function getSites() {
  await SiteServices.getSites()
    .then((response) => {
      sites.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}
async function getHotels() {
  await HotelServices.getHotels()
    .then((response) => {
      hotels.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

const formattedStartDate = computed(() => {
  if (trip.value.startDate) {
    const date = new Date(trip.value.startDate);
    return date.toISOString().substr(0, 10);
  }
  return null;
});
const formattedEndDate = computed(() => {
  if (trip.value.endDate) {
    const date = new Date(trip.value.endDate);
    return date.toISOString().substr(0, 10);
  }
  return null;
});

const dateRange = computed(() => {
  if (trip.value.startDate && trip.value.endDate) {
    const start = new Date(trip.value.startDate);
    const end = new Date(trip.value.endDate);
    const dayCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return Array.from({ length: dayCount }, (_, index) => {
      const date = new Date(start);
      date.setDate(date.getDate() + index);
      return date.toISOString().substr(0, 10);
    });
  }
  return [];
});

function planTrip() {
  // ... existing code ...
  openCalendarDialog();
  //getHotelsByDate();
}

async function getTrip() {
  await TripServices.getTrip(route.params.id)
    .then((response) => {
      trip.value = response.data;
    })

    .catch((error) => {
      console.log(error);
    });
}

function openCalendarDialog() {
  selectedDates.value = [trip.value.startDate, trip.value.endDate];
  showCalendarDialog.value = true;
}

function closeCalendarDialog() {
  showCalendarDialog.value = false;
}

function confirmDateRange() {
  [trip.value.startDate, trip.value.endDate] = selectedDates.value;
  showCalendarDialog.value = false;
  //getHotelsByDate();
}

async function updateTrip() {
  await TripServices.updateTrip(trip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${trip.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  // getHotelsByDate();
  await getTrip();
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit Trip
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="trip.name"
                  label="Name"
                  required
                ></v-text-field>

                <v-text-field
                  v-bind:value="formattedStartDate"
                  v-model="trip.startDate"
                  type="date"
                  label="Start Date"
                ></v-text-field>
                <v-text-field
                  v-bind:value="formattedEndDate"
                  v-model="trip.endDate"
                  type="date"
                  label="End Date"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="trip.description"
                  rows="10"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="primary" @click="updateTrip()"
              >Update Trip</v-btn
            >
            <v-btn variant="flat" color="primary" @click="planTrip()"
              >Plan Trip</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-dialog v-model="showCalendarDialog">
          <!-- ... -->
          <v-card>
            <v-card-text>
              <DatePicker
                v-model="selectedDates"
                type="range"
                input-class="v-text-field"
                format="yyyy-MM-dd"
                :model-value="selectedDates"
              ></DatePicker>
              <div v-if="dateRange.length">
                <p>Selected Date Range:</p>
                <ul>
                  <li v-for="date in dateRange" :key="date">{{ date }}</li>
                </ul>
              </div>
            </v-card-text>
            <v-row v-for="(date, index) in dateRange" :key="index">
              <v-col cols="4">
                <v-text-field
                v-model="day"
                  :value="date"
                  type="date"
                  label="Date"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-autocomplete
                v-model="day"
                  :items="hotels.map((hotel) => hotel.name)"
                  label="Hotel Name"
                ></v-autocomplete>
                <v-autocomplete
                v-model="day"
                  :items="sites.map((site) => site.name)"
                  label="Site Name"
                ></v-autocomplete>
                 <v-btn color="accent"  @click="addData(index)">Add</v-btn>
              </v-col>
            </v-row>

            <v-card-actions>
              
              <v-btn @click="closeCalendarDialog">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-container>
</template>
