import type { ConvexHull } from "@/models/convex-hull";
import type { Point } from "@/models/point";

export class ConvexHullService {
    readonly BASE_URL = '/api/db/convex-hulls';

    async saveConvexHull(ch: ConvexHull, p: Point): Promise<[ConvexHull, Point]> {
        return fetch(`${this.BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([ch, p])
        }).then(r => r.json());
    }

    async fetchConvexHulls(): Promise<ConvexHull[]> {
        return fetch(`${this.BASE_URL}`).then(r => r.json());
    }

    async fetchPoints(convexHullId: number): Promise<Point> {
        return fetch(`${this.BASE_URL}/${encodeURIComponent(convexHullId)}/points`)
            .then(r => r.json());
    }

    async deleteConvecHull(id: number) {
        return fetch(`${this.BASE_URL}/${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });
    }

}

