<template xmlns:white-space="http://www.w3.org/1999/xhtml" xmlns:overflow="http://www.w3.org/1999/xhtml">
  <v-app id="qplan">
    <Header />
    <ProgressSidebar />
    <RecentSidebar />
    <v-content>
      <router-view />
      <v-snackbar color="error" v-model="globalErr" :timeout="5000" class="font-weight-bold">
        <v-spacer />
        {{ globalErrMsg }}
        <v-spacer />
      </v-snackbar>
    </v-content>
    <v-tour
      name="introTour"
      :steps="introTourSteps"
      :callbacks="tourCallbacks"
      :options="{ highlight: true }"
    ></v-tour>
  </v-app>
</template>

<script>
import ProgressSidebar from "./components/layout/ProgressSidebar";
import RecentSidebar from "./components/layout/RecentSidebar";
import Header from "./components/layout/Header";
import { mapGetters } from "vuex";

export default {
  props: {
    source: String
  },
  components: {
    Header,
    RecentSidebar,
    ProgressSidebar
  },
  data: function() {
    return {
      introTourSteps: [
        {
          target: ".v-step-0",
          header: {
            title: "Welcome to QPlan!"
          },
          content: "This quick tour will show you around."
        },
        {
          target: ".v-step-1",
          header: {
            title: "Homepage"
          },
          content:
            "<div class='text-justify'>Here's an overview of your current plan:<ul><li>Courses you've completed</li> <li>Courses you're taking this year </li> <li>Courses saved for future years</li></ul></div>",
          params: {
            placement: "right",
            highlight: false
          }
        },
        {
          target: ".v-step-2",
          content: "Try clicking on a course",
          params: {
            highlight: false
          }
        },
        {
          target: ".v-step-3",
          content: "Here you can see more details about each course",
          params: {
            placement: "top"
          }
        },
        {
          target: ".v-step-4",
          content: "Credits, class hours and accreditation units",
          params: {
            placement: "top"
          }
        },
        {
          target: ".v-step-5",
          content: "How the course fits in your schedule",
          params: {
            placement: "top"
          }
        },
        {
          target: ".v-step-6",
          content: "Course description, professor and prerequisites (if any)",
          params: {
            placement: "bottom",
            highlight: false
          }
        },
        {
          target: ".v-step-7",
          content: "Close this popup by clicking outside",
          params: {
            placement: "bottom",
            highlight: false
          }
        },
        {
          target: ".v-step-8",
          header: {
            title: "Progress Sidebar"
          },
          content:
            "Here you can see your progress towards all your graduation requirements",
          params: {
            placement: "right",
            highlight: false
          }
        },
        {
          target: ".v-step-9",
          content:
            "Each progress bar shows how much you've completed and planned",
          params: {
            placement: "right"
          }
        },
        {
          target: ".v-step-10",
          content:
            "Click on the 'DETAILED PROGRESS' button to go to the Progress page",
          params: {
            placement: "top",
            highlight: false
          }
        },
        {
          target: ".v-step-11",
          header: {
            title: "Detailed Progress Page"
          },
          content: "Here are the requirements you must satisfy to graduate",
          params: {
            placement: "right"
          }
        },
        {
          target: ".v-step-12",
          content: "To find more courses, you can search or view them all",
          params: {
            placement: "bottom"
          }
        },
        {
          target: ".v-step-13",
          content: "Click 'Browse All' to go to the Search page",
          params: {
            placement: "bottom"
          }
        },
        {
          target: ".v-step-14",
          header: {
            title: "Search Page"
          },
          content: "Here you can see all offered courses",
          params: {
            highlight: false,
            placement: "left"
          }
        },
        {
          target: ".v-step-15",
          content: "You can filter and sort the courses",
          params: {
            placement: "bottom",
            highlight: false
          }
        },
        {
          target: ".v-step-16",
          content:
            "<div class='text-justify'>Add courses to your plan:<ul><li>Completed</li><li>Taking this year</li><li>Taking in the future</li></ul></div>",
          params: {
            highlight: false,
            placement: "left"
          }
        },
        {
          target: ".v-step-17",
          content: "Click on the house to bring us back to the homepage",
          params: {
            placement: "bottom"
          }
        },
        {
          target: ".v-step-18",
          content:
            "Thats the end 🎉<br>Please verify all the courses we've preloaded for you. Good luck!",
          params: {
            placement: "right"
          }
        }
      ],
      tourCallbacks: {
        onPreviousStep: this.previousStepCallback,
        onNextStep: this.nextStepCallback
      }
    };
  },
  methods: {
    isVisible: function(element) {
      //start with initial element to check visibility and display
      var el = document.querySelector(element);
      if (!el) return false; //Not visible if doesn't exist

      //display and visibility vary per browser and must be sought in different ways depending on the browser
      var t1 = el.currentStyle
        ? el.currentStyle.visibility
        : getComputedStyle(el, null).visibility;
      var t2 = el.currentStyle
        ? el.currentStyle.display
        : getComputedStyle(el, null).display;
      //if either of these are true, then the element is not visible
      if (t1 === "hidden" || t2 === "none") {
        return false;
      }
      //This regex is used to scan the parent nodes all the way up to the body element
      while (!/body/i.test(el)) {
        //get the next parent node
        el = el.parentNode;
        //grab the values, if available,
        t1 = el.currentStyle
          ? el.currentStyle.visibility
          : getComputedStyle(el, null).visibility;
        t2 = el.currentStyle
          ? el.currentStyle.display
          : getComputedStyle(el, null).display;
        if (t1 === "hidden" || t2 === "none") {
          return false;
        }
      }
      //if all scans are not successful, then the element is visible
      return true;
    },
    previousStepCallback(currentStep) {
      const target = ".v-step-" + String(currentStep - 1);

      // Scroll to top of search page when showing course status buttons
      if (currentStep == 17 || currentStep == 15) {
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 50);
      }

      if (!this.isVisible(target)) {
        this.$tours["introTour"].nextStep();
      }
    },
    nextStepCallback(currentStep) {
      const target = ".v-step-" + String(currentStep + 1);

      // Scroll to top of search page when showing course status buttons
      if (currentStep == 15 || currentStep == 13) {
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 50);
      }

      // Don't progress past the course card until it is closed
      if (currentStep == 7 && this.isVisible(".v-step-3")) {
        this.$tours["introTour"].previousStep();
        return
      }

      if (!this.isVisible(target)) {
        this.$tours["introTour"].previousStep();
      }
    }
  },
  computed: {
    ...mapGetters([
      "authenticated",
      "creatingAccount",
      "globalError",
      "globalErrorMessage"
    ]),
    globalErr: {
      get: function() {
        return this.globalError;
      },
      set: function(value) {
        this.$store.commit("updateGlobalError", value);
      }
    },
    globalErrMsg: {
      get: function() {
        return this.globalErrorMessage;
      },
      set: function(value) {
        this.$store.commit("updateGlobalErrorMessage", value);
      }
    }
  }
};
</script>

<style>
#qplan .v-navigation-drawer__border {
  display: none;
}
.rounded-card {
  border-radius: 50px;
}

/* Remove the underline and blue color from links */
.v-application a {
  text-decoration: none;
  color: black !important;
}

.v-calendar-daily_head-weekday {
  margin-top: 5px;
  margin-bottom: 10px;
  font-weight: bold;
}

.v-calendar-daily_head-day-label {
  display: none;
}

/* Modify how calendar events are displayed */
.v-event-timed {
  border-radius: 8px !important;
  margin-left: 5px !important;
}

.v-calendar-daily__head {
  margin-right: 17px !important;
}

.v-toolbar__content {
  margin-bottom: -10px;
}

/* Modifies the banner at the top of the progress page */
.v-banner__wrapper {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

/* Hide scroll bar on navigation drawers */
.v-navigation-drawer__content {
  overflow-y: hidden;
}

/* Show scroll bar on navigation drawers when hovering over them */
.v-navigation-drawer__content:hover {
  overflow-y: auto;
}

/* Make the tour highlight shadow cover the rest of the screen */
.v-tour__target--highlighted {
  box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.4) !important;
  -webkit-box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.4) !important;
}
</style>