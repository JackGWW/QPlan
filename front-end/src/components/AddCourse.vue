<template>
  <v-card>
    <v-card-title>
      Add a Course
      <v-spacer />
      <span class="subtitle-1">Status:</span>
      <!-- Completed button -->
      <v-tooltip bottom nudge-bottom="-6" open-delay="500">
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            small
            v-on:click="status = 3"
            v-on:click.stop
            v-on="on"
            id="completed-addCourse"
          >
            <div v-if="status == 3">
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
            v-on:click="status = 2"
            v-on:click.stop
            v-on="on"
            id="in-progress-addCourse"
          >
            <div v-if="status == 2">
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
            v-on:click="status = 1"
            v-on:click.stop
            v-on="on"
            id="saved-for-later-addCourse"
          >
            <div v-if="status == 1">
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
    <v-card-subtitle>Add electives, exchange courses or anything missing.</v-card-subtitle>

    <!-- Regular course info form -->
    <v-card-text class="pb-0">
      <v-form ref="regularForm">
        <v-row dense>
          <v-col>
            <v-text-field
              v-model="prefix"
              :rules="[rules.required, rules.max4Char]"
              label="Prefix"
              placeholder="E.g. APSC"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="code"
              :rules="[rules.required, rules.number, rules.max3Char]"
              label="Code"
              placeholder="E.g. 100"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-text-field
              :rules="[rules.required]"
              v-model="name"
              label="Name"
              placeholder="E.g. Engineering Practice 1"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="description"
              label="Description"
              placeholder="E.g. This course introduces fundamental professional engineering skills..."
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-select
              :rules="[rules.required]"
              :items="semesterOptions"
              v-model="semester"
              label="Semester"
              placeholder="E.g. Fall"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              :rules="[rules.required]"
              v-model="year"
              :items="schoolYearOptions"
              label="School Year"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field :rules="[rules.required, rules.float]" v-model="credits" label="Credits"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-btn class="ml-6" @click="expandAddCourse = !expandAddCourse">
      <span v-if="!expandAddCourse">More options</span>
      <span v-else>Hide Options</span>
    </v-btn>

    <!-- Additional options -->
    <div v-show="expandAddCourse">
      <v-expand-transition>
        <v-card-text class="px-6">
          <v-divider class="mb-3"></v-divider>
          <v-form ref="extraForm">
            <v-row dense>
              <span class="ml-1 font-weight-bold">Accredidation Units (AUs)</span>
            </v-row>
            <v-row dense>
              <v-col>
                <v-text-field :rules="[rules.number]" label="Mathematics (Math)" v-model="math" />
              </v-col>
              <v-col>
                <v-text-field :rules="[rules.number]" label="Natural Sciences (NS)" v-model="ns" />
              </v-col>
              <v-col>
                <v-text-field
                  :rules="[rules.number]"
                  label="Complementary Studies (CS)"
                  v-model="cs"
                />
              </v-col>
              <v-col>
                <v-text-field
                  :rules="[rules.number]"
                  label="Engineering Sciences (ES)"
                  v-model="es"
                />
              </v-col>
              <v-col>
                <v-text-field :rules="[rules.number]" label="Engineering Design (ED)" v-model="ed" />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-select
                  v-model="labels"
                  :items="allLabels"
                  clearable
                  multiple
                  label="Labels"
                  chips
                  small-chips
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-expand-transition>
    </div>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="addCourse()" color="green" rounded>Add Course</v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "AddCourse",
  data() {
    return {
      expandAddCourse: false,
      year: undefined,
      prefix: undefined,
      code: undefined,
      name: "",
      status: 0,
      semester: undefined,
      semesterOptions: ["Fall", "Winter", "Summer", "Fall+Winter", "Online"],
      semesterMapping: {
        Fall: "F",
        Winter: "W",
        Summer: "W",
        "Fall+Winter": "FW",
        Online: "OL"
      },
      description: "",
      math: 0,
      ns: 0,
      cs: 36,
      es: 0,
      ed: 0,
      credits: 3,
      labels: ["Custom Course"],
      rules: {
        required: value => !!value || "Required",
        number: value => /^\d+$/.test(value) || "Must be a number",
        float: value => /^\d+(\.\d+)?$/.test(value) || "Must be a number",
        max3Char: value =>
          value === undefined ||
          value.length <= 3 ||
          "Cannot be greater than 999",
        max4Char: value =>
          value === undefined ||
          value.length <= 4 ||
          "Cannot be more than 4 characters"
      }
    };
  },
  computed: {
    ...mapState(["labelNames", "apiUrl"]),
    allLabels() {
      var labels = [];
      for (const [, value] of Object.entries(this.labelNames)) {
        labels.push(value);
      }
      return labels;
    },
    schoolYearOptions() {
      const date = new Date();
      const curYear = date.getFullYear();
      const curMonth = date.getMonth();
      const schoolStartYear = curMonth > 2 ? curYear : curYear - 1;
      const yearOffsets = [-4, -3, -2, -1, 0, 1, 2];

      let result = [];
      for (const offset of yearOffsets) {
        result.push(
          String(schoolStartYear + offset) +
            "-" +
            String(schoolStartYear + offset + 1)
        );
      }

      return result;
    }
  },
  methods: {
    addCourse: async function() {
      if (
        !this.$refs.regularForm.validate() ||
        !this.$refs.extraForm.validate()
      ) {
        this.$store.commit(
          "displayGlobalError",
          "Make sure all fields are correctly filled out"
        );
        return;
      }
      const payload = {
        year: this.year,
        prefix: this.prefix,
        code: this.code,
        status: this.status,
        name: this.name,
        term: this.semesterMapping[this.semester],
        description: this.description,
        math: this.math,
        natSci: this.ns,
        complStudies: this.cs,
        engSci: this.es,
        engDesign: this.ed,
        credits: this.credits
      };
      const postURL = this.apiUrl + "/courses/custom/add";
      try {
        let response = await this.$axios.post(postURL, payload, {
          withCredentials: true
        });
        if (response.data.isSuccess) {
          this.$store.commit("addCourse", response.data.set);
          this.prefix = undefined;
          this.code = undefined;
          this.status = 0;
          this.name = undefined;
          this.semester = undefined;
          this.description = "";
          this.math = 0;
          this.ns = 0;
          this.cs = 36;
          this.es = 0;
          this.ed = 0;
          this.credits = 3;
          this.$emit("courseAdded");
        } else {
          console.log(response);
          this.$store.commit(
            "displayGlobalError",
            "Error: Can't add course, try again later"
          );
        }
      } catch (e) {
        console.log(e);
        this.$store.commit(
          "displayGlobalError",
          "Error: Can't add course, try again later"
        );
      }
    }
  },
  mounted: function() {
    // Set the default value for the school year of the course
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth();
    const schoolStartYear = curMonth > 2 ? curYear : curYear - 1;

    this.year = String(schoolStartYear) + "-" + String(schoolStartYear + 1);
  }
};
</script>