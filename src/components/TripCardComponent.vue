<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import tripSiteServices from "../services/TripSiteServices.js";
import tripDayServices from "../services/TripDayServices.js";

const router = useRouter();

const showDetails = ref(false);
const tripSites = ref([]);
const tripDays = ref([]);
const user = ref(null);

const props = defineProps({
  trip: {
    required: true,
  },
});

onMounted(async () => {
  await getTripSites();
  await getTripDays();

  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getTripSites() {
  await tripSiteServices.getTripSitesForTrip(props.trip.id)
    .then((response) => {
      tripSites.value = response.data;
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

function navigateToEdit() {
  router.push({ name: "editTrip", params: { id: props.trip.id } });
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
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ trip.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
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
      </v-card-text>
      
    </v-expand-transition>
  </v-card>
</template>
