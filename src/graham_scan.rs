use crate::stack::Stack;
use rocket::serde::{Deserialize, Serialize};
use std::ops::{Add, Mul, Neg};

#[derive(Copy, Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Point {
  x: f32,
  y: f32,
}

impl Point {
  pub fn new(x: f32, y: f32) -> Point {
    Point { x, y }
  }

  fn norm(&self) -> f32 {
    f32::sqrt(self.x * self.x + self.y + self.y)
  }
}

macro_rules! add_impl {
  ($POINT: ty, $RHS: ty) => {
    impl Add<$RHS> for $POINT {
      type Output = Point;
      fn add(self, rhs: $RHS) -> Self::Output {
        Point {
          x: self.x + rhs.x,
          y: self.y + rhs.y,
        }
      }
    }
  };
}
add_impl!(Point, Point);
add_impl!(&Point, &Point);
add_impl!(Point, &Point);
add_impl!(&Point, Point);

macro_rules! neg_impl {
  ($POINT: ty) => {
    impl Neg for $POINT {
      type Output = Point;
      fn neg(self) -> Self::Output {
        Point {
          x: -self.x,
          y: -self.y,
        }
      }
    }
  };
}
neg_impl!(Point);
neg_impl!(&Point);

macro_rules! mul_impl {
  ($POINT:ty) => {
    impl Mul<f32> for $POINT {
      type Output = Point;
      fn mul(self, rhs: f32) -> Self::Output {
        Point {
          x: self.x * rhs,
          y: self.y * rhs,
        }
      }
    }
  };
}
mul_impl!(&Point);
mul_impl!(Point);

pub fn convex_hull(mut points: Vec<Point>) -> Stack<Point> {
  let mut hull = Stack::<Point>::new();
  points.sort_by(|Point { x: x1, y: y1 }, Point { x: x2, y: y2 }| {
    (y1, x1).partial_cmp(&(y2, x2)).unwrap()
  });
  let c = points.remove(0);
  points = sort_by_x_angle(&c, &points);
  hull.push(c);
  hull.push(points.remove(0));
  for r in points.iter() {
    loop {
      let (p, q) = (hull.peek_next().unwrap(), hull.peek().unwrap());
      if compute_sine(&(-p + q), &(-q + r)) < 0.0 {
        hull.pop();
      } else {
        break;
      }
    }
    hull.push(*r);
  }
  hull
}

fn sort_by_x_angle(c: &Point, points: &Vec<Point>) -> Vec<Point> {
  let mut points_x_angles = points
    .iter()
    .map(|p| (*p, compute_angle_x(c, p)))
    .collect::<Vec<(Point, f32)>>();
  points_x_angles.sort_by(|(Point { x: x1, .. }, phi1), (Point { x: x2, .. }, phi2)| {
    (phi1, x1).partial_cmp(&(phi2, x2)).unwrap()
  });
  points_x_angles.iter().map(|(p, ..)| *p).collect()
}

fn compute_sine(v: &Point, w: &Point) -> f32 {
  (v.x * w.y - v.y * w.x) / (v.norm() * w.norm())
}

fn compute_angle_x(base: &Point, p: &Point) -> f32 {
  let v = -base + p;
  -v.x / v.norm()
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_convex_hull_1() {
    let points = vec![
      Point::new(2.0, 1.0),
      Point::new(2.0, 2.0),
      Point::new(1.0, 0.0),
      Point::new(2.0, 3.0),
      Point::new(2.0, 0.0),
      Point::new(3.0, 1.0),
    ];
    let mut hull = vec![
      Point::new(1.0, 0.0),
      Point::new(2.0, 0.0),
      Point::new(3.0, 1.0),
      Point::new(2.0, 3.0),
    ];
    hull.reverse();
    assert_eq!(convex_hull(points).into_vec(), hull);
  }

  #[test]
  fn test_convex_hull_2() {
    let points = vec![
      Point::new(3.5, 0.5),
      Point::new(2.0, 1.0),
      Point::new(2.0, 2.0),
      Point::new(1.0, 0.0),
      Point::new(2.0, 3.0),
      Point::new(2.0, 0.0),
      Point::new(3.0, 1.0),
    ];
    let mut hull = vec![
      Point::new(1.0, 0.0),
      Point::new(2.0, 0.0),
      Point::new(3.5, 0.5),
      Point::new(2.0, 3.0),
    ];
    hull.reverse();
    assert_eq!(convex_hull(points).into_vec(), hull);
  }
}
