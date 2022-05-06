import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import type { ConvexHullService } from '@/services/convex-hull.service';
import { ConvexHull } from '@/models/convex-hull';
import { Point } from '@/models/point';
import type { Coordinates } from '@/models/coordinates';
import { useStore } from '../store';
import ConvexHullPlot from '../ConvexHullPlot/ConvexHullPlot.vue';
import { mapState } from 'pinia';

let ctx: CanvasRenderingContext2D;

export default defineComponent({
  components: { Button, InputNumber, ConvexHullPlot },
  inject: ['convexHullService'],
  data() {
    return {
      numberPoints: 10,
      computing: false,
      saving: false,
      inputPoints: null as unknown as Coordinates[],
      outputPoints: null as unknown as Coordinates[],
      convexHullService: this.convexHullService as unknown as ConvexHullService
    }
  },
  mounted() {
    this.handleCreate();
  },
  computed: {
    ...mapState(useStore, ['width', 'height'])
  },
  methods: {
    async handleCreate() {
      this.inputPoints = this.createRandomPoints(this.numberPoints);
      this.outputPoints = await this.computeConvexHull(this.inputPoints);
    },
    async handleSave() {
      this.saving = true;
      await this.convexHullService.saveConvexHull(
        new ConvexHull(),
        new Point(JSON.stringify(this.inputPoints), JSON.stringify(this.outputPoints))
      );
      this.saving = false;
    },
    async computeConvexHull(points: Coordinates[]): Promise<Coordinates[]> {
      this.computing = true;
      const hull = await fetchConvexHull(points);
      this.computing = false;
      return hull;
    },
    createRandomPoints(count: number): Coordinates[] {
      return [...Array(count)]
        .map(() => ({ x: Math.random() * this.width, y: Math.random() * this.height }));
    }
  }
});

function fetchConvexHull(points: Coordinates[]): Promise<Coordinates[]> {
  return fetch('/api/convex-hull', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(points)
  }).then(r => r.json());
}

