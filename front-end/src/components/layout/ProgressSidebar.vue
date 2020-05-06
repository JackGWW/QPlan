<template>
  <v-slide-x-transition>
    <v-navigation-drawer
      app
      clipped
      color="grey lighten-4"
      width="300"
      class="ma-1 pr-1 v-step-8"
      mobile-break-point="960"
      v-model="progressSidebar"
      v-if="authenticated"
      :permanent="tourActive"
    >
      <div>
        <div class="headline mb-2">
          Credit Progress
          <v-icon color="black" class="mb-1">mdi-progress-check</v-icon>
        </div>

        <div class="v-step-9">
          <div style="text-align: center;">
            <b>Legend</b>
          </div>
          <v-row class="mt-n3">
            <v-col>
              <v-card rounded>
                <v-progress-linear height="25" value="100" striped color="grey lighten-1">
                  <span>Completed</span>
                </v-progress-linear>
              </v-card>
            </v-col>
            <v-col>
              <v-card rounded>
                <v-progress-linear buffer-value="100" height="25" striped color="grey lighten-1">
                  <span>Planned</span>
                </v-progress-linear>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="mb-2"></v-divider>
          <div class="subtitle-1">
            <b>Total Credits</b>
          </div>
          <ProgressBar
            :properties="Array('credits')"
            type="Credits"
            :requirement="graduationRequirements['totalCredits']"
          ></ProgressBar>

          <v-divider class="mb-2 mt-3"></v-divider>
        </div>
        <v-row class="mx-0">
          <b>Accreditation Units (AUs)</b>

          <v-tooltip bottom nudge-top="6" open-delay="300" max-width="250">
            <template v-slot:activator="{ on }">
              <v-icon class="ml-1 mb-1" small v-on="on">mdi-help-circle</v-icon>
            </template>
            <span>{{ auHelpText }}</span>
          </v-tooltip>

          <v-spacer />
          <v-btn
            icon
            small
            @click="showAccreditationUnits = !showAccreditationUnits"
            id="show-au-side"
          >
            <v-icon v-if="showAccreditationUnits">mdi-chevron-up</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-btn>
        </v-row>
        <v-expand-transition>
          <div v-show="showAccreditationUnits">
            <div
              v-for="requirement in graduationRequirements['auBaseRequirements']"
              v-bind:key="requirement.name"
            >
              <div class="subtitle-1">{{ requirement.name }}</div>
              <ProgressBar
                :properties="requirement.aus"
                propertyType="accreditationUnits"
                :requirement="requirement.value"
                :type="requirement.type"
              ></ProgressBar>
            </div>
            <div
              v-for="requirement in graduationRequirements['auCombinedRequirements']"
              v-bind:key="requirement.name"
            >
              <div class="subtitle-1">{{ requirement.name }}</div>
              <ProgressBar
                :properties="requirement.aus"
                propertyType="accreditationUnits"
                :requirement="requirement.value"
                :type="requirement.type"
              ></ProgressBar>
            </div>
          </div>
        </v-expand-transition>
        <v-divider class="mb-2 mt-3"></v-divider>

        <v-row class="mx-0">
          <b>Additional Requirements</b>

          <v-tooltip bottom nudge-top="6" open-delay="300" max-width="250">
            <template v-slot:activator="{ on }">
              <v-icon class="ml-1 mb-1" small v-on="on">mdi-help-circle</v-icon>
            </template>
            <span>{{ arHelpText }}</span>
          </v-tooltip>

          <v-spacer />
          <v-btn
            icon
            small
            @click="showAdditionalRequirements = !showAdditionalRequirements"
            id="show-add-req"
          >
            <v-icon v-if="showAdditionalRequirements">mdi-chevron-up</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-btn>
        </v-row>
        <v-expand-transition>
          <div v-show="showAdditionalRequirements">
            <div
              v-for="requirement in graduationRequirements['additionalRequirements']"
              v-bind:key="requirement.name"
            >
              <div class="subtitle-1">{{ requirement.name }}</div>
              <ProgressBar
                :properties="requirement.labels"
                propertyType="labels"
                :type="requirement.type"
                :requirement="requirement.value"
              ></ProgressBar>
            </div>
          </div>
        </v-expand-transition>

        <div style="margin-bottom: 75px" />
        <v-btn
          rounded
          large
          fixed
          bottom
          elevation="8"
          color="indigo lighten-1"
          style="left: 10%; z-index:90;"
          id="detailed-prog-side"
          class="v-step-10"
          @click="progressTour()"
        >
          <router-link to="/progress">
            Detailed Progress
            <v-icon>mdi-progress-check</v-icon>
          </router-link>
        </v-btn>
      </div>
    </v-navigation-drawer>
  </v-slide-x-transition>
</template>

<script>
import ProgressBar from "../ProgressBar.vue";
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  name: "ProgressSidebar",
  components: { ProgressBar },
  data() {
    return {
      showAccreditationUnits: true,
      showAdditionalRequirements: true,
      auHelpText:
        "There are five types of accredidation units (AUs) that you are required to obtain to graduate as an engineer.  The AUs and the required number of units for each can be seen below.  Each course provides different amounts of AUs, depending on the course content.",
      arHelpText:
        "Each discipline has additional requirements that must be satisfied to graduate. These requirements include taking core courses, courses from specific lists, taking electives and more."
    };
  },
  computed: {
    ...mapGetters(["graduationRequirements"]),
    ...mapState(["authenticated"]),
    tourActive: function() {
      return (
        this.$tours["introTour"].isRunning &&
        this.$tours["introTour"].currentStep >= 8 &&
        this.$tours["introTour"].currentStep <= 10
      );
    },
    progressSidebar: {
      get() {
        return this.$store.getters.showProgressSidebar;
      },
      set(value) {
        return this.$store.commit("updateProgressSidebar", value);
      }
    }
  },
  methods: {
    progressTour: function() {
      if (
        this.$tours["introTour"].isRunning &&
        this.$tours["introTour"].currentStep == 10
      ) {
        if (this.$route.name !== "progress") {
          window.setTimeout(this.progressTour, 50);
        }
        // Then progress tour
        else {
          this.$tours["introTour"].nextStep();
        }
      }
    }
  }
};
</script>

<style scoped>
</style>