<template>
  <div class="mx-2">
    <v-card class="my-2 elevation-4">
      <v-card-title>
        <v-icon class="mb-1 mr-2">mdi-account</v-icon>Profile
      </v-card-title>
      <v-card-text class="text--primary mb-n2">
        <v-row dense class="my-n2">
          <v-col class="ml-1">
            <span class="font-weight-bold">Discipline:</span>
            {{ userDiscipline }}
          </v-col>
          <v-col>
            <span class="font-weight-bold">Start Year:</span>
            {{ userStartYear }} (Sci'{{ sciYear }})
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row dense class="mx-2 mb-n5">
          <v-col>
            <v-select
              v-model="discipline"
              outlined
              menu-props="offset-y"
              :items="validDisciplines"
              label="Change Discpline"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="startYear"
              outlined
              menu-props="offset-y"
              :items="validStartYears"
              label="Change Start Year"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="changedYearOrDiscipline">
          <v-row>
            <v-spacer />
            <v-btn rounded class="mb-3" @click="updateProfile" color="green">Apply Changes</v-btn>
            <v-spacer />
          </v-row>
        </div>
      </v-expand-transition>
    </v-card>
    <v-card class="elevation-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-security</v-icon>Login
      </v-card-title>
      <v-card-text class="text--primary mb-n6 mt-n4 ml-1">
        <v-row>
          <v-col class="mt-2">
            <span class="font-weight-bold">Email:</span>
            {{ userEmail }}
          </v-col>
          <v-col>
            <v-tooltip bottom nudge-bottom="-2" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn @click="resetPassword()" v-on="on" color="error">Change Password</v-btn>
              </template>
              <span>Send password reset email</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbarPassword" color="success" :timeout="snackbarTimeout">
      <v-spacer />Password reset email sent
      <v-spacer />
    </v-snackbar>
    <v-snackbar v-model="snackbarProfile" color="success" :timeout="snackbarTimeout">
      <v-spacer />Profile updated successfully
      <v-spacer />
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      discipline: undefined,
      startYear: undefined,
      snackbarPassword: false,
      snackbarProfile: false,
      snackbarTimeout: 5000
    };
  },
  computed: {
    ...mapState([
      "validDisciplines",
      "userDiscipline",
      "userEmail",
      "userStartYear",
      "firstName",
      "lastName",
      "apiUrl"
    ]),
    validStartYears() {
      let year = new Date().getFullYear();
      let numOptions = 6;
      let validYears = [];

      var i = numOptions;
      while (i >= 0) {
        validYears.push(year - i);
        i--;
      }
      return validYears;
    },
    sciYear() {
      return String(this.userStartYear + 4).substr(-2);
    },
    changedYearOrDiscipline() {
      return (
        (this.discipline !== undefined &&
          this.discipline != this.userDiscipline) ||
        (this.startYear !== undefined && this.startYear != this.userStartYear)
      );
    }
  },
  methods: {
    updateProfile: async function() {
      const discipline = this.discipline
        ? this.discipline
        : this.userDiscipline;
      const startYear = this.startYear ? this.startYear : this.userStartYear;

      const payload = {
        firstName: this.firstName,
        lastName: this.lastName,
        discipline: discipline,
        startYear: startYear
      };
      const postURL = this.apiUrl + "/update_user";
      try {
        let response = await this.$axios.post(postURL, payload, {
          withCredentials: true
        });
        if (response.data.isSuccess) {
          this.$store.commit("updateUserDiscipline", discipline);
          this.$store.commit("updateUserStartYear", startYear);
          this.$store.dispatch("reloadDisciplineInfo");
          this.snackbarProfile = true;
        } else {
          console.log(response);
          this.$store.commit(
            "displayGlobalError",
            "Error updating, please try again later"
          );
        }
      } catch (e) {
        console.log(e);
        this.$store.commit(
          "displayGlobalError",
          "Error updating, please try again later"
        );
      }

      // Clear fields
      this.discipline = undefined;
      this.startYear = undefined;
    },
    resetPassword: async function() {
      const payload = {
        email: this.userEmail
      };
      console.log(payload)
      try {
        let response = await this.$axios.post("/forgotPassword", payload, {
          withCredentials: true
        });
        console.log(response.data);
        if (response.data.isSuccess) {
          //Tell people to check their email
        } else {
          console.log(response);
          this.$store.commit(
            "displayGlobalError",
            "Error sending email, please try again later"
          );
        }
      } catch (e) {
        console.log(e);
        this.$store.commit(
          "displayGlobalError",
          "Error sending email, please try again later"
        );
      }
      this.snackbarPassword = true;
    }
  }
};
</script>