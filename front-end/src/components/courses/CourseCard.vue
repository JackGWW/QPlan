<template>
  <div>
    <v-dialog width="1000" :persistent="cardTourActive" v-model="courseDialog">
      <template v-slot:activator="{ on } ">
        <!-- Code for the regular narrow course card -->
        <v-card
          color="grey lighten-4"
          flat
          v-on="on"
          hover
          v-on:click="addRecent(course); progressTour();"
        >
          <v-toolbar dense extension-height="20" style="background-color: #f5f5f5">
            <v-icon v-if="courseWarning[0]" dense :color="alertColor" class="mr-3">mdi-alert</v-icon>
            <v-toolbar-title class="d-inline-block text-truncate subtitle-1">
              <b>{{ course.courseCode }} - {{ course.name }}</b>
              <span v-if="detailed" class="ml-1">({{ course.semester }})</span>
            </v-toolbar-title>
            <v-spacer />

              <!-- Completed button -->
              <v-tooltip bottom nudge-bottom="-6" open-delay="500">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    small
                    v-on:click="undoRemove(course, 'completed'); toggleStatus(course, 'completed');"
                    v-on:click.stop
                    v-on="on"
                    id="completed-tool"
                    :class="detailed === true ? 'v-step-16' : ''"
                  >
                    <div v-if="course.status == 'completed'">
                      <v-icon>mdi-check-circle</v-icon>
                    </div>
                    <div v-else>
                      <v-icon>mdi-check-circle-outline</v-icon>
                    </div>
                  </v-btn>
                </template>
                <span>Completed</span>
              </v-tooltip>

              <!-- In Progress Button -->
              <v-tooltip bottom nudge-bottom="-6" open-delay="500">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    small
                    v-on:click="undoRemove(course, 'inProgress'); toggleStatus(course, 'inProgress');"
                    v-on:click.stop
                    v-on="on"
                    id="in-progress-tool"
                  >
                    <div v-if="course.status == 'inProgress'">
                      <v-icon>mdi-timer-sand-full</v-icon>
                    </div>
                    <div v-else>
                      <v-icon>mdi-timer-sand-empty</v-icon>
                    </div>
                  </v-btn>
                </template>
                <span>Take this Year</span>
              </v-tooltip>

              <!-- Saved Button -->
              <v-tooltip bottom nudge-bottom="-6" open-delay="500">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    small
                    v-on:click="undoRemove(course, 'saved'); toggleStatus(course, 'saved');"
                    v-on:click.stop
                    v-on="on"
                    id="saved-for-later-tool"
                  >
                    <div v-if="course.status == 'saved'">
                      <v-icon>mdi-bookmark</v-icon>
                    </div>
                    <div v-else>
                      <v-icon>mdi-bookmark-outline</v-icon>
                    </div>
                  </v-btn>
                </template>
                <span>Take in Future</span>
              </v-tooltip>

            <!-- Subheading with credit, class and AUs details -->
            <template v-if="detailed" #extension>
              <v-subheader class="ml-n4 mt-n1">
                {{ course.credits }} Credits |
                Lec:{{ course.lecture }}h -
                {{ (course.tutorial) ? " Y " : " N " }}Tut.
                {{ (course.lab) ? " Y " : " N " }}Lab |
                Math: {{ course.accreditationUnits.mathematics }}
                NS: {{ course.accreditationUnits.naturalSciences }}
                CS: {{ course.accreditationUnits.complementaryStudies }}
                ES: {{ course.accreditationUnits.engineeringSciences }}
                ED: {{ course.accreditationUnits.engineeringDesign }}
              </v-subheader>
            </template>
          </v-toolbar>
        </v-card>
      </template>

      <!-- Code for the expanded course card dialog box -->
      <div class="v-step-3">
        <v-card>
          <v-card-title class="mb-n3">
            <b class="mr-1">{{ course.courseCode }} - {{ course.name }}</b>
            ({{ course.semester }})
            <v-spacer />

            <v-select
              v-model="selectedSemester"
              label="Select Semester"
              dense
              v-if="Array.isArray(semesterOptions) && semesterOptions.length > 1"
              :items="semesterOptions"
              class="mb-n1"
              style="max-width: 150px;"
              id="semester-select"
            ></v-select>
            <!-- Code for the calendar dialog box -->
            <template>
              <v-dialog width="1000">
                <template v-slot:activator="{ on: dialog }">
                  <v-tooltip bottom nudge-bottom="-6" open-delay="500">
                    <template v-slot:activator="{ on: tooltip }">
                      <div v-on="{ ...tooltip}">
                        <v-btn
                          icon
                          :disabled="course.schedule === undefined"
                          v-on="{ ...dialog }"
                          id="calendar-card"
                          class="v-step-5"
                        >
                          <v-icon :color="(calendarConflict[0]) ? alertColor : ''">mdi-calendar</v-icon>
                        </v-btn>
                      </div>
                    </template>
                    <span v-if="course.schedule">Preview Schedule</span>
                    <span v-else>No schedule data available</span>
                  </v-tooltip>
                </template>
                <CourseCalendar :course="course" />
              </v-dialog>
            </template>

            <v-divider vertical inset class="mb-2 mr-1" />

            <v-tooltip bottom nudge-bottom="-6" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on:click="undoRemove(course, 'completed'); toggleStatus(course, 'completed');"
                  v-on:click.stop
                  v-on="on"
                  id="completed-card"
                >
                  <div v-if="course.status == 'completed'">
                    <v-icon>mdi-check-circle</v-icon>
                  </div>
                  <div v-else>
                    <v-icon>mdi-check-circle-outline</v-icon>
                  </div>
                </v-btn>
              </template>
              <span>Completed</span>
            </v-tooltip>

            <v-tooltip bottom nudge-bottom="-6" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on:click="undoRemove(course, 'inProgress'); toggleStatus(course, 'inProgress');"
                  v-on:click.stop
                  v-on="on"
                  id="in-progress-card"
                >
                  <div v-if="course.status == 'inProgress'">
                    <v-icon>mdi-timer-sand-full</v-icon>
                  </div>
                  <div v-else>
                    <v-icon>mdi-timer-sand-empty</v-icon>
                  </div>
                </v-btn>
              </template>
              <span>Take this Year</span>
            </v-tooltip>

            <v-tooltip bottom nudge-bottom="-6" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  small
                  v-on:click="undoRemove(course, 'saved'); toggleStatus(course, 'saved');"
                  v-on:click.stop
                  v-on="on"
                  id="saved-for-later-card"
                >
                  <div v-if="course.status == 'saved'">
                    <v-icon>mdi-bookmark</v-icon>
                  </div>
                  <div v-else>
                    <v-icon>mdi-bookmark-outline</v-icon>
                  </div>
                </v-btn>
              </template>
              <span>Take in Future</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text class="pb-3 v-step-4">
            {{ course.credits }} Credits |
            Lec:{{ course.lecture }}h
            Tut:{{ Math.round(course.tutorial * 5) / 10 }}h
            Lab:{{ Math.round(course.lab * 5) / 10 }}h |
            Math:{{ course.accreditationUnits.mathematics }}
            NS: {{ course.accreditationUnits.naturalSciences }}
            CS: {{ course.accreditationUnits.complementaryStudies }}
            ES: {{ course.accreditationUnits.engineeringSciences }}
            ED: {{ course.accreditationUnits.engineeringDesign }}
            <v-chip-group class="my-n1">
              <v-chip small v-for="courseLabel in activeLabels" :key="courseLabel">{{ courseLabel }}</v-chip>
            </v-chip-group>
          </v-card-text>

          <v-expand-transition>
            <v-card-text v-if="courseWarning[0]" class="py-2">
              <v-icon :color="alertColor" class="mr-2">mdi-alert</v-icon>The following conflicts exist for taking this course:
              <br />
              <ul class="ml-7">
                <li v-for="(warning, index) in courseWarning[1]" :key="index">
                  {{ warning }}
                  <br />
                </li>
              </ul>
            </v-card-text>
          </v-expand-transition>

          <v-card-text class="py-2 v-step-6 v-step-7">{{ course.description }}</v-card-text>

          <v-card-text
            class="py-2"
            v-if="course.schedule && course.schedule.profLastName !== ''"
          >Professor: {{ course.schedule.profFirstName + " " + course.schedule.profLastName }}</v-card-text>

          <v-card-text class="pt-2">
            <span v-if="prerequisiteText">Prerequisites: {{ prerequisiteText }}</span>
            <span v-if="corequisiteText">
              <br />
              Corequisites: {{ corequisiteText }}
            </span>
            <span v-if="exclusionText">
              <br />
              Exclusions: {{ exclusionText }}
            </span>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import CourseCalendar from "./CourseCalendar";

