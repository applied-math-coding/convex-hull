import type { Coordinates } from "@/models/coordinates";
import { defineComponent, type PropType } from "vue";
import { useStore } from '../store';
import { mapState } from 'pinia';

export default defineComponent({
    props: {
        inputPoints: Object as PropType<Coordinates[]>,
        outputPoints: Object as PropType<Coordinates[]>,
        scale: { type: Number, default: 1 }
    },
    data() {
        return {
            ctx: null as unknown as CanvasRenderingContext2D
        }
    },
    mounted() {
        const canvas = this.$refs.canvas as HTMLCanvasElement;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = this.width * this.scale;
        canvas.height = this.height * this.scale;
        this.inputPoints && this.renderPoints(this.inputPoints);
        this.outputPoints && this.renderHull(this.outputPoints);
    },
    computed: {
        ...mapState(useStore, ['width', 'height'])
    },
    watch: {
        inputPoints(n) {
            this.clearCanvas();
            this.renderPoints(n);
        },
        outputPoints(n) {
            this.renderHull(n);
        }
    },
    methods: {
        clearCanvas() {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        },
        renderHull(points: Coordinates[]) {
            points = points.map(p => this.toCanvasCoords(p));
            this.ctx.beginPath();
            points.forEach((p, idx) => {
                if (idx === 0) {
                    this.ctx.moveTo(p.x, p.y);
                } else {
                    this.ctx.lineTo(p.x, p.y);
                }
            });
            this.ctx.lineTo(points[0].x, points[0].y);
            this.ctx.strokeStyle = '#0d89ec';
            this.ctx.stroke();
        },
        renderPoints(points: Coordinates[]) {
            points
                .map(p => this.toCanvasCoords(p))
                .forEach(p => {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, 3 * this.scale, 0, 2 * Math.PI);
                    this.ctx.fill();
                });
        },
        toCanvasCoords(p: Coordinates): Coordinates {
            return { x: p.x * this.scale, y: this.ctx.canvas.height - p.y * this.scale };
        }
    }
});

