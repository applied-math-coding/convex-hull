<template>
  <div class="actions">
    <div>
      <Button label="Create" :loading="computing" @click="handleCreate()" />
    </div>
    <div>
      <div class="mb-1">Number of Points:</div>
      <InputNumber
        v-model="numberPoints"
        :min="5"
        :max="1000"
        :showButtons="true"
      />
    </div>
  </div>
  <div class="canvas-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" src="./ConvexHullPlot.ts"></script>
<style lang="scss" src="./ConvexHullPlot.scss"></style>