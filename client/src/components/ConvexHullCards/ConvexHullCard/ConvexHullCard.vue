<template>
  <div class="card">
    <div class="font-bold">Convex Hull</div>
    <div class="text-sm">
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
      <Button
        label="show"
        class="p-button-link text-sm"
        :loading="fetchingPoints"
        @click="handleShow()"
      />
      <Button
        label="remove"
        class="p-button-link text-sm"
        :loading="removing"
        @click="handleRemove()"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ConvexHullCard.ts"></script>
<style scoped lang="scss" src="./ConvexHullCard.scss"></style>