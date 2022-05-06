use crate::db;
use crate::models::{ConvexHull, NewConvexHull, NewPoint, Point};
use crate::schema::{convex_hulls, points};
use diesel::prelude::*;
use diesel::result::Error;
use std::time::SystemTime;

pub fn create_convex_hull(
    mut new_convex_hull: NewConvexHull,
    mut new_point: NewPoint,
) -> (ConvexHull, Point) {
    let connection = db::create_connection();
    connection
        .transaction::<(ConvexHull, Point), Error, _>(|| {
            new_convex_hull.created = Some(SystemTime::now());
            let convex_hull: ConvexHull = diesel::insert_into(convex_hulls::table)
                .values(&new_convex_hull)
                .get_result(&connection)
                .unwrap();
            new_point.convex_hull_id = Some(convex_hull.id);
            let points = diesel::insert_into(points::table)
                .values(&new_point)
                .get_result(&connection)
                .unwrap();
            Ok((convex_hull, points))
        })
        .unwrap()
}

pub fn get_convex_hulls() -> Vec<ConvexHull> {
    let connection = db::create_connection();
    convex_hulls::table.load::<ConvexHull>(&connection).unwrap()
}

pub fn get_points(convex_hull_id: i32) -> Point {
    let connection = db::create_connection();
    let convex_hull = convex_hulls::table
        .find(convex_hull_id)
        .get_result::<ConvexHull>(&connection)
        .unwrap();
    Point::belonging_to(&convex_hull)
        .first(&connection)
        .unwrap()
}

pub fn delete_convex_hull(id: i32) {
    let connection = db::create_connection();
    diesel::delete(convex_hulls::table.find(id))
        .execute(&connection)
        .unwrap();
}

pub fn update_convex_hull(convex_hull: ConvexHull) -> ConvexHull {
    let connection = db::create_connection();
    diesel::update(convex_hulls::table.find(convex_hull.id))
        .set(convex_hulls::columns::name.eq(convex_hull.name))
        .get_result(&connection)
        .unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_convex_hull_crud() {
        let (convex_hull, ..) = create_convex_hull(
            NewConvexHull {
                name: Some(String::from("test")),
                created: Some(std::time::SystemTime::now()),
            },
            NewPoint {
                input: json!({"hello": "world"}),
                output: json!({"hello": "world"}),
                convex_hull_id: Some(-1),
            },
        );
        get_points(convex_hull.id);
        assert_eq!(
            get_convex_hulls()
                .iter()
                .filter(|e| e.id == convex_hull.id)
                .collect::<Vec<&ConvexHull>>()
                .len(),
            1
        );
        delete_convex_hull(convex_hull.id);
        assert_eq!(
            get_convex_hulls()
                .iter()
                .filter(|e| e.id == convex_hull.id)
                .collect::<Vec<&ConvexHull>>()
                .len(),
            0
        );
    }
}
