+++
date = "2016-03-03T23:47:44-06:00"
title = "Builder pattern in Scala"
description = "How to apply the Builder design pattern with Scala"
tags = ["Scala", "Design Patterns", "Pattern Matching"]
categories = ["Development"]
slug = "builder-pattern-in-scala"
+++

The *Builder Pattern* is a design pattern for create objects. The builder pattern allows to the user the creation of an object that requires a lot of parameters in its constructor.

The problem with objects that requires different parameters to be constructed is that the programmer will need to overload the constructor to support all the distinct combinations of parameters.

In *Java* is very common to create a new class (the builder) object that will receives all the parameters and builds a new object with the parameters received. I think the most known builder in Java is **StringBuilder**. In **Scala** we can use two Scala features to support a very similar behavior:

* Case classes
* Pattern matching *(Optional, Pattern matching will allow us to restrict invalid object creations)*

A very common and simple example for builder objects is to represent pizzas :D. Suppose we need to create pizzas, our pizzas can have different ingredients:

* Mozzarella
* Pepperoni
* Bacon
* Mushrooms
* Ham
* Pineapple

The first step is create our pizza model, we will use **case classes**.

``` Scala
case class Pizza(ingredients: List[String],
                 cheese: String = "Mozzarella",
                 size: String = "medium")
```

Now, any developer can use our pizza class to create pizzas :D

Let's create three different pizzas:
``` Scala
val italian = Pizza(List("Pepperoni", "Mushrooms"))
val hawaiian = Pizza(List("Ham", "Pineapple"), size = "Small")
val meat = Pizza(List("Ham", "Bacon"), cheese = "Cheddar")
```

As you can see, now you can create different kind of pizzas without problems.
