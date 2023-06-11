
<script setup>
import { onMounted, computed } from "vue";
import { ref } from "vue";
import HotelServices from "../services/HotelServices.js";

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



const hotels = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newHotel = ref({
  id: undefined,
  name: undefined,
  PhoneNumber: undefined,
  Address1: undefined,
  Address2: undefined,
  State: undefined,
  City: undefined,
  Link: undefined,
});

onMounted(async () => {
  await getHotels();
  user.value = JSON.parse(localStorage.getItem("user"));
});

function formatPhoneNumber(phoneNumber) {
  // Assuming the phone number is in a standard format like "1234567890"
  const areaCode = phoneNumber.slice(0, 3);
  const firstPart = phoneNumber.slice(3, 6);
  const secondPart = phoneNumber.slice(6);
  
  // Format the phone number as "(123) 456-7890"
  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];


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

async function addHotel() {
  isAdd.value = false;
  delete newHotel.id;
  await HotelServices.addHotel(newHotel.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newHotel.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getHotels();
}

async function updateHotel() {
  isEdit.value = false;
  await HotelServices.updateHotel(newHotel.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newHotel.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getHotels();
}

function openAdd() {
  newHotel.value.name = undefined;
  newHotel.value.PhoneNumber = undefined;
  newHotel.value.Address1 = undefined;
  newHotel.value.Address2 = undefined;
  newHotel.value.State = undefined;
  newHotel.value.City = undefined;
  newHotel.value.ZipCode = undefined;
  newHotel.value.Link = undefined;
  isAdd.value = true;

}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newHotel.value.id = item.id;
  newHotel.value.name = item.name;
  newHotel.value.PhoneNumber = item.PhoneNumber;
  newHotel.value.Address1 = item.Address1;
  newHotel.value.Address2 = item.Address2;
  newHotel.value.State = item.State;
  newHotel.value.City = item.City;
  newHotel.value.ZipCode = item.ZipCode;
  newHotel.value.Link = item.Link;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Hotels
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && user.userType == 'Admin'" color="accent" @click="openAdd()"
            >Add</v-btn
          >
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Phone Number</th>
            <th class="text-left">Address</th>
            <th class="text-left">Link</th>
            <th class="text-left">Actions</th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in hotels" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ formatPhoneNumber(item.PhoneNumber) }}</td>
            <td>
              <div>
                <span>{{ item.Address1 }}</span>
                <br />
                <span>{{ item.Address2 }}</span>
                <br />
                <span>{{ item.State }}, {{ item.City }} , {{ item.ZipCode }} </span>
                <br />
                
              </div>
            </td>
            <td>
               <a v-if="isValidURL(item.Link)" :href="formatURL(item.Link)" target="_blank">
                {{ item.Link }}
               </a>
               <span v-else>{{ item.Link }}</span>
            </td>


            <td>
              <v-icon size="small" icon="mdi-pencil" @click="openEdit(item)"></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Hotel" : isEdit ? "Edit Hotel" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newHotel.name"
              label="Name"
              required
            ></v-text-field>
            
            
            <v-text-field
              v-model="newHotel.PhoneNumber"
              label="Phone Number"
              type="PhoneNumber"
            ></v-text-field>
            <v-text-field
              v-model="newHotel.Address1"
              label="Address1"
              type="Address1"
            ></v-text-field>
            <v-text-field
              v-model="newHotel.Address2"
              label="Address2(Opptional)"
              type="Address2"
            ></v-text-field>
            <v-select
            v-model="newHotel.State"
            :items="states"
            label="State"
            required
          ></v-select>
            <v-text-field
              v-model="newHotel.City"
              label="City"
              type="City"
            ></v-text-field>
            <v-text-field
              v-model="newHotel.ZipCode"
              label="Zip Code"
              type="ZipCode"
            ></v-text-field>
            <v-text-field
              v-model="newHotel.Link"
              label="Link"
              type="Link"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAdd ? closeAdd() : isEdit ? closeEdit() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAdd ? addHotel() : isEdit ? updateHotel() : false
              "
              >{{
                isAdd ? "Add Hotel" : isEdit ? "Update Hotel" : ""
              }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
