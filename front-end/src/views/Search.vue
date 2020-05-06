<template>
  <div class="elevation-4 mx-2">
    <div class="v-step-15 elevation-6" :style="headerStyling">
      <!-- Filters  -->
      <v-slide-group show-arrows class="mb-n6 mt-n2">
        <v-row dense>
          <v-col>
            <v-overflow-btn
              v-model="selectedSemester"
              :items="semesterOptions"
              clearable
              multiple
              label="Semester"
              id="semester"
            ></v-overflow-btn>
          </v-col>
          <v-col>
            <v-overflow-btn
              v-model="selected00Level"
              :items="all00Levels"
              clearable
              multiple
              label="00's Level"
              id="00s-level"
            ></v-overflow-btn>
          </v-col>
          <v-col>
            <v-overflow-btn
              v-model="selectedLabels"
              :items="allLabels"
              clearable
              multiple
              label="Labels"
              id="labels"
            />
          </v-col>
          <v-col>
            <v-overflow-btn
              v-model="selectedPrefix"
              :items="prefixOptions"
              clearable
              multiple
              label="Prefix"
              id="prefix"
            ></v-overflow-btn>
          </v-col>
          <v-col>
            <v-overflow-btn
              v-model="selectedDiscpline"
              :items="validDisciplines"
              clearable
              label="Discipline"
              id="discipline"
            ></v-overflow-btn>
          </v-col>
        </v-row>
      </v-slide-group>

      <!-- Active filters -->
      <v-chip-group show-arrows class="mb-n1 pl-2">
        <v-chip
          v-if="query != undefined && query != ''"
          close
          @click:close="query = undefined"
          id="query-chip"
        >Search: {{ query }}</v-chip>
        <v-chip
          v-if="selectedSemester.length > 0"
          close
          @click:close="selectedSemester = []"
          id="semester-chip"
        >Semester: {{ selectedSemester.join(" or ") }}</v-chip>
        <v-chip
          v-if="selected00Level.length > 0"
          close
          @click:close="selected00Level = []"
          id="00s-chip"
        >00's Level: {{ selected00Level.join(" or ") }}</v-chip>
        <v-chip
          v-if="selectedLabels.length > 0"
          close
          @click:close="selectedLabels = []"
          id="labels-chip"
        >Label: {{ selectedLabels.join(" or ") }}</v-chip>
        <v-chip
          v-if="selectedPrefix.length > 0"
          close
          @click:close="selectedPrefix = []"
          id="prefix-chip"
        >Prefix: {{ selectedPrefix.join(" or ") }}</v-chip>
        <v-chip
          v-if="selectedDiscpline != undefined"
          close
          @click:close="selectedDiscpline = undefined"
          id="discipline-chip"
        >Discipline: {{ selectedDiscpline }}</v-chip>
        <v-spacer />
        <v-switch
          v-model="hideComplete"
          color="indigo lighten-1"
          label="Hide Completed"
          class="mt-1 mb-n4 mr-2"
          id="hide-complete"
        ></v-switch>
      </v-chip-group>

      <!-- Sort bar -->
      <v-slide-group show-arrows>
        <v-toolbar dense color="grey lighten-5">
          <span class="mr-5 body-2 font-weight-medium">{{ filteredCourses.length }} Results</span>
          <v-spacer />
          <span class="body-2 font-italic font-weight-bold">SORT</span>:
          <v-btn-toggle v-model="selectedSortButton" mandatory dense group tile color="indigo">
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" id="sort-prefix">Prefix</v-btn>
              </template>
              <span>Course Prefix</span>
            </v-tooltip>
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" id="sort-name">Name</v-btn>
              </template>
              <span>Course Name</span>
            </v-tooltip>
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" id="sort-credits">Credits</v-btn>
              </template>
              <span># Credits</span>
            </v-tooltip>
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" id="sort-math">Math</v-btn>
              </template>
              <span># Mathematics AUs</span>
            </v-tooltip>
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" id="sort-ns">NS</v-btn>
              </template>
              <span># Natural Sciences AUs</span>
            </v-tooltip>
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" id="sort-cs">CS</v-btn>
              </template>
              <span># Complementary Studies AUs</span>
            </v-tooltip>
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" id="sort-es">ES</v-btn>
              </template>
              <span># Engineering Sciences AUs</span>
            </v-tooltip>
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" id="sort-ed">ED</v-btn>
              </template>
              <span># Engineering Design AUs</span>
            </v-tooltip>
          </v-btn-toggle>
          <v-divider vertical inset></v-divider>
          <div class="pl-1">
            <v-tooltip bottom nudge-top="4" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-btn text max-width="39" min-width="39" v-on="on" id="sort-direction">
                  <v-icon @click="sortDecending = false" v-if="sortDecending">mdi-sort-descending</v-icon>
                  <v-icon @click="sortDecending = true" v-else>mdi-sort-ascending</v-icon>
                </v-btn>
              </template>
              <span>Reverse Sort Order</span>
            </v-tooltip>
          </div>
        </v-toolbar>
      </v-slide-group>
    </div>

    <!-- Course card results -->
    <v-container  style="margin-top: 160px;">
      <CourseCard
        v-for="course in paginatedCourses"
        :key="course.id"
        detailed
        v-on:setCompleted="courseSetCompleted"
        class="mt-1 mb-3 mx-3 elevation-1 v-step-14"
        :course="course"
      />
    </v-container>
    <div style="margin-bottom: 130px" />

    <!-- Custom course popup -->
    <v-dialog v-model="addCourseDialog" width="1000">
      <template v-slot:activator="{ on: dialog }">
        <v-tooltip top open-delay="500">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              fab
              bottom
              fixed
              v-on="{ ...tooltip, ...dialog }"
              v-bind:style="fabRightMargin"
              color="indigo lighten-1"
              class="mb-12"
              id="custom-course"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Add a Course</span>
        </v-tooltip>
      </template>
      <AddCourse @courseAdded="addCourseDialog = false" />
    </v-dialog>

    <!-- Page selector -->
    <v-bottom-navigation :style="paginationLeftMargin" :width="paginationWidth" fixed>
      <v-pagination v-model="page" :length="numPages" total-visible="10"></v-pagination>
    </v-bottom-navigation>

    <v-snackbar bottom :timeout="3000" v-model="snackbar">
      Undo completed? (Course now hidden)
      <v-btn id="undo" text @click="undoCompleted" @click.stop>Undo</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import CourseCard from "../components/courses/CourseCard";
