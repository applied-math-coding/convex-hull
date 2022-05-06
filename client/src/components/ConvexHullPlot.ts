import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import type { ConvexHullService } from '@/services/convex-hull.service';
import { ConvexHull } from '@/models/convex-hull';
import { Point } from '@/models/point';

type Coordinates = { x: number, y: number };
let ctx: CanvasRenderingContext2D;

export default defineComponent({
  components: { Button, InputNumber },
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
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = 500;
    canvas.height = 500;
    this.handleCreate();
  },
  methods: {
    async handleCreate() {
      clearCanvas();
      this.inputPoints = createRandomPoints(this.numberPoints);
      renderPoints(this.inputPoints);
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
      renderHull(hull);
      this.computing = false;
      return hull;
    }
  }
});

function clearCanvas() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fetchConvexHull(points: Coordinates[]): Promise<Coordinates[]> {
  return fetch('/api/convex-hull', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(points)
  }).then(r => r.json());
}

function renderHull(points: Coordinates[]) {
  points = points.map(p => toCanvasCoords(p));
  ctx.beginPath();
  points.forEach((p, idx) => {
    if (idx === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  });
  ctx.lineTo(points[0].x, points[0].y);
  ctx.strokeStyle = '#0d89ec';
  ctx.stroke();
}

function renderPoints(points: Coordinates[]) {
  points
    .map(p => toCanvasCoords(p))
    .forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
}

function toCanvasCoords(p: Coordinates): Coordinates {
  return { x: p.x, y: ctx.canvas.height - p.y };
}

function createRandomPoints(count: number): Coordinates[] {
  return [...Array(count)]
    .map(() => ({ x: Math.random() * ctx.canvas.width, y: Math.random() * ctx.canvas.height }));
}

