---
title: "Functional data structures"
description: "How to implement functional data structures in Scala (FPIS series)"
date: 2022-03-29T06:52:38-07:00
tags: ["Scala", "functional-programming", "functional-data-structure", "recursion", "tail-recursion", "pattern-matching"]
categories: ["Development", "functional-programming"]
draft: false
---

* [1. Introduction](#1-Introduction)
  * [1.1 What is a Functional Data Structure?](#11-what-is-a-functional-data-structure)
  * [1.2 How does a Functional Data Structure work?](#12-how-does-a-functional-data-structure-work)
* [2. Linked list as a functional data structure](#2-linked-list-as-a-functional-data-structure)
  * [2.1 Factory method](#21-factory-method)
  * [2.2 Head](#22-head)
  * [2.3 Tail](#23-tail)
  * [2.4 Adding elements (prepend)](#24-adding-elements-prepend)
  * [2.5 Dropping elements](#25-dropping-elements)
* [3. Conclusion](#3-conclusion)
* [4. Code](#4-code)
  * [4.1 FList implementation](#41-flist-implementation)
  * [4.2 FList unit test](#42-flist-unit-test)

## 1. Introduction
### 1.1 What is a *Functional Data Structure*?
First, let's start with the definition of *Data Structure*. When we start learning programming in any high-level language we learn about *data structures*. A *Data Structure* is a component that allows us to *store* and *manipulate* certain data in a specific and efficient way. 

In Scala, for example, `Array`, `List`, `Map`, `Set` are *data structures* that allow us to store and manipulate data (elements) in a certain way. What data structure choose? it depends on the problem we want to solve. Do we require: Fast access?, Fast storing?, Allow duplicate elements?, etc.

A **Functional Data Structure** is implemented by *pure functions*. A *pure function* is a function that must not perform any side effect. A *Functional Data Structure* is **immutable** by definition. 

**Note:** You can copy/paste the code and run it in the *Scala REPL*. The code is written in *Scala 3* new syntax but we are not using any new Scala 3 feature.

### 1.2 How does a *Functional Data Structure* work?
A *Functional Data Structure* is immutable. Every time we add or remove elements, a new instance of the data structure is returned. This is called **data sharing**. This new instance has only references to the original data. No new data is created. If we apply another operation to the data structure, a new instance is returned with pointers to the original data. In *Functional Data Structures*, existing references are never changed by operations on the data structure.

## 2. *Linked list* as a functional data structure
Let's create a **functional data structure** `FList`. `FList` is a single linked list implemented as a functional data structure.

Let's define our new data structure:

```scala
sealed trait FList[+A]
case object Nil extends FList[Nothing]
case class Node[A](head: A, tail: FList[A]) extends FList[A]
```

The *trait* `FList[+A]` represents the new type of our data structure. So eventually, we will be able to do something like this:

```scala
val myFList: FList[String] = ???

```

Then, we define two *constructors* for our data structure: `Nil` and `Node[A]`. Note that the *type definition* of our data structure is parameterized with a `+A` parameter. This `+A` parameter determines that our `FList` is *covariant*. We have to make it *covariant* because our list will always point to `Nil` at the end, and `Nil` is of type `FList[Nothing]` and `Nothing` is a subtype of all types in Scala. So, *covariant variance* allows us to use the same definition to consider `FList[Nothing]` a subtype of `FList[A]`.

For example, we can declare an empty `FList` of `String` this way:

```scala
scala> var myFList: FList[String] = Nil
var myFList: FList[String] = Nil
```

Because `Nil` is `FList[Nothing]` which is a subtype of `FList[String]`. And then, we can re-assign `myFList` to a new `FList[String]` as follows:

```scala
scala> myFList = Node("a", Nil)
myFList: FList[String] = Node(a,Nil)
```

This is the reason why we needed to make it *covariant*. A linked list always points to `Nil` in the last element or is `Nil` if is an empty list.

### 2.1 Factory method
Now, let's create a *factory method* to simplify the way we create instances of our functional data structure `FList`. In Scala, we have *companion objects* for this purpose.

```scala
object FList:
  def apply[A](elements: A*): FList[A] = 
    if elements.isEmpty then Nil
    else Node(elements.head, apply(elements.tail: _*))
```

**Note:** If you aren't so familiar with *companion objects* and `apply` method I suggest you take a look at the Scala documentation.

It's time to create our first empty *FList*:

```scala
scala> val myEmptyFList: FList[String] = FList()
val myEmptyFList: FList[String] = Nil
```

And now, let's create a list of strings `FList[String]`:

```scala
scala> val myFList = FList("a", "b", "c")
val myFList: FList[String] = Node(a,Node(b,Node(c,Nil)))
```

We also can create a list of integers `FList[Int]`:

```scala
scala> val myFList = FList(1, 2, 3)
val myFList: FList[Int] = Node(1,Node(2,Node(3,Nil)))
```

There are two fundamental operations over lists which are *head* and *tail*. Let's implement them in our *functional data structure*.

### 2.2 Head
Head operation returns the first element of a list:

```scala
object FList:
  def head[A](flist: FList[A]): A = 
    flist match
      case Node(head, tail) => head
      case Nil => throw new java.util.NoSuchElementException
```

The `head` function is implemented as a member of our `FList` *companion object*. It receives the list and returns the first element of the list using the *pattern matching* technique, if the list matches the case (the list has a `Node`), then the `head` is returned, otherwise it throws a `NoSuchElementException` if the given list is empty.

Let's test it.

```scala
scala> val myFList = FList("a", "b", "c")
val myFList: FList[String] = Node(a,Node(b,Node(c,Nil)))

scala> FList.head(myFList)
val res1: String = a

scala> myFList
val res2: FList[String] = Node(a,Node(b,Node(c,Nil)))
```

As you can see, the *head* element `"a"` is returned (`line 4`) but `myFList` remains immutable (`line 7`).

Let's test the case when an empty list is provided.

```scala
scala> val myEmptyFList = FList()
val myEmptyFList: FList[Nothing] = Nil

scala> FList.head(myEmptyFList)
java.util.NoSuchElementException
  at repl$.rs$line$19$FList$.head(rs$line$19:32)
  ... 30 elided
```

### 2.3 Tail
Tail returns the rest of the list without the first element (`head`):

```scala
object FList:
  def tail[A](flist: FList[A]): FList[A] = 
    flist match 
      case Node(head, tail) => tail
      case Nil => throw new UnsupportedOperationException
```

The `tail` function is also implemented as a member of our `FList` *companion object*. It receives the list and returns the rest of the elements without the first element (`head`) using *pattern matching* technique, if the list matches the case (the list has a `Node`) then the `tail` is returned, otherwise it throws an `UnsupportedOperationException` if the given list is empty.

Let's test it.

```scala
scala> val myFList = FList("a", "b", "c")
val myFList: FList[String] = Node(a,Node(b,Node(c,Nil)))

scala> FList.tail(myFList)
val res1: FList[String] = Node(b,Node(c,Nil))

scala> myFList
val res2: FList[String] = Node(a,Node(b,Node(c,Nil)))
```

As you can see, the *tail* element `FList("b", "c")` is returned (`line 4`) but `myFList` remains immutable (`line 7`).

Let's test the case when a single element list is provided:

```scala
scala> val myFList = FList("a")
val myFList: FList[String] = Node(a,Nil)

scala> FList.tail(myFList)
val res1: FList[String] = Nil
```

Remember that a linked list always points to `Nil` at the end. So, the *tail* of a single element list is `Nil` or in other words, an empty list `FList()`.

Now, let's try the case when an empty list is provided:

```scala
scala> val myEmptyFList = FList()
val myEmptyFList: FList[Nothing] = Nil

scala> FList.tail(myEmptyFList)
java.lang.UnsupportedOperationException
  at repl$.rs$line$19$FList$.tail(rs$line$19:27)
  ... 30 elided
```

It works as expected, you can't get the *tail* of an empty list.

### 2.4 Adding elements (prepend)
Let's implement a function to insert an element as the first element of a list (prepend). This operation is easy to implement and it takes *constant runtime complexity*. 

**Note:** *If we would want to insert the element after the current last element, then we would need to implement something more complex that runs on O(n) because we would need to iterate all the elements of the list.*

I will name this function `setHead` just to simplify naming. `setHead` will basically insert a new element at the beginning of the list (list's *head*).

```scala
object FList:
  def setHead[A](element: A, flist: FList[A]): FList[A] =
    flist match
      case list @ Node(head, tail) => Node(element, list)
      case Nil => Node(element, Nil)
```

We are using *pattern matching* again. If the list is not empty, then we just return a new `Node` (list) where the *head* is the given element and the *tail* is the given list, otherwise, we return the given element pointing to `Nil`, in other words, a single element list.

Let's start with an empty list case and add a first element `"b"` and then add another first element `"a"`.

```scala
scala> val myEmptyFList = FList()
val myEmptyFList: FList[Nothing] = Nil

scala> val mySingleFList = FList.setHead("b", myEmptyFList)
val mySingleFList: FList[String] = Node(b,Nil)

scala> val myFList = FList.setHead("a", mySingleFList)
val myFList: FList[String] = Node(a,Node(b,Nil))

scala> mySingleFList
val res1: FList[String] = Node(b,Nil)
```

As you can see, elements are added at the beginning of the list. Also, check that `mySingleFList` remains immutable (`line 10`).

### 2.5 Dropping elements
Our *functional data structure* `FList` is almost complete in terms of its basic operations. Now, we are going to implement a function to remove elements from the list.

In this case, I want to drop all the elements (starting from the beginning) while a provided given function `A => Boolean` is true. All the initial elements that evaluate `true` for the given function will be removed from the list (`dropWhile`). 

Let's implement the `dropWhile` function:

```scala
object FList:
  def dropWhile[A](flist: FList[A], func: A => Boolean): FList[A] =
    flist match
      case Node(head, tail) if func(head) => dropWhile(FList.tail(flist), func)
      case _ => flist
```

In this case, we are taking two parameters:
  * `flist`: The list.
  * `func`: The function of type `A => Boolean` that will be applied to each element starting from the beginning and if it evaluates to `true` then the element will be removed from the list, otherwise we stop and return the remaining elements.

Again, with *pattern matching*, we evaluate the list. If there's an element (`case Node(head, tail)`) then we apply the function `func` to the *current* element (`head`), if the result of `func` is `true` then we *drop* the current element (`head`) and call `dropWhile` *recursively* with the *tail* as the *new list*. If the condition continues evaluating as `true`, then we continue removing elements, otherwise, the list is returned.

Let's test our `dropWhile` function:

```scala
scala> val companies = FList("amazon", "apple", "google", "microsoft", "oracle")
val companies: FList[String] = Node(amazon,Node(apple,Node(google,Node(microsoft,Node(oracle,Nil)))))

scala> FList.dropWhile(companies, company => company.charAt(0) < 'm')
val res1: FList[String] = Node(microsoft,Node(oracle,Nil))

scala> companies
val res2: FList[String] = Node(amazon,Node(apple,Node(google,Node(microsoft,Node(oracle,Nil)))))
```

In `line 1` I'm creating a list of companies `FList[String]` and all the elements are defined in a way that they are sorted by their name. 

In `line 4` I'm calling the `dropWhile` function and passing the function `company => company.charAt(0) < 'm'` of type `String => Boolean` which takes the first character of each company name and evaluates if the character is less than `'m'`. If it evaluates to `true`, then the company will be removed. As you can see in `line 5` the result of this operation is `FList("microsoft", "oracle")`. 

In `line 7` I'm *evaluating* `companies` in the REPL just to verify that the given list `companies` remain immutable. 

## 3. Conclusion
In this post, we explored another powerful technique in the **Functional Programming** paradigm: the **Functional Data Structures**. 

*Functional Data Structures* allow us to create new data structures that are immutable by design. We also implemented a *linked list* `FList` in terms of a **functional data structure**. We defined its *interface* as a new *type* and implemented some basic operations with pure functions applying other techniques such as *pattern matching* and *recursion*.

A powerful aspect of **Scala** is that it brings *Functional Programming* and *Object-Oriented Programming* paradigms together, this allows us to provide a more *object-oriented design* to our `FList` data structure to encapsulate the code in a *better way*. In my next post, I'll talk about it and how you can *use* our `FList` in the same way that the Scala collections are built, so you should be able to do something like this `val myFList = FList("a", "b", "c")` and get the *tail* in this way `myFList.tail`.

## 4. Code
This is the full code I used. It includes other operations and tests that I didn't explain in this post.
### 4.1 FList implementation
`FList.scala`

```scala
import scala.annotation.tailrec

sealed trait FList[+A]
case object Nil extends FList[Nothing]
case class Node[A](head: A, tail: FList[A]) extends FList[A]

object FList:
  def apply[A](elements: A*): FList[A] = 
    if elements.isEmpty then Nil
    else Node(elements.head, apply(elements.tail: _*))


  def fill[A](element: A, n: Int): FList[A] = 
    require(n >= 0)

    @tailrec
    def loop(flist: FList[A], count: Int): FList[A] =
      if count == 0 then flist
      else loop(Node(element, flist), count - 1)
    
    loop(FList(), n)

  def tail[A](flist: FList[A]): FList[A] = 
    flist match 
      case Node(head, tail) => tail
      case Nil => throw new UnsupportedOperationException
  
  def head[A](flist: FList[A]): A = 
    flist match
      case Node(head, tail) => head
      case Nil => throw new java.util.NoSuchElementException

  def setHead[A](element: A, flist: FList[A]): FList[A] =
    flist match
      case list @ Node(head, tail) => Node(element, list)
      case Nil => Node(element, Nil)

  def drop[A](flist: FList[A], n: Int): FList[A] =
    require(n >= 0)

    @tailrec
    def loop(flist: FList[A], count: Int): FList[A] =
      if count == 0 then flist
      else if flist == Nil then Nil
      else loop(FList.tail(flist), count - 1)
    
    loop(flist, n)

  def dropWhile[A](flist: FList[A], func: A => Boolean): FList[A] =
    flist match
      case Node(head, tail) if func(head) => dropWhile(FList.tail(flist), func)
      case _ => flist
```

### 4.2 FList unit test
`TestFList.scala`

```scala
import org.junit.Test
import org.junit.Assert.*

class TestFList:
  @Test 
  def testApply(): Unit = 
    val myFList: FList[String] = FList("a", "b", "c")
    assertEquals(Node("a", Node("b", Node("c", Nil))), myFList)

  @Test
  def testFill(): Unit = 
    val myFList = FList.fill("a", 3)
    assertEquals(FList("a", "a", "a"), myFList)

  @Test(expected = classOf[IllegalArgumentException])
  def testFillNegativeN(): Unit = 
    FList.fill("b", -1)

  @Test
  def testTail(): Unit = 
    val myFList = FList("a", "b", "c")
    assertEquals(FList("b", "c"), FList.tail(myFList))

  @Test(expected = classOf[UnsupportedOperationException])
  def testTailNil(): Unit = 
    val myFList = FList()
    FList.tail(myFList)

  @Test
  def testHead(): Unit = 
    val myFList = FList("a", "b", "c")
    assertEquals("a", FList.head(myFList))

  @Test(expected = classOf[NoSuchElementException])
  def testHeadNil(): Unit = 
    val myFList = FList()
    FList.head(myFList)

  @Test
  def testSetHead(): Unit = 
    val myFList = FList("b", "c")
    assertEquals(FList("a", "b", "c"), FList.setHead("a", myFList))

  @Test
  def testSetHeadNil(): Unit = 
    val myFList = FList()
    assertEquals(FList("a"), FList.setHead("a", myFList))

  @Test
  def testDrop(): Unit = 
    val myFList = FList("a", "b", "c")
    assertEquals(FList("c"), FList.drop(myFList, 2))

  @Test
  def testDropAll(): Unit = 
    val myFList = FList("a", "b", "c")
    assertEquals(FList(), FList.drop(myFList, 3))
    assertEquals(FList(), FList.drop(myFList, 10))

  @Test
  def testDropZero(): Unit = 
    val myFList = FList("a", "b", "c")
    assertEquals(FList("a", "b", "c"), FList.drop(myFList, 0))

  @Test(expected = classOf[IllegalArgumentException])
  def testDropNegative(): Unit = 
    val myFList = FList("a", "b", "c")
    FList.drop(myFList, -4)

  @Test
  def testDropWhile(): Unit =
    assertEquals(FList("c"), FList.dropWhile(FList("a", "b", "c"), elem => elem < "c"))
    assertEquals(FList(1, 2, 3), FList.dropWhile(FList(1,2,3), elem => elem > 5))
    assertEquals(FList(), FList.dropWhile(FList(1,2,3), elem => elem < 5))
```