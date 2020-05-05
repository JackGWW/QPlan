<template>
  <v-app-bar class="v-step-12" app clipped-left clipped-right color="indigo lighten-1">
    <v-app-bar-nav-icon
      id="toggle-progress"
      class="hidden-md-and-up"
      @click="toggleProgressSidebar"
    />
    <v-btn x-large text rounded class="ml-n3 px-0 v-step-0" id="logo-home">
      <router-link to="/">
        <v-img max-height="38" contain src="@/assets/logo.png"></v-img>
      </router-link>
    </v-btn>

    <v-spacer />

    <v-scroll-y-transition>
      <v-autocomplete
        v-if="authenticated"
        label="Search courses"
        ref="searchBar"
        :items="allSearchOptions"
        rounded
        flat
        hide-details
        clearable
        solo-inverted
        hide-no-data
        hint="Search by courses code or name"
        color="indigo lighten-3"
        @update:search-input="updateLatestSearch($event)"
        @input="searchCourses($event)"
        @keyup.enter="searchCourses($event.target.value)"
        id="search-bar"
      ></v-autocomplete>
    </v-scroll-y-transition>

    <v-scroll-y-transition>
      <v-tooltip v-if="authenticated" bottom open-delay="300" nudge-top="2">
        <template v-slot:activator="{ on }">
          <v-btn icon rounded v-on="on" @click="executeSearch" @click.stop id="search-courses">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <span>Search Courses</span>
      </v-tooltip>
    </v-scroll-y-transition>

    <v-scroll-y-transition>
      <v-divider v-if="authenticated" vertical inset />
    </v-scroll-y-transition>

    <v-scroll-y-transition>
      <v-tooltip v-if="authenticated" bottom open-delay="300">
        <template v-slot:activator="{ on }">
          <router-link to="/search">
            <v-btn
              text
              rounded
              large
              v-on="on"
              color="grey darken-4"
              class="px-3 v-step-13"
              id="browse"
              @click="progressTour(13, 'search')"
            >Browse All</v-btn>
          </router-link>
        </template>
        <span>Browse All Courses</span>
      </v-tooltip>
    </v-scroll-y-transition>

    <v-spacer />

    <template>
      <v-dialog>
        <template v-slot:activator="{ on: dialog }">
          <v-tooltip bottom nudge-bottom="-2" open-delay="300">
            <template v-slot:activator="{ on: tooltip }">
              <v-scroll-y-transition>
                <v-btn v-if="authenticated" icon v-on="{ ...tooltip, ...dialog }" id="calendar">
                  <v-icon>mdi-calendar</v-icon>
                </v-btn>
              </v-scroll-y-transition>
            </template>
            <span>Class Schedule</span>
          </v-tooltip>
        </template>
        <CourseCalendar></CourseCalendar>
      </v-dialog>
    </template>

    <v-scroll-y-transition>
      <v-divider v-if="authenticated" vertical inset />
    </v-scroll-y-transition>

    <v-tooltip bottom open-delay="300">
      <template v-slot:activator="{ on }">
        <v-scroll-y-transition>
          <router-link to="/">
            <v-btn
              @click="progressTour(17, 'home')"
              v-if="authenticated"
              large
              icon
              class="mr-n2 v-step-17"
              v-on="on"
              id="home"
            >
              <v-icon color="blue-grey darken-4">mdi-home</v-icon>
            </v-btn>
          </router-link>
        </v-scroll-y-transition>
      </template>
      <span>Homepage</span>
    </v-tooltip>

    <v-tooltip bottom open-delay="300">
      <template v-slot:activator="{ on }">
        <v-scroll-y-transition>
          <v-btn v-if="authenticated" icon large v-on="on" id="progress">
            <router-link to="/progress">
              <v-icon color="blue-grey darken-4">mdi-progress-check</v-icon>
            </router-link>
          </v-btn>
        </v-scroll-y-transition>
      </template>
      <span>Credit Progress</span>
    </v-tooltip>

    <v-scroll-y-transition>
      <v-divider v-if="authenticated" vertical inset />
    </v-scroll-y-transition>

    <v-scroll-y-transition>
      <v-menu v-if="authenticated" offset-y>
        <template v-slot:activator="{ on: dialog }">
          <v-tooltip bottom open-delay="300">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon large v-on="{ ...tooltip, ...dialog }" id="extra-dropdown">
                <v-icon color="blue-grey darken-4">mdi-account-settings</v-icon>
              </v-btn>
            </template>
            <span>Expand Options</span>
          </v-tooltip>
        </template>
        <v-list dense nav>
          <router-link to="/profile">
            <v-list-item id="profile" link>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Account</v-list-item-content>
            </v-list-item>
          </router-link>
          <router-link to="/contact">
            <v-list-item link id="contact">
              <v-list-item-icon>
                <v-icon>mdi-contact-mail</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Contact</v-list-item-content>
            </v-list-item>
          </router-link>
          <v-list-item @click="restartTour()" link id="uiTour">
            <v-list-item-icon>
              <v-icon>mdi-map-marker</v-icon>
            </v-list-item-icon>
            <v-list-item-content>UI Tour</v-list-item-content>
          </v-list-item>
          <a
            href="https://saself.ps.queensu.ca/psp/saself/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL"
            target="_blank"
            class="blue-grey--text text--darken-4"
          >
            <v-list-item link id="solus">
              <v-list-item-icon>
                <v-icon>mdi-open-in-new</v-icon>
              </v-list-item-icon>
              <v-list-item-content>SOLUS</v-list-item-content>
            </v-list-item>
          </a>
          <v-list-item link v-on:click="logOut">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Log Out</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-scroll-y-transition>
  </v-app-bar>
