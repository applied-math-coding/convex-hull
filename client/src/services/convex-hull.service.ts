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
}

