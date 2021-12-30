---
title: "Polymorphic functions in Scala"
description: "How to implement polymorphic functions in Scala (FPIS series)"
date: 2021-12-29T18:49:28-08:00
tags: ["Scala", "functional-programming", "polymorphic-function", "parametric-polymorphism", "recursion", "tail-recursion"]
categories: ["Development", "functional-programming"]
draft: true
---

**Polymorphic function** is a very common term in *Functional Programming*. 

In *Object Oriented Programming (OOP)* also exists the concept of *"Polymorphism"* but it refers to objects and inheritance.

A polymorphic function is a function that can work for _any_ data type it's given. Polymorphic functions are also known as *Parametric polymorphism*.

As you can see the definition is very simple: *"A function that accepts any type"*. But first, let's start with the basics. 

I want to start with the implementation of a function that checks if a list of integers `List[Int]` is sorted. Something like this:

```scala
def isSorted(elements: List[Int]): Boolean = 
  @annotation.tailrec
  def loop(index: Int): Boolean =
    if elements.length <= 1 || index == 0 then
      true
    else if elements(index - 1) >  elements(index) then
      false
    else
      loop(index - 1)
  
  loop(elements.length - 1)
```

`isSorted` is a function that given a list of integers returns `true` only if the elements are sorted in ascending order otherwise returns `false`. 

The implementation of `isSorted` consists of a *local recursive* function `loop` which verify the elements of the list are sorted. 

Let's try with some lists of integers in the **Scala REPL**:

```scala
scala> isSorted(List(1, 3, 5))
val res1: Boolean = true

scala> isSorted(List(1, 6, 5))
val res2: Boolean = false

scala> isSorted(List(-3, 1))
val res3: Boolean = true

scala> isSorted(List(-3, -4))
val res4: Boolean = false

scala> isSorted(List(2, 2))
val res5: Boolean = true

scala> isSorted(List(2))
val res6: Boolean = true

scala> isSorted(List.empty)
val res7: Boolean = true
```

The function is working as expected. `isSorted` recives a list of integers and verifies the elements of the list are sorted. So far, `isSorted` is a *monomorphic function*. It can only process list of integers. If I'd to verify if a list of floating point numbers are sorted `List[Double]` I couldn't use `isSorted` because the Scala compiler would throw an error. Let's try:

```java
scala> isSorted(List(1.2, 1.5, 1.7))
-- Error:
1 |isSorted(List(1.2, 1.5, 1.7))
  |              ^^^
  |              Found:    (1.2d : Double)
  |              Required: Int
-- Error:
1 |isSorted(List(1.2, 1.5, 1.7))
  |                   ^^^
  |                   Found:    (1.5d : Double)
  |                   Required: Int
-- Error:
1 |isSorted(List(1.2, 1.5, 1.7))
  |                        ^^^
  |                        Found:    (1.7d : Double)
  |                        Required: Int
```

To fix this problem we can write another function for lists of doubles `def isSorted(elements: List[Double])` but the problem with this is that we will basically duplicate the code for doubles and what if we want to apply the same functionality for booleans or strings too?. This alternative is not going to scale. 

Another approach is to make `isSorted` a *Polymorphic function* which basically can process a list of *any* type.

In order to do that, we need to apply some changes to `isSorted`. What we are going to do first is to *"parameterize"* the function adding the *parameter type* `A` between brackets after the name of the function, so that Scala compiler detects this is a *Polymorphic function*. `isSorted[A]`. This new *type parameter* `A` can be used in the parameters of our function and will allow us to define the list parameter as `List[A]` which can be a list of any type. 

Another change we need to do is to define a second parameter which is a function that is going to be used to verify if two elements of the list are ordered. As you can see, this new parameter is required because now we can process *any* type, so we can't use integer comparison anymore `<, >, <=, >=`, but Scala allow us to define functions as parameters and in this case we can let users provide their custom function according to the type they want to verify. As you can see this provides more flexibility and scalability to our code. 

```scala
def isSorted[A](elements: List[A], ordered: (A, A) => Boolean): Boolean = ??? 

```

This is the implementation of our *Polymorphic* function `isSorted`. :tada:

```scala
def isSorted[A](elements: List[A], ordered: (A, A) => Boolean): Boolean =
  @annotation.tailrec
  def loop(index: Int): Boolean = 
    if elements.length <= 1 || index == 0 then
      true
    else if !ordered(elements(index - 1), elements(index)) then
      false
    else
      loop(index - 1)

  loop(elements.length - 1)
```

Now I can use `isSorted` with a list of integers:

```scala
scala> isSorted(List(2,4,6), (current, next) => current < next)
val res1: Boolean = true
```

`(current, next) => current < next` is a *lambda function* or *annonymous function* that is used internally in `isSorted` to verify two elements of the list (current and next) `current` is less than `next` which means those two elements are sorted and is applied on every element of the list. The flexibility of this approach is that I can also apply `isSorted` and verify the order is descendent `List(3, 2, 1)` is `true` I only need to provide a different `ordered` function. Let's do it:

In this case I will create the `descendentOrder` variable and assign the lambda to it just to show you that you can also define a *lambda* and assign it to a variable or return as a result of a function because functions and lambdas are high order citizens in Scala.
```scala
val descendentOrder = (current: Int, next: Int) => current >= next

```

Let's use `descendentOrder` function in our `isSorted` function.

```scala
scala> isSorted(List(3, 2, 1), descendentOrder)
val res1: Boolean = true

scala> isSorted(List(3, 5, 2, 1), descendentOrder)
val res2: Boolean = false
```

Now you can see making the function *polymorphic* provides more flexiblity and scalability. We can provide the criteria we want to compare and verify the list comply with the provided criteria.

Let's verify a list of doubles:

```scala
scala> isSorted(List(2.3, 2.6, 3.0), (current, next) => current <= next)
val res1: Boolean = true

scala> isSorted(List(2.3, 2.2, 3.0), (current, next) => current <= next)
val res2: Boolean = false
```

It's working :smile:. How about booleans?

```scala
scala> isSorted(List(false, false, true), (current, next) => current <= next)
val res1: Boolean = true
```

It also works!

We can even apply the same with strings due Scala has implementation for comparison operators for `String`:

```scala
scala> isSorted(List("aa", "bb", "cc"), (current, next) => current <= next)
val res1: Boolean = true

scala> isSorted(List("aa", "bb", "cccccc", "cc"), (current, next) => current <= next)
val res2: Boolean = false

scala> isSorted(List("aa", "bb", "bbbbbb", "cc"), (current, next) => current <= next)
val res3: Boolean = true
```

What if we can verify if a list of strings are sorted by the length of the strings? `List("a", "aa", "aaa")` is `true`?

We can but we will need to provide a different comparison function:

```scala
val ascendentLengthOrder = (current: String, next: String) => current.length <= next.length

```

and then:

```scala
scala> isSorted(List("a", "aa", "aaa"), ascendentLengthOrder)
val res1: Boolean = true

scala> isSorted(List("a", "aaaa", "aaa"), ascendentLengthOrder)
val res40: Boolean = false
```