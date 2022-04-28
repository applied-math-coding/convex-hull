import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';

type Point = { x: number, y: number };
let ctx: CanvasRenderingContext2D;

export default defineComponent({
  components: { Button, InputNumber },
  data() {
    return {
      numberPoints: 10,
      computing: false
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
    handleCreate() {
      clearCanvas();
      const points = createRandomPoints(this.numberPoints);
      renderPoints(points);
      this.computeConvexHull(points);
    },
    async computeConvexHull(points: Point[]) {
      try {
        this.computing = true;
        renderHull(await fetchConvexHull(points));
      } catch (e) {
        console.error(e);
      } finally {
        this.computing = false;
      }
    }
  }
});

function clearCanvas() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fetchConvexHull(points: Point[]): Promise<Point[]> {
  return fetch('/api/convex-hull', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(points)
  }).then(r => r.json());
}

function renderHull(points: Point[]) {
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

function renderPoints(points: Point[]) {
  points
    .map(p => toCanvasCoords(p))
    .forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
}

function toCanvasCoords(p: Point): Point {
  return { x: p.x, y: ctx.canvas.height - p.y };
}

function createRandomPoints(count: number): Point[] {
  return [...Array(count)]
    .map(() => ({ x: Math.random() * ctx.canvas.width, y: Math.random() * ctx.canvas.height }));
}

