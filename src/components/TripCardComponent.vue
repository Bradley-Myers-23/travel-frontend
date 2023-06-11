<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import HotelDayServices from "../services/HotelDayServices.js";
import TripSiteServices from "../services/TripSiteServices.js";
import TripDayServices from "../services/TripDayServices.js";
import UserServices from "../services/UserServices";
import UserTripServices from "../services/UserTripServices";

const router = useRouter();

const selectedSite = ref({});
const selectedHotel = ref({});
const selectedUser = ref({});
const isViewHotel = ref(false);
const isViewSite = ref(false);
const isViewUser = ref(false);
const showDetails = ref(false);
const hotelDays = ref([]);
const tripSites = ref([]);
const tripDays = ref([]);
const isAddUser = ref(false);
const users = ref([]);
const user = ref(null);
const userTrips = ref([]);
const userTrip = ref({
  tripId: undefined,
  userId: undefined,
  headCount: undefined
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const props = defineProps({
  trip: {
    required: true,
  },
});

onMounted(async () => {
  await getTripSites();
  await getHotelDays();
  await getTripDays();
  await getUserTrips();
  await getUsers();
  user.value = JSON.parse(localStorage.getItem("user"));
  console.log(user.value);
});

async function getHotelDays() {
  await HotelDayServices.getHotelDaysForTrip(props.trip.id)
    .then((response) => {
      hotelDays.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getTripSites() {
  await TripSiteServices.getTripSitesForTrip(props.trip.id)
    .then((response) => {
      tripSites.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getTripDays() {
  await TripDayServices.getTripDaysForTripWithData(
    props.trip.id
  )
    .then((response) => {
      tripDays.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getUserTrips() {
  await UserTripServices.getUserForTrip(props.trip.id)
    .then((response) => {
      userTrips.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getUsers() {
  await UserServices.getUser()
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}


function navigateToEdit() {
  router.push({ name: "editTrip", params: { id: props.trip.id } });
}

async function addUserToTrip(user) {
  userTrip.value.userId = user.id;
  userTrip.value.tripId = props.trip.id;
  userTrip.value.headCount = 1;
  userTrip.userId = user.id;
  userTrip.tripId = props.trip.id;
  userTrip.headCount = 1;
  isAddUser.value = false;

  await UserTripServices.addUserTrip( userTrip)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `User for Trip added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getUserTrips();
  await getUsers();
}

async function removeUserFromTrip(user) {
  isViewUser.value = false;
  
  await UserTripServices.deleteUserTrip(user)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `User for Trip removed successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getUserTrips();
  await getUsers();
}

function editDates(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 10);;
}

function formatPhoneNumber(phoneNumber) {
  // Assuming the phone number is in a standard format like "1234567890"
  const areaCode = phoneNumber.slice(0, 3);
  const firstPart = phoneNumber.slice(3, 6);
  const secondPart = phoneNumber.slice(6);
  
  // Format the phone number as "(123) 456-7890"
  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

function openAddUser() {
  isAddUser.value = true;
}

function closeAddUser() {
  isAddUser.value = false;
}

function openUserDetails(user) {
  selectedUser.value = user.user;
  selectedUser.value.id = user.id;
  isViewUser.value = true;
}

function closeUserDetails() {
  isViewUser.value = false;
}

function openHotelDetails(hotel) {
  selectedHotel.value = hotel.hotel;
  isViewHotel.value = true;
}

function closeHotelDetails() {
  isViewHotel.value = false;
}

function openSiteDetails(site) {
  selectedSite.value = site.site;
  isViewSite.value = true;
}

function closeSiteDetails() {
  isViewSite.value = false;
}

function isValidURL(url) {
  const pattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/i;
  return pattern.test(url);
}

function formatURL(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `http://${url}`;
  }
  return url;
}
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = (!isViewHotel && !isViewSite && !isViewUser && !isAddUser) ? !showDetails : showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ trip.name }}
          <v-chip class="ma-2" color="primary" label>
            {{ trip.startDate.slice(0,10)}} 
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            {{ trip.endDate.slice(0,10) }} 
          </v-chip>
          <v-chip class="ma-2" label>
            Last Updated: {{ trip.updatedAt}} 
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-left">
          <v-icon
            v-if="user !== null && user.userType == 'Admin'"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-account"
            @click="openAddUser()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ trip.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Travellers On This Trip </h3>
 
        <v-chip
          size="small"
          v-for="userTrip in userTrips"
          :key="userTrip.id"
          pill
          @click="openUserDetails(userTrip)"
          >
            {{ userTrip.user.firstName }} 
            {{ userTrip.user.lastName }}
        </v-chip>

        <br><br>
        <h3>Calendar</h3>
        <br>
        <v-table>
          <tbody>
            <tr>
              <td>Day Number</td>
              <td>Hotel</td>
              <td>Sites</td>
            </tr>
            <tr v-for="day in tripDays" :key="day.id">
              <td>Day {{ day.dayNumber }}: {{ editDates(trip.startDate, day.dayNumber-1)  }}</td>
              <td>
                <v-chip
                  size="small"
                  v-for="hotel in day.hotelDay"
                  :key="hotel.id"
                  pill
                  @click="openHotelDetails(hotel)"
                  >{{ hotel.hotel.name }}</v-chip
                ><br>
              </td>
              <td>
                <v-chip
                  size="small"
                  v-for="site in day.tripSite"
                  :key="site.id"
                  pill
                  @click="openSiteDetails(site)"
                  >{{ site.site.name }}</v-chip
                ><br>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      
    </v-expand-transition>
  </v-card>

  <v-dialog
      persistent
      :model-value="isViewHotel"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          Hotel Details
        </v-card-title>
        <v-card-text>
          <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Phone Number</th>
            <th class="text-left">Address</th>
            <th class="text-left">Website</th>
          </tr>
        </thead>
          <tbody
          >
            <tr>
              <td>{{ selectedHotel.name }}</td>
              <td>{{ formatPhoneNumber(selectedHotel.PhoneNumber) }}</td>
              <td>
                <div>
                  <span>{{ selectedHotel.Address1 }}</span>
                  <br />
                  <span>{{ selectedHotel.Address2 }}</span>
                  <br />
                  <span>{{ selectedHotel.State }}, {{ selectedHotel.City }} , {{ selectedHotel.ZipCode }} </span>
                </div>
              </td>
              <td>
                <a v-if="isValidURL(selectedHotel.Link)" :href="formatURL(selectedHotel.Link)" target="_blank">
                {{ selectedHotel.Link }}
               </a>
               <span v-else>{{ selectedHotel.Link }}</span>
              </td>
            </tr>
          </tbody>
      </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeHotelDetails()"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      :model-value="isViewSite"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          Site Details
        </v-card-title>
        <v-card-text>
          <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Address</th>
            <th class="text-center">Description</th>
            <th v-if="selectedSite.picture !== null" class="text-center">Image</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{ selectedSite.name }}</td>
            <td class="text-center">{{ selectedSite.address }}</td>
            <td class="text-center">{{ selectedSite.description }}</td>
            <td v-if="selectedSite.picture !== null">
                <img v-if="selectedSite.picture !== null" v-bind:src="'data:image/jpeg;base64,'+selectedSite.picture" 
                style="text-align: center;margin-left: 25%;width: 50%;"/>
            </td>
          </tr>
        </tbody>
      </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeSiteDetails()"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      :model-value="isViewUser"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          User Details
        </v-card-title>
        <v-card-text>
          <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</td>
            <td>
              <v-icon
                v-if="user !== null && user.userType == 'Admin'"
                class="mx-2"
                size="x-small"
                icon="mdi-trash-can"
                @click="removeUserFromTrip(selectedUser)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeUserDetails()"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      :model-value="isAddUser"
      width="800"
    >
    <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          Add Users
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-list>
                <v-list-item v-if="user !== null && user.userType == 'Admin'" v-for="user in users" :key="user.id" @click="addUserToTrip(user)">
                  <v-row align="center">
                    <v-col cols="6">
                      <v-list-item-content>
                        <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item v-if="user !== null && user.userType !== 'Admin'" @click="addUserToTrip(user)">
                  <v-row align="center">
                    <v-col cols="6">
                      <v-list-item-content>
                        <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeAddUser()"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    
</template>
