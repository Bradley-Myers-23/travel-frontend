<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import hotelDayServices from "../services/HotelDayServices.js";
import tripSiteServices from "../services/TripSiteServices.js";
import tripDayServices from "../services/TripDayServices.js";
import UserServices from "../services/UserServices";
import UserTripServices from "../services/UserTripServices";

const router = useRouter();

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
  await getTripDays();
  await getUserTrips();
  await getUsers();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getTripSites() {
  await tripSiteServices.getTripSitesForTrip(props.trip.id)
    .then((response) => {
      tripSites.value = response.data;
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

async function getTripDays() {
  await tripDayServices.getTripDaysForTrip(props.trip.id)
    .then((response) => {
      tripDays.value = response.data;
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
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
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
        <h2>Travellers Per Trip </h2>
 
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
        <v-list class="body-1"
            v-for="day in tripDays"
            :key="day.id"
          >
            <b>Day {{ day.dayNumber}} </b>
            <v-list-item
                  v-for="site in day.tripSite"
                  :key="site.id"
                  >{{ site.site.name }}</v-list-item
                >
          </v-list>
        <h4> {{UserServices.getUser.value}}</h4>

      </v-card-text>
      
    </v-expand-transition>
  </v-card>
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
