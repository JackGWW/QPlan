<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="9" md="6" lg="4">
        <v-card class="elevation-6">
          <v-toolbar color="blue-grey" dark flat>
            <v-toolbar-title>Reset Password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="validInput">
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
              <v-row dense>
                <v-col>
                  <v-text-field v-model="token" id="token" label="Token" :rules="[rules.required]"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-on:click="resetPassword()"
              :disabled="resetSuccessful"
              color="blue-grey"
              class="white--text"
              id="login"
            >Reset Password</v-btn>
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
          <v-alert color="success" :value="successMessage !== ''" class="mt-4 px-3 py-2">
            <v-row>
              <span class="mt-2 ml-2">
                <v-icon class="mr-2 mb-1">mdi-check-circle</v-icon>
                {{ successMessage }}
              </span>
              <v-spacer />
              <v-btn
                v-on:click="$router.push('/login')"
                v-on:click.stop
                color="indigo lighten-1"
                class="mr-2"
              >Login</v-btn>
            </v-row>
          </v-alert>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data: () => ({
    showPassword1: false,
    showPassword2: false,
    password1: "",
    password2: "",
    email: "",
    token: "",
    validInput: false,
    errorMessage: "",
    successMessage: "",
    resetSuccessful: false,
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
  }),
  methods: {
    resetPassword: async function() {
      if (!this.validInput) {
        this.errorMessage = "All fields must be filled";
        return;
      }

      const payload = {
        email: this.email,
        newPassword: this.password1,
        token: this.token
      };
      
      try {
        let response = await this.$axios.post("/passwordReset", payload, {
          withCredentials: true
        });
        console.log(response.data);
        if (response.data.isSuccess) {
          this.errorMessage = "";
          this.successMessage = "Password reset successful";
        } else {
          this.errorMessage = response.data.errors[0];
        }
      } catch (e) {
        console.log(e);
        this.errorMessage = "Unable to reset, please try later";
      }
    }
  }
};
</script>