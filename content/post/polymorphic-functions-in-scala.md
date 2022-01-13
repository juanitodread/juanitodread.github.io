---
title: "Polymorphic functions in Scala"
description: "How to implement polymorphic functions in Scala (FPIS series)"
date: 2022-01-13T15:49:28-08:00
tags: ["Scala", "functional-programming", "polymorphic-function", "parametric-polymorphism", "recursion", "tail-recursion"]
categories: ["Development", "functional-programming"]
draft: true
---

* [1. Introduction](#1-Introduction)
* [2. Functions](#2-functions)
  * [2.1 Monomorphic function](#21-monomorphic-function)
  * [2.2 Polymorphic function](#22-polymorphic-function)
    * [2.2.1 Verifying sorting in descendent order](#221-verifying-sorting-in-descendent-order)
    * [2.2.2 Verifying sorting in a list of Double](#222-verifying-sorting-in-a-list-of-double)
    * [2.2.3 Verifying sorting in a list of Boolean](#223-verifying-sorting-in-a-list-of-boolean)
    * [2.2.4 Verifying sorting in a list of String](#224-verifying-sorting-in-a-list-of-string)
      * [2.2.4.1 Verifying sorting based on string’s length](#2241-verifying-sorting-based-on-strings-length)
* [3. Conclusion](#3-conclusion)


## 1. Introduction

A **Polymorphic function** is a very common term in *Functional Programming*. 

In *Object-Oriented Programming (OOP)* also exists the concept of *"Polymorphism"* but it refers to objects and inheritance.

A polymorphic function is a function that can work for _any_ data type it's given. Polymorphic functions are also known as *Parametric polymorphism*.

As you can see, the definition is very simple: *"A function that accepts any type"*. But first, let's start with the basics.

**Note:** You can copy/paste the code and run it in the *Scala REPL*. The code is written in *Scala 3* new syntax but we are not using any new Scala 3 feature.


## 2. Functions
### 2.1 Monomorphic function

I want to start with the implementation of a function that checks whether a list of integers `List[Int]` is sorted. Something like this:

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

`isSorted` is a function that given a list of integers returns `true` only if the elements are sorted in ascending order, otherwise, it returns `false`. 

The implementation of `isSorted` consists of a *local recursive* function `loop` that verifies that the elements of the list are sorted. 

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

The function is working as expected. `isSorted` receives a list of integers and verifies that the elements of the list are sorted. So far, `isSorted` is a **monomorphic function**. It can only process lists of integers. If I'd like to verify if a list of floating-point numbers is sorted `List[Double]`, I couldn't use `isSorted` because the Scala compiler would throw an error. Let's try:

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

To fix this problem, we can write another function for lists of doubles `def isSorted(elements: List[Double])` but the problem with this approach is that we will duplicate the code for a different type and what if we want to apply the same functionality to lists of booleans or lists of strings?. This alternative is not going to *scale*. 

Another approach is to make `isSorted` a **Polymorphic function** which basically can process a list of *any* type.

# 2.2 Polymorphic function

To make `isSorted` a Polymorphic function, we need to apply some changes. 

What we are going to do first is to *"parametrize"* the function by adding the *parameter type* `A` between brackets after the name of the function, so that the Scala compiler detects this is a *Polymorphic function*: `isSorted[A]`. This new *type parameter* `A` can be used in the parameters of our function and will allow us to define the list parameter as `List[A]` which can be a list of any type. 

Another change we need to do is to define a second parameter which is a function that is going to be used to verify if two elements of the list are ordered. As you can see, this new parameter is required because now we can process *any* type, so we can't use integer comparison (`<, >, <=, >=`) anymore, but Scala allows us to define functions as parameters and in this case, we can let users provide their custom *comparison function* according to the type they want to verify. This brings *flexibility* and *scalability* to our code. 

```scala
def isSorted[A](elements: List[A], ordered: (A, A) => Boolean): Boolean = ??? 

```

This is the implementation of our *Polymorphic* function `isSorted`: :tada:

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

Now I can apply `isSorted` to a list of integers:

```scala
scala> isSorted(List(2,4,6), (current, next) => current < next)
val res1: Boolean = true
```

`(current, next) => current < next` is a *lambda function* or *anonymous function* that is used internally in `isSorted` to verify two elements of the list (current and next), if `current` is less than `next` which means those two elements are sorted, and if is applied to each element of the list. 

The flexibility of this approach is such that I can also apply `isSorted` and verify if the order is descendent `List(3, 2, 1)`. I only need to provide a different `ordered` function. Let's do it:


#### 2.2.1 Verifying sorting in descendent order

In this case, we create the `descendentOrder` variable and assign it the lambda, just to show you that you can also define a *lambda* and assign it to a variable, even though you can also return it as a result of a function because functions and lambdas are high order citizens in Scala.
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

As you can see, making the function *polymorphic* provides us with better flexibility and scalability. Now we can define *the criteria* we want to use to compare the elements of the list and verify if the list complies or not with the given criteria.

#### 2.2.2 Verifying sorting in a list of Double

Let's verify a list of doubles:

```scala
scala> isSorted(List(2.3, 2.6, 3.0), (current, next) => current <= next)
val res1: Boolean = true

scala> isSorted(List(2.3, 2.2, 3.0), (current, next) => current <= next)
val res2: Boolean = false
```

It works! :smile: 

#### 2.2.3 Verifying sorting in a list of Boolean
How about booleans?

```scala
scala> isSorted(List(false, false, true), (current, next) => current <= next)
val res1: Boolean = true
```

It also works!


#### 2.2.4 Verifying sorting in a list of String
We can even apply the same comparison function to a list of strings due to Scala has an implementation for comparison operators for `String`:

```scala
scala> isSorted(List("aa", "bb", "cc"), (current, next) => current <= next)
val res1: Boolean = true

scala> isSorted(List("aa", "bb", "cccccc", "cc"), (current, next) => current <= next)
val res2: Boolean = false

scala> isSorted(List("aa", "bb", "bbbbbb", "cc"), (current, next) => current <= next)
val res3: Boolean = true
```

##### 2.2.4.1 Verifying sorting based on string's length

What if we want to verify if a list of strings is sorted by the length of its strings elements?

`List("a", "aa", "aaa")` is `true`?

It's possible, but we need to provide a different comparison function:

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

## 3. Conclusion
In this post, we explored a powerful technique in the **Functional Programming** paradigm. 

First, we started analyzing a simple function that verifies if a list of integers is sorted or not. This function is pretty much similar in structure and functionality to any other functions that we write in our daily job. Then we continued applying some changes to make it more flexible and scalable using the *Polymorphic Function* paradigm through *generic* type parameters.

*Polymorphic Functions* can be used to reduce code duplication and generalize the behavior of a function for a common set of types. We just need to start considering an initial type and then start iterating over the next types we want to support.