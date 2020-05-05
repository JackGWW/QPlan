<template>
  <div>
    <v-card class="mb-2" rounded>
      <v-progress-linear
        :buffer-value="plannedPercent"
        height="25"
        :value="completePercent"
        striped
        :color="barColor"
      >
        <span
          v-if="!hideValue"
        >{{ Math.round((valuePlanned + valueComplete) * 10) / 10 }} / {{ requirement }} {{ type }}</span>
      </v-progress-linear>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    properties: Array,
    propertyType: String,
    requirement: Number,
    type: String,
    hideValue: Boolean,
    color: String
  },
  computed: {
    plannedPercent: function() {
      return (
        (this.valuePlanned / this.requirement) * 100 +
        (this.valueComplete / this.requirement) * 100
      );
    },
    completePercent: function() {
      return (this.valueComplete / this.requirement) * 100;
    },
    valueComplete: function() {
      return this.$store.getters.sumCompletedProperties(
        this.propertyType,
        this.properties
      );
    },
    valuePlanned: function() {
      return (
        this.$store.getters.sumInProgressProperties(
          this.propertyType,
          this.properties
        ) +
        this.$store.getters.sumSavedProperties(
          this.propertyType,
          this.properties
        )
      );
    },
    barColor: function() {
      if (this.color !== undefined) {
        return this.color;
      }
      const filled = this.plannedPercent;
      const colors = {
        10: "red darken-1",
        20: "red lighten-2",
        30: "deep-orange lighten-3",
        40: "orange lighten-3",
        50: "amber lighten-3",
        60: "yellow lighten-3",
        70: "lime accent-1",
        80: "lime lighten-3",
        90: "light-green lighten-3",
        100: "green lighten-3",
        10000: "green lighten-1"
      };
      for (const [key, value] of Object.entries(colors)) {
        if (filled < key) {
          return value;
        }
      }
      return "green";
    }
  }
};
</script>
