<template>
  <v-slide-x-reverse-transition>
    <v-navigation-drawer
      app
      right
      clipped
      color="grey lighten-4"
      width="300"
      class="ma-1 pl-1"
      v-model="recentSidebar"
      v-if="authenticated"
    >
      <span class="headline ml-1">Recent Courses</span>
      <v-fade-transition group>
        <div v-for="course in recentlyViewedCourses" :key="course.id">
          <CourseCard class="ma-1" :course="course" />
        </div>
      </v-fade-transition>
    </v-navigation-drawer>
  </v-slide-x-reverse-transition>
</template>

<script>
import CourseCard from "../courses/CourseCard";
import { mapState } from "vuex";

export default {
  name: "RecentSidebar",
  components: {
    CourseCard
  },
  computed: {
    ...mapState(["recentlyViewedCourses", "authenticated"]),
    recentSidebar: {
      get() {
        return this.$store.getters.showRecentSidebar;
      },
      set(value) {
        return this.$store.commit("updateRecentSidebar", value);
      }
    }
  }
};
</script>

<style scoped>
</style>