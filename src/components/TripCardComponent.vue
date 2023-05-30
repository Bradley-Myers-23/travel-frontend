<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TripDayServices from "../services/TripDayServices.js";
import TripDayServices from "../services/TripDayServices";

const router = useRouter();

const showDetails = ref(false);
const TripDays = ref([]);
const TripDays = ref([]);
const user = ref(null);

const props = defineProps({
  Trip: {
    required: true,
  },
});

onMounted(async () => {
  await getTripDays();
  await getTripDays();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getTripDays() {
  await TripDayServices.getTripDaysForTrip(props.Trip.id)
    .then((response) => {
      TripDays.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getTripDays() {
  await TripDayServices.getTripDaysForTripWithDays(
    props.Trip.id
  )
    .then((response) => {
      TripDays.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function navigateToEdit() {
  router.push({ name: "editTrip", params: { id: props.Trip.id } });
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
          {{ Trip.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ Trip.servings }} Servings
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ Trip.time }} minutes
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
      {{ Trip.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Days</h3>
        <v-list>
          <v-list-item
            v-for="TripDay in TripDays"
            :key="TripDay.id"
          >
            <b
              >{{ TripDay.quantity }}
              {{
                `${TripDay.Day.unit}${
                  TripDay.quantity > 1 ? "s" : ""
                }`
              }}</b
            >
            of {{ TripDay.Day.name }} (${{
              TripDay.Day.pricePerUnit
            }}/{{ TripDay.Day.unit }})
          </v-list-item>
        </v-list>
        <h3>Trip Days</h3>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Day</th>
              <th class="text-left">Instruction</th>
              <th class="text-left">Days</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="Day in TripDays" :key="Day.id">
              <td>{{ Day.DayNumber }}</td>
              <td>{{ Day.instruction }}</td>
              <td>
                <v-chip
                  size="small"
                  v-for="Day in Day.TripDay"
                  :key="Day.id"
                  pill
                  >{{ Day.Day.name }}</v-chip
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
