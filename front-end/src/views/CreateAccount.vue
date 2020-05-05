<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="9" md="6" lg="4">
        <v-card class="elevation-6">
          <v-toolbar color="blue-grey" dark flat>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="text--primary">
            <v-form v-model="validInput">
              <v-row dense>
                <v-col>
                  <v-text-field
                    v-model="fName"
                    label="First Name"
                    id="first-name"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="lName"
                    label="Last Name"
                    id="last-name"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-text-field
                    v-model="email"
                    id="email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-text-field
                    v-model="password1"
                    id="password"
                    :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min, rules.lowerCase, rules.upperCase, rules.number, rules.specialChar]"
                    :type="showPassword1 ? 'text' : 'password'"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="showPassword1 = !showPassword1"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-if="password1.length >= 8"
                    v-model="password2"
                    id="password-confirm"
                    :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min, password2 => (password1 === password2) || 'Passwords don\'t match']"
                    :type="showPassword2 ? 'text' : 'password'"
                    label="Confirm Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="showPassword2 = !showPassword2"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense class="mt-2">
                <v-col>
                  <span class="font-weight-bold">Discipline:</span>
                  {{ userDiscipline }}
                </v-col>
                <v-col>
                  <span class="font-weight-bold">Start Year:&nbsp;</span>
                  <span v-if="userStartYear !== undefined">{{ userStartYear }} (Sci'{{ sciYear }})</span>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-select
                    v-model="userDiscipline"
                    outlined
                    menu-props="offset-y"
                    :items="validDisciplines"
                    :rules="[rules.required]"
                    change="updateProfile"
                    label="Select Discpline"
                    id="discipline"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-select
                    v-model="userStartYear"
                    outlined
                    menu-props="offset-y"
                    :items="validStartYears"
                    :rules="[rules.required]"
                    change="updateProfile"
                    label="Select Start Year"
                    id="start-year"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="mt-n8">
            <v-spacer />
            <v-btn
              color="blue-grey"
              class="white--text"
              v-on:click="addNewUser()"
              id="create-account"
            >Create Account</v-btn>
          </v-card-actions>
        </v-card>
        <v-expand-transition>
          <v-alert color="error" :value="errorMessage !== ''" class="mt-4 px-3 py-1">
            <v-row>
              <span class="mt-1 ml-2">
                <v-icon class="mr-2 mb-1">mdi-alert-circle</v-icon>
                Error: {{ errorMessage }}
              </span>
            </v-row>
          </v-alert>
        </v-expand-transition>
        <v-row class="mt-3">
          <v-spacer />
          <v-btn
            v-on:click="$router.push('/login')"
            v-on:click.stop
            color="indigo lighten-1"
            class="white--text"
            id="back-to-login"
          >Back to Login</v-btn>
          <v-spacer />
        </v-row>
      </v-col>
    </v-row>
    <v-snackbar color="error" v-model="invalidInputs" :timeout="3000" class="font-weight-bold">
      <v-spacer />Not all fields are correctly filled
      <v-spacer />
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CreateAccount",
  data: () => {
    return {
      showPassword1: false,
      showPassword2: false,
      userStartYear: undefined,
      userDiscipline: undefined,
      password1: "",
      password2: "",
      email: "",
      fName: "",
      lName: "",
      invalidInputs: false,
      validInput: false,
      errorMessage: "",
      rules: {
        required: value => !!value || "Required",
        min: value =>
          value.length >= 8 || value.length == 0 || "Min 8 characters",
        lowerCase: value =>
          /[a-z]/.test(value) || "Must contain lower case letters",
        upperCase: value =>
          /[A-Z]/.test(value) || "Must contain upper case letters",
        number: value => /\d/.test(value) || "Must contain numbers",
        specialChar: value =>
          /[^\da-zA-Z]/.test(value) || "Must contain a special character",
        email: value =>
          // eslint-disable-next-line no-useless-escape
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          ) || "E-mail must be valid"
      }
    };
  },
  computed: {
    ...mapState(["validDisciplines", "baseUrl"]),
    sciYear() {
      return String(this.userStartYear + 4).substr(-2);
    },
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
    }
  },
  methods: {
    addNewUser: async function() {
      if (this.validInput) {
        const fakeResponse = {
          firstName: "John",
          lastName: "Smith",
          email: this.email,
          discipline: "Computer",
          startYear: 2019
        };

        this.$store.dispatch("startApp", fakeResponse);
        this.accountCreated = true
        
        // let payload = {
        //   firstName: this.fName,
        //   lastName: this.lName,
        //   email: this.email,
        //   isAdmin: false,
        //   discipline: this.userDiscipline,
        //   startYear: this.userStartYear,
        //   password: this.password1
        // };
        // const postURL = this.baseUrl + "/signUp";
        // try {
        //   let response = await this.$axios.post(postURL, payload, {
        //     withCredentials: true
        //   });
        //   if (response.data.isSuccess) {
        //     console.log(response);
        //     this.$store.dispatch("startApp", response.data.set);
        //     this.accountCreated = true;
        //   } else {
        //     this.errorMessage = response.data.errors[0];
        //   }
        // } catch (e) {
        //   console.log(e);
        //   this.errorMessage =
        //     "Unable to create account, please try again later";
        // }
      } else {
        this.invalidInputs = true;
      }
    }
  }
};
</script>