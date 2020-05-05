<template>
  <div class="v-step-11">
    <v-expansion-panels class="mt-1">
      <v-expansion-panel id="total-credits">
        <CourseListsProgress
          list="Total Credits"
          :completed="coursesCompleted"
          :inProgress="coursesInProgress"
          :saved="coursesSaved"
          :properties="['credits']"
          :progressRequirement="{ name: 'Total Credits', value: creditRequirements }"
          searchSort="credits"
        />
      </v-expansion-panel>
    </v-expansion-panels>

    <v-toolbar dense class="mt-2 mb-n1">
      <v-spacer />
      <v-toolbar-title>Accreditation Units (AUs)</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="requirement in auBaseRequirements" :key="requirement.name" id="au-base-reqs">
        <CourseListsProgress
          :list="requirement.name.substring(0, requirement.name.indexOf('('))"
          :completed="statusTypeProperties('completed', 'accreditationUnits', requirement.aus)"
          :inProgress="statusTypeProperties('inProgress', 'accreditationUnits', requirement.aus)"
          :saved="statusTypeProperties('saved', 'accreditationUnits', requirement.aus)"
          :properties="requirement.aus"
          propertyType="accreditationUnits"
          :progressRequirement="requirement"
          :searchSort="requirement.aus[0]"
        />
      </v-expansion-panel>
      <v-expansion-panel v-for="requirement in auCombinedRequirements" :key="requirement.name" id="au-combine-reqs">
        <CourseListsProgress
          :list="requirement.name"
          :completed="statusTypeProperties('completed', 'accreditationUnits', requirement.aus)"
          :inProgress="statusTypeProperties('inProgress', 'accreditationUnits', requirement.aus)"
          :saved="statusTypeProperties('saved', 'accreditationUnits', requirement.aus)"
          :properties="requirement.aus"
          propertyType="accreditationUnits"
          :progressRequirement="requirement"
          :searchSort="requirement.aus[0]"
        />
      </v-expansion-panel>
    </v-expansion-panels>
    <v-toolbar dense class="mt-2 mb-n1">
      <v-spacer />
      <v-toolbar-title>Additional Requirements</v-toolbar-title>
      <v-spacer />
    </v-toolbar>

    <v-expansion-panels multiple>
      <v-expansion-panel
        v-for="requirement in additionalRequirements"
        v-bind:key="requirement.name"
        id="additional-reqs"
      >
        <CourseListsProgress
          :list="requirement.name"
          :completed="statusTypeProperties('completed', 'labels', requirement.labels)"
          :inProgress="statusTypeProperties('inProgress', 'labels', requirement.labels)"
          :saved="statusTypeProperties('saved', 'labels', requirement.labels)"
          :properties="requirement.labels"
          propertyType="labels"
          :progressRequirement="requirement"
          :searchLabels="requirement.labels.map(label => labelNames[label])"
        />
      </v-expansion-panel>
    </v-expansion-panels>
    <v-banner
      elevation="3"
      icon="mdi-alert-circle"
      :icon-color="alertColor"
      class="mt-2"
    >To be eligible for graduation, all requirments must be satisfied</v-banner>
    <v-banner
      v-if="labelsExceeded.length != 0"
      icon="mdi-alert"
      :icon-color="alertColor"
      elevation="3"
      class="mt-1"
    >
      <div
        v-for="labelInfo in labelsExceeded"
        :key="labelInfo[0]"
      >You are taking {{ labelInfo[2] }} too many courses with the {{ labelNames[labelInfo[0]] }} label. Only {{ labelInfo[1] }} of them will count towards graduation requirements.</div>
    </v-banner>
  </div>
</template>

<style scoped>
.headline {
  font-size: 1.2rem !important;
}
</style>

<script>
import CourseListsProgress from "./../components/courses/CourseListsProgress.vue";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "Progress",
  data() {
    return {
      alertColor: "amber accent-4"
    };
  },
  components: {
    CourseListsProgress
  },
  computed: {
    auBaseRequirements: function() {
      return this.graduationRequirements["auBaseRequirements"];
    },
    auCombinedRequirements: function() {
      return this.graduationRequirements["auCombinedRequirements"];
    },
    additionalRequirements: function() {
      return this.graduationRequirements["additionalRequirements"];
    },
    creditRequirements: function() {
      return this.graduationRequirements["totalCredits"];
    },
    ...mapState(["labelNames", "graduationRequirements"]),
    ...mapGetters([
      "coursesCompleted",
      "coursesInProgress",
      "coursesSaved",
      "labelsExceeded"
    ])
  },
  methods: {
    statusTypeProperties: function(status, type, properties) {
      var courses, i, property;
      if (status === "completed") {
        courses = this.coursesCompleted;
      } else if (status === "inProgress") {
        courses = this.coursesInProgress;
      } else {
        courses = this.coursesSaved;
      }
      return courses.filter(function(course) {
        for (i in properties) {
          property = properties[i];
          if (course[type][property] && course[type][property] != 0) {
            return true;
          }
        }
      });
    }
  }
};
</script>
