import type { ConvexHullService } from '@/services/convex-hull.service';
import { mapWritableState } from 'pinia';
import { defineComponent } from 'vue';
import { useStore } from '../store';
import ConvexHullCard from './ConvexHullCard/ConvexHullCard.vue';

export default defineComponent({
    components: { ConvexHullCard },
    inject: ['convexHullService'],
    data() {
        return {
            convexHullService: this.convexHullService as unknown as ConvexHullService,
        }
    },
    async mounted() {
        this.convexHulls = await this.convexHullService.fetchConvexHulls();
    },
    computed: {
        ...mapWritableState(useStore, ['convexHulls']),
    }
});