import AddCourse from "../components/AddCourse";
import { mapState } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      semesterOptions: ["Fall", "Winter", "Summer", "Fall+Winter", "Online"],
      all00Levels: ["100", "200", "300", "400"],
      hideComplete: false,
      selectedSemester: [],
      selectedPrefix: [],
      selected00Level: [],
      selectedDiscpline: this.$store.getters.userDiscipline,
      sortDecending: true,
      buttonSortMapping: [
        "prefix",
        "name",
        "credits",
        "mathematics",
        "naturalSciences",
        "complementaryStudies",
        "engineeringSciences",
        "engineeringDesign"
      ],
      page: 1,
      maxCoursesDisplayed: 20,
      screenWidth: 0,
      lastCompleted: undefined,
      lastCompletedStatus: undefined,
      snackbar: false,
      addCourseDialog: false,
    };
  },
  props: {
    query: String,
    sortBy: {
      type: String,
      default: "name"
    },
    selectedLabels: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    ...mapState([
      "validDisciplines",
      "disciplinePrefixMapping",
      "semesterMapping",
      "courses",
      "labelNames"
    ]),
    prefixOptions() {
      if (this.selectedDiscpline === undefined)
        return this.$store.getters.allPrefixes;
      return this.disciplinePrefixMapping[this.selectedDiscpline];
    },
    allLabels() {
      var labels = [];
      for (const [, value] of Object.entries(this.labelNames)) {
        labels.push(value);
      }
      return labels;
    },
    fabRightMargin() {
      var margin = 22 + 300 * this.$store.getters.showRecentSidebar;
      return "right: " + margin + "px";
    },
    paginationLeftMargin() {
      const leftMargin = 8 + 300 * this.$store.getters.showProgressSidebar;
      return "left: " + leftMargin + "px;";
    },
    paginationWidth() {
      return (
        this.screenWidth -
        33 -
        300 * this.$store.getters.showProgressSidebar -
        300 * this.$store.getters.showRecentSidebar
      );
    },
    headerStyling(){
      let style = "position: fixed; top: 0; margin-top: 64px; z-index:1; background-color: white;"
      style += " width: " + this.paginationWidth + "px;"
      return style
    },
    numPages() {
      return Math.ceil(this.filteredCourses.length / this.maxCoursesDisplayed);
    },
    paginatedCourses() {
      const courses = this.filteredCourses;
      return courses.slice(
        (this.page - 1) * this.maxCoursesDisplayed,
        this.page * this.maxCoursesDisplayed
      );
    },
    selectedSortButton: {
      get() {
        return this.buttonSortMapping.indexOf(this.sortBy);
      },
      set(value) {
        this.sortBy = this.buttonSortMapping[value];
      }
    },
    filteredCourses() {
      const filters = this.filters;
      const array = this.courses;
      const filterKeys = Object.keys(filters);
      var filteredArray = array.filter(item => {
        // validates all filter criteria
        return filterKeys.every(key => {
          // ignores non-function predicates
          if (typeof filters[key] !== "function") return true;
          return filters[key](item[key]);
        });
      });
      return filteredArray.sort(
        this.compareValues(this.sortBy, this.sortDecending)
      );
    },
    // Invert dictionary from code:name to name:code
    labelKeys() {
      var swapped = {};
      for (var key in this.labelNames) {
        swapped[this.labelNames[key]] = key;
      }
      return swapped;
    },
    // Stores custom filters for each property
    filters() {
      return {
        semester: semester => {
          if (this.selectedSemester.length === 0) return true;
          if (semester == "") return false;

          semester = this.semesterMapping[semester];
          for (const toCheck of this.selectedSemester) {
            if (semester.includes(toCheck)) return true;
          }
          return false;
        },
        prefix: prefix =>
          (this.selectedPrefix.includes(prefix) ||
            this.selectedPrefix.length === 0) &&
          (this.selectedDiscpline === undefined ||
            this.disciplinePrefixMapping[this.selectedDiscpline].includes(
              prefix
            )),
        id: id =>
          this.query === "" ||
          this.query === undefined ||
          id.toLowerCase().includes(this.query.toLowerCase()),
        code: code =>
          this.selected00Level.length === 0 ||
          this.selected00Level
            .map(level => String(level).charAt(0))
            .includes(String(code).charAt(0)),
        status: status => !(status == "completed" && this.hideComplete),
        labels: labels => {
          if (this.selectedLabels.length == 0) {
            return true;
          }
          for (const labelName of this.selectedLabels) {
            var labelKey = this.labelKeys[labelName];

            if (labels[labelKey] > 0) {
              return true;
            }
          }
          return false;
        }
      };
    }
  },
  methods: {
    compareValues: function(key, sortDescending) {
      //Sort A-Z and 99-0 be default
      var reverseSort = 1
      if(this.sortBy === "name" || this.sortBy === "prefix") reverseSort = -1
      
      return function innerSort(a, b) {
        const auKeys = [
          "mathematics",
          "naturalSciences",
          "complementaryStudies",
          "engineeringSciences",
          "engineeringDesign"
        ];
        var varA, varB;
        if (auKeys.includes(key)) {
          varA = a["accreditationUnits"][key];
          varB = b["accreditationUnits"][key];
        } else {
          varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
          varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
        }
        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return sortDescending ? comparison * -1 * reverseSort : comparison * reverseSort;
      };
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    courseSetCompleted(value) {
      if (this.hideComplete) {
        this.lastCompleted = value;
        this.lastCompletedStatus = value.status;
        this.snackbar = true;
      }
    },
    undoCompleted() {
      this.lastCompleted.status = this.lastCompletedStatus;
    }
  },
  components: {
    CourseCard,
    AddCourse
  },
  beforeRouteUpdate(to, from, next) {
    this.query = to.params.query;
    next();
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>