export default {
  name: "CourseCard",
  data: () => ({
    alertColor: "amber accent-4",
    chosenSemester: undefined,
    courseDialog: false
  }),
  props: {
    course: Object,
    detailed: Boolean
  },
  components: {
    CourseCalendar
  },
  methods: {
    toggleStatus: function(course, status) {
      if (this.cardTourActive) return //Changing status breaks the tour
      if (
        this.semesterOptions.length > 1 &&
        this.selectedSemester === undefined &&
        this.chosenSemester === undefined
      ) {
        this.selectedSemester = this.semesterOptions[0];
      }

      //For undoing accidental hiding of completed courses on the search page
      if (course.status !== "completed" && status === "completed") {
        this.$emit("setCompleted", course);
      }

      this.$store.dispatch("toggleStatus", [course, status]);
      this.$store.commit("addRecentlyViewed", course);
    },
    addRecent: function(course) {
      this.$store.commit("addRecentlyViewed", course);
    },
    undoRemove: function(course, status) {
      if (course.status === status) {
        this.$store.commit("updateRemovedCourse", [course, course.status]);
        if (this.$route.name == "home") {
          this.$store.commit("updateRemovedSnackbarHome", true);
        } else {
          this.$store.commit("updateRemovedSnackbarProgress", true);
        }
      }
    },
    reverseSemesterMapping: function(value) {
      return this.course.semester.split("/")[
        this.semesterOptions.indexOf(value)
      ];
    },
    progressTour: function() {
      if (
        this.$tours["introTour"].isRunning &&
        this.$tours["introTour"].currentStep == 2
      ) {
        // Wait until dialog box has opened
        if (this.courseDialog === false) {
          window.setTimeout(this.progressTour, 50);
        }
        // Then progress tour
        else {
          this.$tours["introTour"].nextStep();
        }
      }
    }
  },
  watch: {
    courseDialog: function(value) {
      if (
        value === false &&
        this.$tours["introTour"].isRunning &&
        this.$tours["introTour"].currentStep === 7
      ) {
        this.$tours["introTour"].nextStep();
      }
    }
  },
  computed: {
    cardTourActive() {
      return (
        this.$tours["introTour"].isRunning &&
        this.$tours["introTour"].currentStep < 7
      );
    },
    selectedSemester: {
      get() {
        return this.semesterMapping[
          this.$store.getters.course(this.course.id).chosenSemester
        ];
      },
      set(value) {
        this.$store.dispatch("updateCourseChosenSemester", [
          this.course,
          this.reverseSemesterMapping(value)
        ]);
        this.chosenSemester = value;
      }
    },
    semesterOptions() {
      return this.course.semester
        .split("/")
        .map(semester => this.semesterMapping[semester]);
    },
    activeLabels() {
      var labels = [];

      for (const [key, value] of Object.entries(this.course.labels)) {
        if (value != 0) {
          if (key in this.labelNames) {
            labels.push(this.labelNames[key]);
          }
        }
      }

      return labels;
    },
    prerequisiteText() {
      if (this.course.prerequisites.text == undefined) {
        return undefined;
      } else {
        return this.course.prerequisites.text;
      }
    },
    corequisiteText() {
      if (this.course.corequisites.text == undefined) {
        return undefined;
      } else {
        return this.course.corequisites.text;
      }
    },
    exclusionText() {
      if (this.course.exclusions.text == undefined) {
        return undefined;
      } else {
        return this.course.exclusions.text;
      }
    },
    courseWarning() {
      const result =
        this.exceedsLabelCount[0] ||
        this.calendarConflict[0] ||
        this.missingPrereq[0] ||
        this.missingCoreq[0] ||
        this.notCurrentlyOffered[0] ||
        this.isExcluded[0];

      var message = [];
      if (this.exceedsLabelCount[0]) message.push(this.exceedsLabelCount[1]);
      if (this.calendarConflict[0]) message.push(this.calendarConflict[1]);
      if (this.missingPrereq[0]) message.push(this.missingPrereq[1]);
      if (this.missingCoreq[0]) message.push(this.missingCoreq[1]);
      if (this.isExcluded[0]) message.push(this.isExcluded[1]);
      if (this.notCurrentlyOffered[0])
        message.push(this.notCurrentlyOffered[1]);

      return [result, message];
    },
    exceedsLabelCount() {
      const labelsExceeded = this.labelsExceeded;
      const labelNames = this.labelNames;

      var warningMessage = "";
      for (const labelInfo of labelsExceeded) {
        const labelKey = labelInfo[0];
        if (this.course.labels[labelKey] != 0) {
          warningMessage +=
            "You are taking " +
            labelInfo[2] +
            " too many courses with the " +
            labelNames[labelKey] +
            " label.  Only " +
            labelInfo[1] +
            " of them will count towards graduation requirements.";
        }
      }

      if (warningMessage === "") {
        return [false, ""];
      } else {
        return [true, warningMessage];
      }
    },
    notCurrentlyOffered() {
      const warningMessage = "This course is not offered this year.";
      if (
        this.course.currentlyOffered === 0 &&
        this.course.status === "inProgress"
      )
        return [true, warningMessage];
      return [false, ""];
    },
    calendarConflict() {
      // Needs to be currently taking to be in schedule
      if (this.course.status !== "inProgress") return [false, ""];
      // Must have scheduled classes to have a conflict
      if (!this.course.schedule) return [false, ""];

      var start, end, otherStart, otherEnd;
      const warningMessage =
        "This course has a scheduling conflict, check the calendar for details.  You will need to get the conflict approved.";

      // Get semester TODO: have computed function for this
      const currentSemester =
        this.course.chosenSemester && this.course.chosenSemester != undefined
          ? this.course.chosenSemester
          : this.course.semester;

      // If course is online, it can't have conflicts
      if (currentSemester.includes("OL")) return [false, ""];

      const coursesInProgress = this.coursesInProgress;

      //Filter courses in progress to only include courses in the same semester
      const otherCourses = coursesInProgress.filter(course => {
        const inProgressSemester =
          course.chosenSemester && course.chosenSemester != undefined
            ? course.chosenSemester
            : course.semester;

        return (
          inProgressSemester.includes(currentSemester) ||
          currentSemester.includes(inProgressSemester)
        );
      });

      // Aggregate all classes for this class
      var curCourseTimes = [];
      if (this.course.schedule.LEC) {
        curCourseTimes = curCourseTimes.concat(this.course.schedule.LEC.times);
      }
      if (this.course.schedule.TUT) {
        curCourseTimes = curCourseTimes.concat(this.course.schedule.TUT.times);
      }
      if (this.course.schedule.LAB) {
        curCourseTimes = curCourseTimes.concat(this.course.schedule.LAB.times);
      }

      // Aggregate all classes for other classes this semeseter
      var otherCourseTimes = [];
      for (const otherCourse of otherCourses) {
        if (otherCourse.id !== this.course.id && otherCourse.schedule) {
          if (otherCourse.schedule.LEC) {
            otherCourseTimes = otherCourseTimes.concat(
              otherCourse.schedule.LEC.times
            );
          }
          if (otherCourse.schedule.TUT) {
            otherCourseTimes = otherCourseTimes.concat(
              otherCourse.schedule.TUT.times
            );
          }
          if (otherCourse.schedule.LAB) {
            otherCourseTimes = otherCourseTimes.concat(
              otherCourse.schedule.LAB.times
            );
          }
        }
      }

      //Iterate through all scheduled classes of current course to check for conflicts
      for (const event of curCourseTimes) {
        start = event[0];
        end = event[1];
        for (const otherEvent of otherCourseTimes) {
          //Check against each class of the other courses
          otherStart = otherEvent[0];
          otherEnd = otherEvent[1];
          if (
            Date.parse(start) < Date.parse(otherEnd) &&
            Date.parse(otherStart) < Date.parse(end)
          ) {
            return [true, warningMessage]; // There is a conflict
          }
        }
      }
      return [false, ""];
    },
    missingPrereq() {
      if (
        this.course.status === "" ||
        this.course.status === "completed" ||
        this.course.prerequisites === undefined ||
        this.course.prerequisites.courses === undefined
      ) {
        return [false, ""];
      }

      // Get semester TODO: have computed function for this
      const currentSemester =
        this.course.chosenSemester && this.course.chosenSemester != undefined
          ? this.course.chosenSemester
          : this.course.semester;

      var eligibleCourses, warningMessage;
      // If in progress, prereq must be completed or taken in an earlier semester
      if (this.course.status === "inProgress") {
        eligibleCourses = this.coursesCompleted.concat(
          //Include courses in progress not in the current semester
          this.coursesInProgress.filter(course => {
            const otherCourseSemester =
              course.chosenSemester && course.chosenSemester != undefined
                ? course.chosenSemester
                : course.semester;

            return (
              !otherCourseSemester.includes(currentSemester) &&
              !currentSemester.includes(otherCourseSemester)
            );
          })
        );
        warningMessage =
          "You have not completed all the required prereqs for this course yet.";
      }
      //If saved, prereq must be planned
      if (this.course.status === "saved") {
        eligibleCourses = this.coursesPlanned;
        warningMessage =
          "You have not planned to take all the required prereqs for this course yet.";
      }
      const allCourseCodes = eligibleCourses.map(course => course.courseCode);
      const prereqs = this.course.prerequisites.courses;

      var missingCourseCodes = [];
      function evaluatePreqs(prereqs, courseCodes) {
        let logic = "and";
        let meetsRequirement = true;
        let orTrueFlag = false;
        for (const i in prereqs) {
          let requirement = prereqs[i];

          // Check if it is a nested requirement
          if (Array.isArray(requirement)) {
            const result = evaluatePreqs(requirement, courseCodes);
            if (result) {
              if (logic === "or") {
                orTrueFlag = true;
              }
            } else {
              // Missing required course
              if (logic === "and") meetsRequirement = false;
            }
            continue;
          }

          // Check if it is indicating logic to use
          if (requirement === "all") {
            logic = "and";
            continue;
          }
          if (requirement === "one") {
            logic = "or";
            continue;
          }

          // Required course is found
          if (courseCodes.includes(requirement)) {
            if (logic === "or") {
              orTrueFlag = true;
            }
          } else {
            // Missing required course
            missingCourseCodes.push(requirement);
            if (logic === "and") meetsRequirement = false;
          }
        }
        return meetsRequirement && (logic !== "or" || orTrueFlag);
      }

      let meetsRequirement = evaluatePreqs(prereqs, allCourseCodes);

      if (meetsRequirement) return [false, ""];
      else return [true, warningMessage];
    },
    missingCoreq() {
      // Don't validate coreqs if completed or there are none
      if (
        this.course.status === "" ||
        this.course.status === "completed" ||
        this.course.corequisites === undefined ||
        this.course.corequisites.courses === undefined
      ) {
        return [false, ""];
      }

      // Load other courses being taken with the same status
      let otherCourses;
      if (this.course.status === "inProgress") {
        otherCourses = this.coursesInProgress.map(course => course.courseCode);
      }
      if (this.course.status === "saved") {
        otherCourses = this.coursesSaved.map(course => course.courseCode);
      }

      // Check if all coreqs are satisfied
      const corequisites = this.course.corequisites.courses;
      let excludedCourses = [];
      let logic = "and";
      let orTrueFlag = false;
      let meetsRequirement = true;
      for (const required of corequisites) {
        if (required === "one") {
          logic = "or";
          continue;
        }

        if (otherCourses.includes(required)) {
          if (logic == "or") orTrueFlag = true;
        } else {
          // Missing required course
          excludedCourses.push(required);
          if (logic === "and") meetsRequirement = false;
        }
      }

      // Must both meet requirement and have the orTrueFlag set if it only requires one
      meetsRequirement = meetsRequirement && (logic !== "or" || orTrueFlag);
      if (meetsRequirement) return [false, ""];

      const joinChar = logic === "and" ? ", " : " or ";
      const warningMessage =
        "You are missing this course's corequisite(s): " +
        excludedCourses.join(joinChar);
      return [true, warningMessage];
    },

    isExcluded() {
      // Don't validate if it's already completed or has no exclusions
      if (
        this.course.status == "" ||
        this.course.status == "completed" ||
        this.course.exclusions === undefined ||
        this.course.exclusions.courses === undefined
      ) {
        return [false, ""];
      }

      const exclusions = this.course.exclusions.courses;
      const otherCourses = this.coursesPlanned.map(course => course.courseCode);

      // Check to see if any of the exclusions have already been planned
      var excludedCourses = [];
      for (const excluded of exclusions) {
        if (otherCourses.includes(excluded)) {
          excludedCourses.push(excluded);
        }
      }

      if (excludedCourses.length === 0) {
        return [false, ""];
      }
      const warningMessage =
        "This course has an exclusion with the folowing course(s): " +
        excludedCourses.join(", ");
      return [true, warningMessage];
    },
    ...mapState(["labelNames", "semesterMapping"]),
    ...mapGetters([
      "labelsExceeded",
      "labelNames",
      "coursesInProgress",
      "coursesCompleted",
      "coursesSaved",
      "coursesPlanned"
    ])
  }
};
</script>