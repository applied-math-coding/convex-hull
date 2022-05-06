<template>
  <div class="cards-container">
    <div class="card" v-for="convexHull in convexHulls" :key="convexHull.id">
      <div>Convex Hull</div>
      <div>
        created at {{ formatDate(convexHull.created.secs_since_epoch) }}
      </div>
      <div v-if="convexHull.id === selectedPoints?.convexHullId">
        <ConvexHullPlot
          :input-points="selectedInputPoints"
          :output-points="selectedOutputPoints"
          scale="0.25"
        ></ConvexHullPlot>
      </div>
      <div class="actions">
        <div @click="handleShow(convexHull)">show</div>
        <div @click="handleRemove(convexHull)">remove</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ConvexHullCards.ts"></script>