<template>
  <div>
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header class="headline">Completed</v-expansion-panel-header>
        <CourseList :courses="coursesCompleted" />
      </v-expansion-panel>
      <CourseListsHome
        class="v-step-1 v-step-18"
        list="Taking this Year"
        :fall="coursesSemesterStatus('Fall', 'inProgress')"
        :winter="coursesSemesterStatus('Winter', 'inProgress')"
        :year="coursesSemesterStatus('Fall+Winter', 'inProgress')"
        :summer="coursesSemesterStatus('Summer', 'inProgress')"
        :online="coursesSemesterStatus('Online', 'inProgress')"
      />
      <CourseListsHome
        list="Saved for Future Years"
        :fall="coursesSemesterStatus('Fall', 'saved')"
        :winter="coursesSemesterStatus('Winter', 'saved')"
        :year="coursesSemesterStatus('Fall+Winter', 'saved')"
        :summer="coursesSemesterStatus('Summer', 'saved')"
        :online="coursesSemesterStatus('Online', 'saved')"
      />
    </v-expansion-panels>
    <v-snackbar bottom :timeout="3000" v-model="snackbar">
      Undo course removal?
      <v-btn text @click="undoRemove" @click.stop>Undo</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
import CourseList from "@/components/courses/CourseList.vue";
import CourseListsHome from "@/components/courses/CourseListsHome.vue";
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      panel: [1, 2]
    };
  },
  components: {
    CourseList,
    CourseListsHome
  },
  computed: {
    ...mapGetters([
      "coursesCompleted",
      "coursesSemesterStatus",
      "sumCompletedProperties",
      "sumInProgressProperties",
      "sumSavedProperties"
    ]),
    ...mapState(["firstLogin", "seenGuide"]),
    snackbar: {
      get() {
        return this.$store.getters.showRemovedSnackbarHome;
      },
      set(value) {
        this.$store.commit("updateRemovedSnackbarHome", value);
      }
    }
  },
  methods: {
    undoRemove: function() {
      this.$store.dispatch("undoRecentRemoval");
      this.$store.commit("updateRemovedSnackbarHome", false);
    }
  },
  mounted: function() {
    if (this.firstLogin && !this.seenGuide) {
      this.$tours["introTour"].start();
      this.$store.commit("updateSeenGuide", true)
    }
  }
};
</script>
