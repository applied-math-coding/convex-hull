import type { ConvexHullService } from '@/services/convex-hull.service';
import { mapWritableState } from 'pinia';
import { defineComponent } from 'vue';
import { useStore } from '../../store';
import * as dayjs from 'dayjs'
import { ConvexHull } from '@/models/convex-hull';
import type { Point } from '@/models/point';
import type { Coordinates } from '@/models/coordinates';
import Button from 'primevue/button';
import ConvexHullPlot from '@/components/ConvexHullPlot/ConvexHullPlot.vue';

export default defineComponent({
    components: { ConvexHullPlot, Button },
    inject: ['convexHullService'],
    props: {
        convexHull: {
            type: ConvexHull,
            required: true
        }
    },
    data() {
        return {
            convexHullService: this.convexHullService as unknown as ConvexHullService,
            selectedPoints: null as unknown as Point,
            fetchingPoints: false,
            removing: false
        }
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
        async handleShow() {
            this.fetchingPoints = true;
            this.selectedPoints = await this.convexHullService.fetchPoints(this.convexHull?.id as number);
            this.fetchingPoints = false;
        },
        async handleRemove() {
            this.removing = true;
            await this.convexHullService.deleteConvecHull(this.convexHull?.id as number);
            this.convexHulls = await this.convexHullService.fetchConvexHulls();
        }
    }
});