<script setup>
import { onMounted } from "vue";

const props = defineProps({
  TripDay: {
    required: true,
  },
});

onMounted(() => {});

const emit = defineEmits(["updateDay", "deleteDay"]);

const handleUpdate = (event) => {
  console.log(event);
  emit("updateDay", event.target);
};

const handleDelete = (event) => {
  emit("deleteDay", event.target);
};
</script>

<template>
  <v-list-item>
    {{ TripDay.DayNumber }}

    {{ TripDay.instruction }}

    <template v-slot:append>
      <v-icon
        size="x-small"
        icon="mdi-pencil"
        @click="handleUpdate(TripDay)"
      ></v-icon>
      <v-icon
        size="x-small"
        icon="mdi-trash-can"
        @click="handleDelete(TripDay)"
      ></v-icon>
    </template>

    <v-row>
      <!-- {{ TripDay.TripIngredient }} -->
    </v-row>
  </v-list-item>
</template>
