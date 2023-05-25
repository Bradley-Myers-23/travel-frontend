<script setup>
import { onMounted, ref } from "vue";
import TripsServices from "../services/TripsServices.js";

const trips = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newTrip = ref({
  id: undefined,
  description: undefined,
  fromDate: undefined,
  toDate: undefined,
});

onMounted(async () => {
  await getTrips();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getTrips() {
  await TripServices.getTrips()
    .then((response) => {
      trips.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addTrip() {
  isAdd.value = false;
  delete newTrip.id;
  await TripServices.addTrip(newTrip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newTrip.value.description} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTrips();
}

async function updateTrip() {
  isEdit.value = false;
  await TripServices.updateTrip(newTrip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newTrip.description} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTrips();
}

function openAdd() {
  newTrip.value.description = undefined;
  newTrip.value.fromDate = undefined;
  newTrip.value.toDate = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newTrip.value.id = item.id;
  newTrip.value.description = item.description;
  newTrip.value.fromDate = item.fromDate;
  newTrip.value.toDate = item.toDate;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>
