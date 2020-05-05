<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="headline">{{ list }}</v-expansion-panel-header>
    <v-expand-transition>
      <div v-if="year.length>0">
        <v-expansion-panel-content>
          <div>Fall & Winter Semester</div>
        </v-expansion-panel-content>
        <CourseList :courses="year" />
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-if="fall.length>0">
        <v-expansion-panel-content>
          <div>Fall Semester</div>
        </v-expansion-panel-content>
        <CourseList class="v-step-2" :courses="fall" />
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-if="winter.length>0">
        <v-expansion-panel-content>
          <div>Winter Semester</div>
        </v-expansion-panel-content>
        <CourseList class="v-step-2" :courses="winter" />
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-if="summer.length>0">
        <v-expansion-panel-content>
          <div>Summer Semester</div>
        </v-expansion-panel-content>
        <CourseList :courses="summer" />
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-if="online.length>0">
        <v-expansion-panel-content>
          <div>Online</div>
        </v-expansion-panel-content>
        <CourseList :courses="online" />
      </div>
    </v-expand-transition>
  </v-expansion-panel>
</template>

<script>
import CourseList from "./CourseList";

export default {
  props: {
    list: String,
    year: Array,
    fall: Array,
    winter: Array,
    summer: Array,
    online: Array
  },
  components: {
    CourseList
  }
};
</script>