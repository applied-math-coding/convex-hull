table! {
    convex_hulls (id) {
        id -> Int4,
        name -> Nullable<Text>,
        created -> Nullable<Timestamp>,
    }
}

table! {
    points (id) {
        id -> Int4,
        input -> Json,
        output -> Json,
        convex_hull_id -> Nullable<Int4>,
    }
}

joinable!(points -> convex_hulls (convex_hull_id));

allow_tables_to_appear_in_same_query!(
    convex_hulls,
    points,
);
