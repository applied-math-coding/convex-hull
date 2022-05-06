import type { Coordinates } from "@/models/coordinates";
import { defineComponent, type PropType } from "vue";
import { useStore } from '../store';
import { mapState } from 'pinia';

let ctx: CanvasRenderingContext2D;

export default defineComponent({
    props: {
        inputPoints: Object as PropType<Coordinates[]>,
        outputPoints: Object as PropType<Coordinates[]>,
        scale: { type: Number, default: 1 }
    },
    mounted() {
        const canvas = this.$refs.canvas as HTMLCanvasElement;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = this.width;
        canvas.height = this.height;
    },
    computed: {
        ...mapState(useStore, ['width', 'height'])
    },
    watch: {
        inputPoints(n, o) {
            this.clearCanvas();
            this.renderPoints(n);
        },
        outputPoints(n, o) {
            this.renderHull(n);
        }
    },
    methods: {
        clearCanvas() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        },
        renderHull(points: Coordinates[]) {
            points = points.map(p => this.toCanvasCoords(p));
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
        },
        renderPoints(points: Coordinates[]) {
            points
                .map(p => this.toCanvasCoords(p))
                .forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
                    ctx.fill();
                });
        },
        toCanvasCoords(p: Coordinates): Coordinates {
            return { x: p.x * this.scale, y: (ctx.canvas.height - p.y) * this.scale };
        }
    }
});

