<script lang="ts">
import ConvexHullCreator from "./components/ConvexHullCreator/ConvexHullCreator.vue";
import ConvexHullCards from "./components/ConvexHullCards/ConvexHullCards.vue";
import { defineComponent } from "vue";
import { ConvexHullService } from "./services/convex-hull.service";

export default defineComponent({
  components: { ConvexHullCreator, ConvexHullCards },
  provide() {
    return {
      convexHullService: new ConvexHullService(),
    };
  },
});
</script>

<template>
  <header>
    <h1 class="text-center">Convex Hull of Points</h1>
  </header>
  <main>
    <ConvexHullCreator></ConvexHullCreator>
    <ConvexHullCards></ConvexHullCards>
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
