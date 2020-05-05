<template>
  <div>
    <v-expansion-panel-header class="headline py-2">
      <v-row no-gutters class="mb-n1">
        <v-col cols="5" style="max-width: 257px;">{{ list }}</v-col>

        <v-col>
          <div cols="auto" class="pt-1 body-1">
            <ProgressBar
              :properties="properties"
              :propertyType="propertyType"
              :type="progressRequirement.type"
              :requirement="progressRequirement.value"
            ></ProgressBar>
          </div>
        </v-col>

        <v-col cols="auto">
          <v-btn text rounded right max-width="120" class="mx-3" v-on:click.stop id="find-more">
            <router-link
              :to="{path: '/search', query: {sortBy: searchSort, selectedLabels: searchLabels}}"
            >Find More</router-link>
          </v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-header>

    <v-expand-transition>
      <div v-if="completed.length>0">
        <v-expansion-panel-content>
          <div>Completed - {{ this.sumCompletedProperties(propertyType, properties)}} / {{ progressRequirement.value }} {{progressRequirement.type}}</div>
        </v-expansion-panel-content>
        <CourseList :courses="completed" />
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-if="inProgress.length>0">
        <v-expansion-panel-content>
          <div>In Progress - {{ this.sumInProgressProperties(propertyType, properties)}} / {{ progressRequirement.value }} {{progressRequirement.type}}</div>
        </v-expansion-panel-content>
        <CourseList :courses="inProgress" />
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-if="saved.length>0">
        <v-expansion-panel-content>
          <div>Saved - {{ this.sumSavedProperties(propertyType, properties)}} / {{ progressRequirement.value }} {{progressRequirement.type}}</div>
        </v-expansion-panel-content>
        <CourseList :courses="saved" />
      </div>
    </v-expand-transition>
    <v-snackbar bottom :timeout="3000" v-model="snackbar">
      Undo course removal?
      <v-btn text @click="undoRemove" @click.stop>Undo</v-btn>
    </v-snackbar>
  </div>
</template>

<style scoped>
.headline {
  font-size: 1.2rem !important;
}
</style>

<script>
import CourseList from "./CourseList";
import ProgressBar from "./../ProgressBar";
import { mapGetters } from "vuex";

export default {
  props: {
    list: String,
    completed: Array,
    inProgress: Array,
    saved: Array,
    progressRequirement: Object,
    properties: Array,
    propertyType: String,
    searchSort: {
      type: String,
      default: "prefix"
    },
    searchLabels: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components: {
    CourseList,
    ProgressBar
  },
  computed: {
    ...mapGetters([
      "sumCompletedProperties",
      "sumInProgressProperties",
      "sumSavedProperties"
    ]),
    snackbar: {
      get() {
        return this.$store.getters.showRemovedSnackbarProgress;
      },
      set(value) {
        this.$store.commit("updateRemovedSnackbarProgress", value);
      }
    }
  },
  methods: {
    undoRemove: function() {
      this.$store.dispatch("undoRecentRemoval");
      this.$store.commit("updateRemovedSnackbarProgress", false);
    }
  }
};
</script>