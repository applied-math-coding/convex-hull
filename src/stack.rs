use std::mem;

struct Node<T> {
  data: T,
  next: Option<Box<Node<T>>>,
}

impl<T> Node<T> {
  fn new(data: T) -> Node<T> {
    Node { data, next: None }
  }
}

pub struct Stack<T> {
  top: Option<Node<T>>,
}

impl<T> Stack<T> {
  pub fn new() -> Stack<T> {
    Stack { top: None }
  }

  pub fn is_empty(&self) -> bool {
    match self.top {
      Some(_) => false,
      None => true,
    }
  }

  pub fn push(&mut self, data: T) {
    let mut node = Node::new(data);
    if let Some(top) = mem::take(&mut self.top) {
      node.next = Some(Box::new(top));
    }
    self.top = Some(node);
  }

  pub fn pop(&mut self) -> Option<T> {
    if let Some(top) = mem::take(&mut self.top) {
      self.top = match top.next {
        Some(n) => Some(*n),
        None => None,
      };
      Some(top.data)
    } else {
      None
    }
  }

  pub fn peek(&self) -> Option<&T> {
    match &self.top {
      Some(top) => Some(&top.data),
      None => None,
    }
  }

  pub fn peek_next(&self) -> Option<&T> {
    match &self.top {
      Some(top) => match &top.next {
        Some(next) => Some(&next.data),
        None => None,
      },
      None => None,
    }
  }

  pub fn into_vec(mut self) -> Vec<T> {
    let mut res = vec![];
    while !self.is_empty() {
      res.push(self.pop().unwrap());
    }
    res
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_peek() {
    let mut stack = Stack::new();
    stack.push(1);
    stack.push(2);
    assert_eq!(stack.peek(), Some(&2));
  }

  #[test]
  fn test_peek_next() {
    let mut stack = Stack::new();
    stack.push(1);
    stack.push(2);
    assert_eq!(stack.peek_next(), Some(&1));
  }

  #[test]
  fn test_pop() {
    let mut stack = Stack::new();
    stack.push(1);
    stack.push(2);
    assert_eq!(stack.pop(), Some(2));
    assert_eq!(stack.pop(), Some(1));
    assert_eq!(stack.is_empty(), true);
  }

  #[test]
  fn test_into_vec() {
    let mut stack = Stack::new();
    stack.push(1);
    stack.push(2);
    assert_eq!(stack.into_vec(), vec![2, 1]);
  }
}
