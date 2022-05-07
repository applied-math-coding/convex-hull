<template>
  <div class="cards-container">
    <ConvexHullCard
      v-for="convexHull in convexHulls"
      :key="convexHull.id"
      :convex-hull="convexHull"
    >
    </ConvexHullCard>
  </div>
</template>

<script lang="ts" src="./ConvexHullCards.ts"></script>
<style scoped lang="scss" src="./ConvexHullCards.scss"></style>