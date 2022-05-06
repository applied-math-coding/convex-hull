import type { Coordinates } from '@/models/coordinates'
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => {
        return {
            inputPoints: null as unknown as Coordinates[],
            outputPoints: null as unknown as Coordinates[],
            width: 500,
            height: 500
        }
    },
})
