#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
extern crate dotenv;
mod convex_hull_service;
mod db;
mod graham_scan;
mod models;
mod schema;
mod stack;
use diesel_migrations::embed_migrations;
use graham_scan::Point;
use models::ConvexHull;
use rocket::fs::{relative, FileServer};
use rocket::serde::json::Json;

embed_migrations!();

#[get("/test")]
fn index() -> &'static str {
    "hello world"
}

#[post("/convex-hull", data = "<points>")]
fn convex_hull(points: Json<Vec<Point>>) -> Json<Vec<Point>> {
    Json(graham_scan::convex_hull(points.into_inner()).into_vec())
}

#[post("/db/convex-hulls", data = "<payload>")]
fn save_convex_hull(
    payload: Json<(models::NewConvexHull, models::NewPoint)>,
) -> Json<(models::ConvexHull, models::Point)> {
    let (new_convex_hull, new_points) = payload.into_inner();
    Json(convex_hull_service::create_convex_hull(
        new_convex_hull,
        new_points,
    ))
}

#[get("/db/convex-hulls/<id>/points")]
fn get_points(id: i32) -> Json<models::Point> {
    Json(convex_hull_service::get_points(id))
}

#[get("/db/convex-hulls")]
fn get_convex_hulls() -> Json<Vec<models::ConvexHull>> {
    Json(convex_hull_service::get_convex_hulls())
}

#[delete("/db/convex-hulls/<id>")]
fn delete_convex_hull(id: i32) {
    convex_hull_service::delete_convex_hull(id);
}

#[put("/db/convex-hulls", data = "<convex_hull>")]
fn update_convex_hull(convex_hull: Json<ConvexHull>) -> Json<ConvexHull> {
    Json(convex_hull_service::update_convex_hull(
        convex_hull.into_inner(),
    ))
}

#[launch]
fn rocket() -> _ {
    match embedded_migrations::run(&db::create_connection()) {
        Ok(_) => rocket::build()
            .mount("/", FileServer::from(relative!("client/dist")))
            .mount(
                "/api",
                routes![
                    convex_hull,
                    index,
                    save_convex_hull,
                    get_convex_hulls,
                    get_points,
                    delete_convex_hull,
                    update_convex_hull
                ],
            ),
        Err(_) => panic!("migration failed"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_convex_hull() {
        let points = vec![
            Point::new(2.0, 1.0),
            Point::new(2.0, 2.0),
            Point::new(1.0, 0.0),
            Point::new(2.0, 3.0),
            Point::new(2.0, 0.0),
            Point::new(3.0, 1.0),
        ];
        use rocket::local::blocking::Client;
        let client = Client::tracked(super::rocket()).unwrap();
        let response = client.post("/api/convex-hull").json(&points).dispatch();
        assert_eq!(
      response.into_string().unwrap(),
      "[{\"x\":2.0,\"y\":3.0},{\"x\":3.0,\"y\":1.0},{\"x\":2.0,\"y\":0.0},{\"x\":1.0,\"y\":0.0}]"
    );
    }
}
