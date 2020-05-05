<template>
  <v-calendar
    type="custom-daily"
    start="2029-01-01"
    end="2029-01-05"
    first-interval="8"
    interval-count="13"
    now="2029-01-01 00:00:00"
    :event-color="calendarEventColor"
    :events="calendarEvents"
    event-overlap-mode="column"
    event-overlap-threshold="0"
  />
</template>

<script>
import moment from 'moment'

export default {
  name: "CourseCalendarSemester",
  props: {
    course: Object,
    semester: String
  },
  methods: {
    calendarEventColor: function(event) {
      // If it is one of the selected courses classes
      if (
        this.course !== undefined &&
        event.name === this.course.courseCode + " " + this.course.name
      ) {
        // Check if there is a conflicting course
        for (const otherEvent of this.calendarEvents) {
          if (
            otherEvent.name !==
            this.course.courseCode + " " + this.course.name
          ) {
            if (
              Date.parse(event.start) < Date.parse(otherEvent.end) &&
              Date.parse(otherEvent.start) < Date.parse(event.end)
            )
              return "red";
          }
        }
        return "green darken-2";
      } else {
        return "blue lighten-1";
      }
    }
  },
  computed: {
    calendarEvents() {
      var coursesInProgress = this.$store.getters.coursesInProgress;
      const semesterMapping = this.$store.getters.semesterMapping;

      //Ensure the currently viewed course is set to the list
      if (
        this.course !== undefined &&
        coursesInProgress.indexOf(this.course) === -1 //The course isn't in the list
      ) {
        coursesInProgress.push(this.course);
      }

      //Only include courses occuring in the current semester
      coursesInProgress = coursesInProgress.filter(course => {
        const selectedSemester =
          course.chosenSemester && course.chosenSemester != undefined
            ? course.chosenSemester
            : course.semester;
        return semesterMapping[selectedSemester].indexOf(this.semester) !== -1;
      });

      function offsetTimeZone(dateString){
        // Keep time shows constant no matter what timezone it's viewed in
        let date = moment(dateString, "YYYY-MM-DD HH:mm:ss")
        const minOffset = new Date().getTimezoneOffset()
        date.add(minOffset, 'm')
        return date.format("YYYY-MM-D HH:mm")
      }

      var events = [];
      for (const course of coursesInProgress) {
        if (course.schedule) {
          if (course.schedule.LEC) {
            for (const times of course.schedule.LEC.times) {
              events.push({
                name: course.courseCode + " " + course.name,
                start: offsetTimeZone(times[0]),
                end: offsetTimeZone(times[1])
              });
            }
          }
          if (course.schedule.TUT) {
            for (const times of course.schedule.TUT.times) {
              events.push({
                name: course.courseCode + " " + course.name,
                start: offsetTimeZone(times[0]),
                end: offsetTimeZone(times[1])
              });
            }
          }
          if (course.schedule.LAB) {
            for (const times of course.schedule.LAB.times) {
              events.push({
                name: course.courseCode + " " + course.name,
                start: offsetTimeZone(times[0]),
                end: offsetTimeZone(times[1])
              });
            }
          }
        }
      }
      return events;
    }
  }
};
</script>