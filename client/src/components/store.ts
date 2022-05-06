import type { ConvexHull } from '@/models/convex-hull'
import type { Coordinates } from '@/models/coordinates'
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => {
        return {
            inputPoints: [] as Coordinates[],
            outputPoints: [] as Coordinates[],
            width: 500,
            height: 500,
            convexHulls: [] as ConvexHull[]
        }
    },
})
