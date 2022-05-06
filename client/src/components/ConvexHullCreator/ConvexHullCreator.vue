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
    <div>
      <Button
        label="Save"
        :v-if="!computing"
        :loading="saving"
        @click="handleSave()"
      />
    </div>
  </div>
  <div class="canvas-container">
    <ConvexHullPlot
      :input-points="inputPoints"
      :output-points="outputPoints"
    ></ConvexHullPlot>
  </div>
</template>

<script lang="ts" src="./ConvexHullCreator.ts"></script>
<style lang="scss" src="./ConvexHullCreator.scss"></style>