<script lang="ts">
import ConvexHullPlot from "./components/ConvexHullPlot.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { ConvexHullPlot },
});
</script>

<template>
  <header>
    <h1 class="text-center">Convex Hull of Points</h1>
  </header>
  <main>
    <ConvexHullPlot></ConvexHullPlot>
  </main>
</template>

<style lang="scss">
@import "./assets/base.scss";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}
</style>
