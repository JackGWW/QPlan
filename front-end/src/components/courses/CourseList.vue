<template>
  <div>
    <v-expansion-panel-content v-for="course in courses" :key="course.courseCode">
      <CourseCard :course="course" />
    </v-expansion-panel-content>
  </div>
</template>

<script>
import CourseCard from "./CourseCard";
export default {
  name: "CourseList",
  components: { CourseCard },
  props: {
    courses: Array
  }
};
</script>