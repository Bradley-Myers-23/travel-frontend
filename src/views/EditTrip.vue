<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import DayServices from "../services/DayServices.js";
import TripDayServices from "../services/TripDayServices";
import TripDayServices from "../services/TripDayServices";
import TripServices from "../services/TripServices";

const route = useRoute();

const Trip = ref({});
const Days = ref([]);
const selectedDay = ref({});
const TripDays = ref([]);
const TripDays = ref([]);
const isAddDay = ref(false);
const isEditDay = ref(false);
const isAddDay = ref(false);
const isEditDay = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newDay = ref({
  id: undefined,
  DayNumber: undefined,
  instruction: undefined,
  TripId: undefined,
  TripDay: [],
});
const newDay = ref({
  id: undefined,
  quantity: undefined,
  TripId: undefined,
  TripDayId: undefined,
  DayId: undefined,
});

onMounted(async () => {
  await getTrip();
  await getTripDays();
  await getDays();
  await getTripDays();
});

async function getTrip() {
  await TripServices.getTrip(route.params.id)
    .then((response) => {
      Trip.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateTrip() {
  await TripServices.updateTrip(Trip.value.id, Trip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${Trip.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTrip();
}

async function getDays() {
  await DayServices.getDays()
    .then((response) => {
      Days.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getTripDays() {
  await TripDayServices.getTripDaysForTrip(route.params.id)
    .then((response) => {
      TripDays.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addDay() {
  isAddDay.value = false;
  newDay.value.TripId = Trip.value.id;
  newDay.value.DayId = selectedDay.value.id;
  delete newDay.value.id;
  await TripDayServices.addTripDay(newDay.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Day added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripDays();
}

async function updateDay() {
  isEditDay.value = false;
  newDay.value.TripId = Trip.value.id;
  newDay.value.DayId = selectedDay.value.id;
  console.log(newDay);

  await TripDayServices.updateTripDay(newDay.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${selectedDay.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripDays();
}

async function deleteDay(Day) {
  await TripDayServices.deleteTripDay(Day)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${Day.Day.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripDays();
}

async function checkUpdateDay() {
  if (newDay.value.TripDay.length > 0) {
    console.log(newDay.value.TripDay);
    for (let i = 0; i < newDay.value.TripDay.length; i++) {
      newDay.value.id = newDay.value.TripDay[i].id;
      newDay.value.quantity = newDay.value.TripDay[i].quantity;
      newDay.value.TripDayId = newDay.value.id;
      selectedDay.value.id =
        newDay.value.TripDay[i].DayId;
      await updateDay();
    }
  }
}

async function getTripDays() {
  await TripDayServices.getTripDaysForTripWithDays(
    route.params.id
  )
    .then((response) => {
      TripDays.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addDay() {
  isAddDay.value = false;
  newDay.value.TripId = Trip.value.id;
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

  await checkUpdateDay();

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

  await checkUpdateDay();

  await getTripDays();
}

async function deleteDay(Day) {
  await TripDayServices.deleteTripDay(Day)
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

function openAddDay() {
  newDay.value.id = undefined;
  newDay.value.quantity = undefined;
  newDay.value.TripDayId = undefined;
  newDay.value.DayId = undefined;
  selectedDay.value = undefined;
  isAddDay.value = true;
}

function openEditDay(Day) {
  newDay.value.id = Day.id;
  newDay.value.quantity = Day.quantity;
  newDay.value.TripDayId = Day.TripDayId;
  newDay.value.DayId = Day.DayId;
  selectedDay.value = Day.Day;
  isEditDay.value = true;
}

function openAddDay() {
  newDay.value.id = undefined;
  newDay.value.DayNumber = undefined;
  newDay.value.instruction = undefined;
  newDay.value.TripDay = [];
  isAddDay.value = true;
}

function openEditDay(Day) {
  newDay.value.id = Day.id;
  newDay.value.DayNumber = Day.DayNumber;
  newDay.value.instruction = Day.instruction;
  newDay.value.TripDay = Day.TripDay;
  isEditDay.value = true;
}

function closeAddDay() {
  isAddDay.value = false;
}

function closeEditDay() {
  isEditDay.value = false;
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
                  v-model="Trip.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.number="Trip.servings"
                  label="Number of Servings"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="Trip.time"
                  label="Time to Make (in minutes)"
                  type="number"
                ></v-text-field>
                <v-switch
                  v-model="Trip.isPublished"
                  hide-details
                  inset
                  :label="`Publish? ${Trip.isPublished ? 'Yes' : 'No'}`"
                ></v-switch>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="Trip.description"
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
                ><v-card-title class="headline">Days </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddDay()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
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
                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditDay(TripDay)"
                    ></v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteDay(TripDay)"
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
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditDay(Day)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteDay(Day)"
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
      :model-value="isAddDay || isEditDay"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">{{
          isAddDay
            ? "Add Day"
            : isEditDay
            ? "Edit Day"
            : ""
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="newDay.quantity"
                label="Quantity"
                type="number"
                required
              >
              </v-text-field>
            </v-col>

            <v-col>
              <v-select
                v-model="selectedDay"
                :items="Days"
                item-title="name"
                item-value="unit"
                label="Days"
                return-object
                required
              >
                <template v-slot:prepend>
                  {{
                    `${
                      selectedDay && selectedDay.unit
                        ? selectedDay.unit
                        : ""
                    }${newDay.quantity > 1 ? "s" : ""}`
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
              isAddDay
                ? closeAddDay()
                : isEditDay
                ? closeEditDay()
                : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="
              isAddDay
                ? addDay()
                : isEditDay
                ? updateDay()
                : false
            "
            >{{
              isAddDay
                ? "Add Day"
                : isEditDay
                ? "Update Day"
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
            v-model="newDay.DayNumber"
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
            v-model="newDay.TripDay"
            :items="TripDays"
            item-title="Day.name"
            item-value="id"
            label="Days"
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
