<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import DatePicker from "vue3-datepicker";
import TripServices from "../services/TripServices";
import HotelServices from "../services/HotelServices.js";
import SiteServices from "../services/SiteServices.js";
import DayServices from "../services/DayServices.js";
const selectedHotel = ref();
const sites = ref([]);
const route = useRoute();
const hotels = ref([]);
const hotelday = ref([]);
const hotelInfo = ref({});
const hotel = ref([]);

const hotelNameData = ref([]);

const trip = ref({});
const showCalendarDialog = ref(false);
const selectedDates = ref([]);
const isAddHotel = ref(false);
const hotelsForDay = ref({});

const newDay = ref({
  hotelId: null,
  day: null,
  tripId: null,
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getTrip();
  await getHotels();
  await getSites();
  await getHotel();
  await getHotelInfoByDate();
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

async function getHotelForDate(date) {
  const proposedDate = moment(date).format("YYYY-MM-DD") + "T00:00:00.000Z";
  await getHotel(); // Wait for the hotelsForDay to be fetched
  if (hotelsForDay.value?.length > 0) {
    hotelday.value = hotelsForDay.value.find(
      (item) => item.day === proposedDate
    );
    return hotelday.value ? hotelday.value.hotel : null;
  }
  return null;
}

async function getHotelInfoByDate() {
  for (const date of dateRange.value) {
    hotel.value = await getHotelForDate(date);
    hotelInfo.value[date] = hotel.value;
  }
  return hotelInfo;
}

// function hotelsForDayFilter(data) {
//   const localTime = moment(data).format("YYYY-MM-DD"); // store localTime
//   const proposedDate = `${moment(data).format("YYYY-MM-DD")}T00:00:00.000Z`;
//   hotelName = hotelsForDay.value.filter(
//     (item) => item.date === proposedDate
//   )[0];

// }

function addHotelEachDay(index) {
  newDay.value.id = undefined;
  newDay.value.day = dateRange.value[index];
  newDay.value.tripId = trip.value.id;
  isAddHotel.value = true;
}
function closeAddHotel() {
  isAddHotel.value = false;
}
async function getHotel() {
  await DayServices.gethotelforDay(trip.value.id)
    .then((response) => {
      hotelsForDay.value = response.data;

      // for (const data of hotelsForDay.value) {
      //   // var localTime = moment(date).format("YYYY-MM-DD"); // store localTime
      //   // var proposedDate = localTime + "T00:00:00.000Z";

      //   hotelNameData.value.push({ date: data.day, name: data.hotel.name });
      // }
      //const hotelsForDay = data.file;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addDay() {
  isAddHotel.value = false;
  newDay.value.hotelId = selectedHotel.value.id;

  delete newDay.id;
  await DayServices.addDay(newDay.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newDay.value.day} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}
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

    <v-row v-for="(date, index) in dateRange" :key="index">
  <v-col cols="9" class="hotel-info">
    <h2>{{ date }}</h2>
    <h3><strong>Hotel</strong></h3>
    <v-row v-if="hotelInfo[date]">
      <v-col>
        <strong> Name:</strong> {{ hotelInfo[date].name }}
      </v-col>
      <v-col>
        <strong>Address:</strong>
        {{ hotelInfo[date].Address1 || "No address available" }}
        {{ hotelInfo[date].Address2 }}
        {{ hotelInfo[date].City }},
        {{ hotelInfo[date].State }}
        {{ hotelInfo[date].ZipCode }}
      </v-col>
      <v-col>
        <strong>Phone:</strong> {{ hotelInfo[date].PhoneNumber || "No phone number available" }}
      </v-col>
    </v-row>
    <p v-else>No hotel available</p>
  </v-col>
  <v-col cols="3" class="d-flex align-center justify-end">
    <v-btn v-show="hotelInfo[date]" color="accent" @click="addData()">Update Hotel</v-btn>
  </v-col>
</v-row>



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
            <v-btn color="accent" v-show="d" @click="addHotelEachDay(index)"
              >Add Hotel</v-btn
            >
            <v-btn color="accent" @click="addData(index)">Add Site</v-btn>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-btn @click="closeCalendarDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isAddHotel" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2"> </v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedHotel"
            :items="hotels"
            item-title="name"
            item-value="id"
            label="Select"
            persistent-hint
            return-object
            single-line
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="secondary" @click="closeAddHotel()"
            >Close</v-btn
          >
          
          <v-btn  variant="flat" color="primary" @click="addDay()">{{
            Add
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
