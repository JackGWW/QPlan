<template>
  <v-card flat tile>
    <v-window v-model="calendarCarousel">
      <v-window-item>
        <CourseCalendarSemester :course="course" semester="Fall" />
      </v-window-item>
      <v-window-item>
        <CourseCalendarSemester :course="course" semester="Winter" />
      </v-window-item>
      <v-window-item>
        <CourseCalendarSemester :course="course" semester="Summer" />
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-between">
      <v-btn text @click="prev" id="left-scroll">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-item-group v-model="calendarCarousel" class="text-center" mandatory>
        <v-item v-slot:default="{ active, toggle }">
          <v-btn text :input-value="active" @click="toggle" id="fall">FALL</v-btn>
        </v-item>
        <v-item v-slot:default="{ active, toggle }">
          <v-btn :input-value="active" text @click="toggle" id="winter">WINTER</v-btn>
        </v-item>
        <v-item v-slot:default="{ active, toggle }">
          <v-btn text :input-value="active" @click="toggle" id="summer">SUMMER</v-btn>
        </v-item>
      </v-item-group>
      <v-btn text @click="next">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CourseCalendarSemester from "./CourseCalendarSemester";

export default {
  name: "CourseCalendar",
  data: () => ({
    calendarCarousel: 0,
    numSemesters: 3
  }),
  props: {
    course: Object
  },
  components: { CourseCalendarSemester },
  computed: {
    initCarousel() {
      const semesterMapping = this.$store.getters.semesterMapping;
      if (this.course === undefined) return 0;
      const semester = semesterMapping[this.course.semester]

      if (semester.includes("Fall")) {
        return 0;
      }
      if (semester.includes("Winter")) {
        return 1;
      }
      if (semester.includes("Summer")) {
        return 2;
      }
      return 0;
    }
  },
  methods: {
    next() {
      this.calendarCarousel =
        this.calendarCarousel + 1 === this.numSemesters
          ? 0
          : this.calendarCarousel + 1;
    },
    prev() {
      this.calendarCarousel =
        this.calendarCarousel - 1 < 0
          ? this.numSemesters - 1
          : this.calendarCarousel - 1;
    }
  },
  mounted: function() {
    this.calendarCarousel = this.initCarousel;
  }
};
</script>