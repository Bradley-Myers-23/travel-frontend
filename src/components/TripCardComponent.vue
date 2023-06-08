<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import tripSiteServices from "../services/tripSiteServices.js";

const router = useRouter();

const showDetails = ref(false);
const tripSites = ref([]);
const user = ref(null);
const tripDate = ref([]);

const props = defineProps({
  trip: {
    required: true,
  },
});

onMounted(async () => {
  await getTripSites();

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
            <v-icon start icon="mdi-date-outline"></v-icon>
            {{ trip.startDate}} 
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-date-outline"></v-icon>
            {{ trip.endDate }} 
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
        <v-row v-for="(date, index) in dateRange" :key="index">
              <v-col cols="4">
                <v-text-field
                  :value="date"
                  type="date"
                  label="Date"
                  readonly
                ></v-text-field>
              </v-col>
              </v-row>
        <h3>Sites</h3>
        <v-list>
          <v-list-item
            v-for="tripSite in tripSites"
            :key="tripSite.id"
          >
            <b>{{ tripSite.site.name }}</b>
          </v-list-item>
        </v-list>
      </v-card-text>
      
    </v-expand-transition>
  </v-card>
</template>
