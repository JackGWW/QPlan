<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-6">
          <v-toolbar color="blue-grey" dark flat>
            <v-toolbar-title>Sign In</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                prepend-icon="email"
                type="text"
                :rules="[rules.required, rules.email]"
                @keyup.enter="tryLogin()"
                id="login-email"
              />
              <v-text-field
                v-model="password"
                id="password"
                label="Password"
                name="password"
                prepend-icon="lock"
                :rules="[rules.required]"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                class="mb-n2"
                @keyup.enter="tryLogin()"
              />
            </v-form>

            <v-dialog v-model="dialog" width="350">
              <template v-slot:activator="{ on }">
                <span class="ml-n1" style="position: relative;">
                  <v-btn
                    text
                    class="px-2 text--secondary"
                    style="text-decoration: underline; text-transform: none;"
                    id="forgot-password"
                    v-on="on"
                  >Forgot Password?</v-btn>
                </span>
              </template>
              <v-card>
                <v-card-title class="headline" primary-title>Password Reset</v-card-title>

                <v-card-text>
                  Please enter your account's email below:
                  <v-form v-model="validResetEmail" @submit="submit" onsubmit="return false;">
                    <v-text-field
                      v-model="resetEmail"
                      label="Email"
                      name="resetEmail"
                      prepend-icon="email"
                      type="text"
                      :rules="[rules.email]"
                    />
                  </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red"
                    :disabled="!validResetEmail"
                    text
                    @click="dialog = false; forgotPassword();"
                  >RESET</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-on:click="tryLogin()"
              :disabled="disableLoginBtn"
              color="blue-grey"
              class="white--text"
              id="login"
            >Login</v-btn>
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
        <v-expand-transition>
          <v-alert color="success" :value="successMessage !== ''" class="mt-4 px-3 py-1">
            <v-row>
              <span class="mt-1 ml-2">
                <v-icon class="mr-2 mb-1">mdi-check-circle</v-icon>
                {{ successMessage }}
              </span>
            </v-row>
          </v-alert>
        </v-expand-transition>
        <v-row class="mt-3">
          <v-spacer />
          <v-btn
            v-on:click="goToAccountCreate();"
            v-on:click.stop
            color="indigo lighten-1"
            class="white--text"
            id="sign-up"
          >Sign Up</v-btn>
          <v-spacer />
        </v-row>
        <v-row class="mt-6">
          <v-spacer />
          <v-alert dismissible dense type="warning">This is a demo. Use any email to log in and your changes won't be saved. <a class="white--text" style="text-decoration: underline;" href="https://github.com/JackGWW/qplan"> More details here</a>.</v-alert>
          <v-spacer />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data: () => ({
    password: "",
    showPassword: false,
    email: "",
    resetEmail: "",
    validResetEmail: false,
    disableLoginBtn: false,
    errorMessage: "",
    successMessage: "",
    dialog: false,
    rules: {
      required: value => !!value || "Required",
      email: value =>
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || "E-mail must be valid"
    }
  }),
  methods: {
    goToAccountCreate: function() {
      this.$router.push("/createAccount");
    },
    tryLogin: async function() {
      this.disableLoginBtn = true;

      if (this.email === "" || this.password === "") {
        this.errorMessage = "Fields cannot be empty";
        this.disableLoginBtn = false;
        return;
      }

      const fakeResponse = {
        firstName: "John",
        lastName: "Smith",
        email: this.email,
        discipline: "Computer",
        startYear: 2019
      };

      this.$store.dispatch("startApp", fakeResponse);

      // const payload = {
      //   email: this.email,
      //   password: this.password
      // };

      // try {
      //   let response = await this.$axios.post("/authenticate", payload, {
      //     withCredentials: true
      //   });
      //   if (response.data.isSuccess) {
      //     this.$store.dispatch("startApp", response.data.set);
      //   } else {
      //     this.errorMessage = response.data.errors[0];
      //   }
      // } catch (e) {
      //   console.log(e);
      //   this.errorMessage = "Unable to login, please try later";
      // }
      this.disableLoginBtn = false;
    },
    forgotPassword: async function() {
      const payload = {
        email: this.resetEmail
      };
      this.resetEmail = "";

      try {
        let response = await this.$axios.post("/forgotPassword", payload, {
          withCredentials: true
        });
        if (response.data.isSuccess) {
          //Tell people to check their email
          this.errorMessage = "";
          this.successMessage = "Password reset email sent";
        } else {
          this.errorMessage = "No account with this email";
        }
      } catch (e) {
        console.log(e);
        this.errorMessage = "Unable to reset, please try later";
      }
    }
  }
};
</script>