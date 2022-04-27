#[macro_use]
extern crate rocket;
mod graham_scan;
mod stack;
use graham_scan::Point;
use rocket::serde::json::Json;
use rocket_contrib::serve::StaticFiles;

#[get("/")]
fn index() -> &'static str {
  "hello world"
}

#[post("/convex-hull", data = "<points>")]
fn convex_hull(points: Json<Vec<Point>>) -> Json<Vec<Point>> {
  Json(graham_scan::convex_hull(points.into_inner()).into_vec())
}

#[launch]
fn rocket() -> _ {
  rocket::build().mount("/", routes![convex_hull, index])
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
    let response = client.post("/convex-hull").json(&points).dispatch();
    assert_eq!(
      response.into_string().unwrap(),
      "[{\"x\":2.0,\"y\":3.0},{\"x\":3.0,\"y\":1.0},{\"x\":2.0,\"y\":0.0},{\"x\":1.0,\"y\":0.0}]"
    );
  }
}
