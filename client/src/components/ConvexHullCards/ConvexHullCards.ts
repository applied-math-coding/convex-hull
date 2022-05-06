import type { ConvexHullService } from '@/services/convex-hull.service';
import { mapWritableState } from 'pinia';
import { defineComponent } from 'vue';
import ConvexHullPlot from '../ConvexHullPlot/ConvexHullPlot.vue';
import { useStore } from '../store';
import * as dayjs from 'dayjs'
import type { ConvexHull } from '@/models/convex-hull';
import type { Point } from '@/models/point';
import type { Coordinates } from '@/models/coordinates';

export default defineComponent({
    components: { ConvexHullPlot },
    inject: ['convexHullService'],
    data() {
        return {
            convexHullService: this.convexHullService as unknown as ConvexHullService,
            selectedPoints: null as unknown as Point
        }
    },
    async mounted() {
        this.convexHulls = await this.convexHullService.fetchConvexHulls();
    },
    computed: {
        ...mapWritableState(useStore, ['convexHulls']),
        selectedInputPoints(): Coordinates[] {
            return JSON.parse(this.selectedPoints.input);
        },
        selectedOutputPoints(): Coordinates[] {
            return JSON.parse(this.selectedPoints.output);
        }
    },
    methods: {
        formatDate(d: number): string {
            return dayjs.unix(d).format('DD/MM/YYYY HH:mm:ss');
        },
        async handleShow(c: ConvexHull) {
            this.selectedPoints = await this.convexHullService.fetchPoints(c.id as number);
        },
        async handleRemove(c: ConvexHull) {
            await this.convexHullService.deleteConvecHull(c.id as number);
            this.convexHulls = await this.convexHullService.fetchConvexHulls();
        }
    }
});