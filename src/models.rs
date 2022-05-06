use crate::schema::{convex_hulls, points};
use diesel::Queryable;
use rocket::serde::{Deserialize, Serialize};
use serde_json;

#[derive(Queryable, Identifiable, Serialize, Deserialize)]
#[table_name = "convex_hulls"]
pub struct ConvexHull {
    pub id: i32,
    pub name: Option<String>,
    pub created: Option<std::time::SystemTime>,
}

#[derive(Insertable, Deserialize)]
#[table_name = "convex_hulls"]
pub struct NewConvexHull {
    pub name: Option<String>,
    pub created: Option<std::time::SystemTime>,
}

#[derive(Queryable, Associations, Identifiable, Serialize)]
#[belongs_to(ConvexHull)]
#[table_name = "points"]
pub struct Point {
    pub id: i32,
    pub input: serde_json::Value,
    pub output: serde_json::Value,
    #[serde(rename = "convexHullId")]
    pub convex_hull_id: Option<i32>,
}

#[derive(Insertable, Deserialize, Associations)]
#[table_name = "points"]
pub struct NewPoint {
    pub input: serde_json::Value,
    pub output: serde_json::Value,
    pub convex_hull_id: Option<i32>,
}