</template>

<script>
import CourseCalendar from "@/components/courses/CourseCalendar";
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  name: "Header",
  data: () => ({
    search: null,
    latestQuery: ""
  }),
  components: {
    CourseCalendar
  },
  methods: {
    searchCourses: function(searchQuery) {
      if (searchQuery !== undefined) {
        this.$refs.searchBar.blur();
        this.$router.push({
          path: "/search",
          query: { query: searchQuery }
        });
      }
    },
    executeSearch: function() {
      if (this.latestQuery) {
        this.$refs.searchBar.blur();
        this.$router.push({
          path: "/search",
          query: { query: this.latestQuery }
        });
      } else {
        this.$router.push("/search");
      }
    },
    toggleProgressSidebar() {
      this.$store.commit(
        "updateProgressSidebar",
        !this.$store.getters.showProgressSidebar
      );
    },
    refresh() {
      this.$router.go();
    },
    logOut: async function() {
      const errMsg = "Unable to logout, try refreshing the page.";
      try {
        let response = await this.$axios.get("/logout", {
          withCredentials: true
        });
        if (response.data.isSuccess) {
          this.$tours["introTour"].stop();
          this.$store.dispatch("stopApp");
        } else {
          console.log("Error logging out");
          console.log(response);
          this.setGlobalErrorMessage(errMsg);
        }
      } catch (e) {
        console.log(e);
        location.reload();
      }
    },
    setGlobalErrorMessage: function(msg) {
      this.$store.commit("displayGlobalError", msg);
    },
    updateLatestSearch: function(searchQuery) {
      this.latestQuery = searchQuery;
    },
    progressTour: function(step, destination) {
      if (
        this.$tours["introTour"].isRunning &&
        this.$tours["introTour"].currentStep === step
      ) {
        if (this.$route.name !== destination) {
          setTimeout(this.progressTour, 50, step, destination);
        }
        // Then progress tour
        else {
          this.$tours["introTour"].nextStep();
        }
      }
    },
    restartTour: function() {
      if (!this.$tours["introTour"].isRunning) {
        this.$router.push("/");
        this.$tours["introTour"].start()
      }
    }
  },
  computed: {
    ...mapGetters(["allSearchOptions"]),
    ...mapState(["authenticated"])
  }
};
</script>