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
const isViewHotel = ref(false);
const isViewSite = ref(false);
const showDetails = ref(false);
const hotelDays = ref([]);
const tripSites = ref([]);
const tripDays = ref([]);
const addUser = ref(false);
const users = ref([]);
const user = ref(null);
const userTrips = ref([]);
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
function openAdd() {
  addUser.value = true;
}


function closeDialog() {
  this.addUser = false;
}

function selectUser(user) {
  this.selectedUser = user;
}

async function addUserToTable(user) {
  const userId = user.id;
  const tripId = props.trip.id;
  await addUserToTrip(userId, tripId);
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
    @click="showDetails = (!isViewHotel && !isViewSite) ? !showDetails : showDetails"
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
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
         
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Add User</v-btn>
          </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ trip.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Travellers On This Trip </h3>
 
        <v-list>
          <v-list-item
            v-for="userTrip in userTrips"
            :key="userTrip.id"
          >
           
            <v-col cols = 2>
              {{ userTrip.user.firstName }}
              {{ " \xa0 "}}
              {{ userTrip.user.lastName }}
              </v-col>
            

          </v-list-item>
        </v-list>

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
            <th class="text-center">Image</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ selectedSite.name }}</td>
            <td>{{ selectedSite.address }}</td>
            <td>{{ selectedSite.description }}</td>
            <td>
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

  <v-dialog v-model="addUser">
      
      <v-card>             
        <v-list>               
          <v-list-item v-for="user in users" :key="user.id" @click="selectUser(user)">
          <v-list-item-content>
            <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn text @click="addUserToTable(user)">Add</v-btn>
          </v-list-item-action>
        </v-list-item>       
        </v-list>             
        <v-card-actions>     
          
        <v-btn color ="accent"  text @click="closeDialog()">Close</v-btn>             
        </v-card-actions>          
     </v-card>         
    </v-dialog>
    
</template>
