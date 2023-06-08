<script setup>

import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import SiteServices from "../services/SiteServices.js";
import TripSiteServices from "../services/TripSiteServices.js";
import TripDayServices from "../services/TripDayServices.js";
import TripServices from "../services/TripServices.js";
import HotelServices from "../services/HotelServices.js";

const route = useRoute();

const trip = ref({});
const sites = ref([]);
const selectedSite = ref({});
const tripSites = ref([]);
const tripDays = ref([]);
const isAddSite = ref(false);
const isEditSite = ref(false);
const isAddDay = ref(false);
const isEditDay = ref(false);
const hotels = ref([]);
const showCalendarDialog = ref(false);
const selectedDates = ref([]);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newDay = ref({
  id: undefined,
  dayNumber: undefined,
  instruction: undefined,
  tripId: undefined,
  tripSite: [],
});
const newSite = ref({
  id: undefined,
  quantity: undefined,
  tripId: undefined,
  tripDayId: undefined,
  siteId: undefined,
});

onMounted(async () => {
  await getTrip();
  await getTripSites();
  await getHotels();
  await getSites();
  await getTripDays();
});

async function getTrip() {
  await TripServices.getTrip(route.params.id)
    .then((response) => {
      trip.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateTrip() {
  await TripServices.updateTrip(trip.value.id, trip.value)
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
  await getTrip();
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

async function getTripSites() {
  await TripSiteServices.getTripSitesForTrip(route.params.id)
    .then((response) => {
      tripSites.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addSite() {
  isAddSite.value = false;
  newSite.value.tripId = trip.value.id;
  newSite.value.siteId = selectedSite.value.id;
  delete newSite.value.id;
  await TripSiteServices.addTripSite(newSite.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Site added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripSites();
}

async function updateSite() {
  isEditSite.value = false;
  newSite.value.tripId = trip.value.id;
  newSite.value.siteId = selectedSite.value.id;
  console.log(newSite);

  await TripSiteServices.updateTripSite(newSite.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${selectedSite.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripSites();
}

async function deleteSite(site) {
  await TripSiteServices.deleteTripSite(site)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${site.site.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripSites();
}

async function checkUpdateSite() {
  if (newDay.value.tripSite.length > 0) {
    console.log(newDay.value.tripSite);
    for (let i = 0; i < newDay.value.tripSite.length; i++) {
      newSite.value.id = newDay.value.tripSite[i].id;
      newSite.value.quantity = newDay.value.tripSite[i].quantity;
      newSite.value.tripDayId = newDay.value.id;
      selectedSite.value.id =
        newDay.value.tripSite[i].siteId;
      await updateSite();
    }
  }
}

async function getTripDays() {
  await TripDayServices.getTripDaysForTripWithSites(
    route.params.id
  )
    .then((response) => {
      tripDays.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addDay() {
  isAddDay.value = false;
  newDay.value.tripId = trip.value.id;
  delete newDay.value.id;
  await TripDayServices.addTripDay(newDay.value)
    .then((data) => {
      newDay.value.id = data.data.id;
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Day added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateSite();

  await getTripDays();
}

async function updateDay() {
  isEditDay.value = false;
  await TripDayServices.updateTripDay(newDay.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Day updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateSite();

  await getTripDays();
}

async function deleteDay(day) {
  await TripDayServices.deleteTripDay(day)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Day deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getTripDays();
}

function openAddSite() {
  newSite.value.id = undefined;
  newSite.value.quantity = undefined;
  newSite.value.tripDayId = undefined;
  newSite.value.siteId = undefined;
  selectedSite.value = undefined;
  isAddSite.value = true;
}

function openEditSite(site) {
  newSite.value.id = site.id;
  newSite.value.quantity = site.quantity;
  newSite.value.tripDayId = site.tripDayId;
  newSite.value.siteId = site.siteId;
  selectedSite.value = site.site;
  isEditSite.value = true;
}

function openAddDay() {
  newDay.value.id = undefined;
  newDay.value.dayNumber = undefined;
  newDay.value.instruction = undefined;
  newDay.value.tripSite = [];
  isAddDay.value = true;
}

function openEditDay(day) {
  newDay.value.id = day.id;
  newDay.value.dayNumber = day.dayNumber;
  newDay.value.instruction = day.instruction;
  newDay.value.tripSite = day.tripSite;
  isEditDay.value = true;
}

function closeAddSite() {
  isAddSite.value = false;
}

function closeEditSite() {
  isEditSite.value = false;
}

function closeAddDay() {
  isAddDay.value = false;
}

function closeEditDay() {
  isEditDay.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
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

function planTrip() {
  // ... existing code ...
  openCalendarDialog();
  //getHotelsByDate();
}

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
                  v-model.number="trip.servings"
                  label="Number of Servings"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="trip.time"
                  label="Time to Make (in minutes)"
                  type="number"
                ></v-text-field>
                <v-switch
                  v-model="trip.isPublished"
                  hide-details
                  inset
                  :label="`Publish? ${trip.isPublished ? 'Yes' : 'No'}`"
                ></v-switch>
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
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Sites </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddSite()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="tripSite in tripSites"
                :key="tripSite.id"
              >
                <b
                  >{{ tripSite.quantity }}
                  {{
                    `${tripSite.site.unit}${
                      tripSite.quantity > 1 ? "s" : ""
                    }`
                  }}</b
                >
                of {{ tripSite.site.name }} (${{
                  tripSite.site.pricePerUnit
                }}/{{ tripSite.site.unit }})
                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditSite(tripSite)"
                    ></v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteSite(tripSite)"
                    ></v-icon>
                  </v-row>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Days </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddDay()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
              <tbody>
                <tr v-for="day in tripDays" :key="day.id">
                  <td>{{ day.dayNumber }}</td>
                  <td>{{ day.instruction }}</td>
                  <td>
                    <v-chip
                      size="small"
                      v-for="site in day.tripSite"
                      :key="site.id"
                      pill
                      >{{ site.site.name }}</v-chip
                    >
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditDay(day)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteDay(day)"
                    >
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text> </v-card
      ></v-col>
    </v-row>

    <v-dialog
      persistent
      :model-value="isAddSite || isEditSite"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">{{
          isAddSite
            ? "Add Site"
            : isEditSite
            ? "Edit Site"
            : ""
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="newSite.quantity"
                label="Quantity"
                type="number"
                required
              >
              </v-text-field>
            </v-col>

            <v-col>
              <v-select
                v-model="selectedSite"
                :items="sites"
                item-title="name"
                item-value="unit"
                label="Sites"
                return-object
                required
              >
                <template v-slot:prepend>
                  {{
                    `${
                      selectedSite && selectedSite.unit
                        ? selectedSite.unit
                        : ""
                    }${newSite.quantity > 1 ? "s" : ""}`
                  }}
                  of
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddSite
                ? closeAddSite()
                : isEditSite
                ? closeEditSite()
                : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="
              isAddSite
                ? addSite()
                : isEditSite
                ? updateSite()
                : false
            "
            >{{
              isAddSite
                ? "Add Site"
                : isEditSite
                ? "Update Site"
                : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isAddDay || isEditDay" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          {{ isAddDay ? "Add Day" : isEditDay ? "Edit Day" : "" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newDay.dayNumber"
            label="Number"
            type="number"
            required
          ></v-text-field>

          <v-textarea
            v-model="newDay.instruction"
            label="Instruction"
            required
          ></v-textarea>

          <v-select
            v-model="newDay.tripSite"
            :items="tripSites"
            item-title="site.name"
            item-value="id"
            label="Sites"
            return-object
            multiple
            chips
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddDay ? closeAddDay() : isEditDay ? closeEditDay() : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="isAddDay ? addDay() : isEditDay ? updateDay() : false"
            >{{
              isAddDay ? "Add Day" : isEditDay ? "Update Day" : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
