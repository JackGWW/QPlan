<template>
  <div class="mx-2">
    <v-card class="ma-1 elevation-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-contact-mail</v-icon>Contact
      </v-card-title>
      <v-card-text class="ml-3">
        <v-row>Name: {{ contactInfo.name }}</v-row>
        <v-row>Position: {{ contactInfo.position }}</v-row>
        <v-row>
          Email:
          <a :href="emailLink" style="text-decoration: underline;"> {{ contactInfo.emailAddr }}</a>
        </v-row>
        <v-row>Location: {{ contactInfo.location }}</v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Contact",
  computed: {
    ...mapGetters(["contactInfo"]),
    emailLink() {
      return "mailto:" + this.contactInfo.emailAddr;
    }
  }
};
</script>