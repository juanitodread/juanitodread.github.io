+++
date = "2016-04-11T09:36:02-05:00"
title = "Type specialization in Scala"
description = "Use of specialized types in generic class and methods in Scala"
tags = ["Scala", "Performance"]
categories = ["Development"]
slug = "type-specialization-scala"
+++

**Type Specialization** in Scala is a mechanism that allows us to increase the performance in our code when we are writing generic code. When we have a generic class definition the compiler needs to set a real type to the generic class, this represents an extra cost. 

When our real type is one of the *primitive* types (in Scala primitive types are treated as objects. Wrapped objects) the compiler needs to add appropiate boxing and unboxing operations. Again, this will generate an extra cost.

Since 2.8, Scala added specialized type parameters. This is just an annotation ```@specialized``` that can be used in any type parameter of a method or class definition. This annotation indicates to the compiler that in adition of the generic version of the class it is necessary to create *N* number of specialized versions of the defined class. The N number is determined by the definition of the annotation in the code. 

``` Scala
class LinkedList[@specialized T] {

  def append(@specialized(Int, Long) node: T): Unit = //...
  // ...

} 
```

In this case, we have defined the generic class with two specialized types: 

* The first one is on the definition of the class. Note that the annotation does not have any additional argument in its declaration. This means that the compiler will generate specialized classes version of the class for all the primitive types in Scala.

* The second one is on the definition of the append method. Here we are adding two arguments: Int and Long. This means that the compiler will generate specialized classes versions of the class for the primitive types Int and Long (int, long).

The compiler derives specialized definitions for all combinations of primitive types. Specialization is performed at the definition site in order to allows separate compilation. Each specialized class is derived from the original definition using specific combination of types and extends the generic class.

When a generic class is used, first is verified if the class has specialized versions, if so, the specialized class is used whenever possible and boxing process is not performed, incresing the performance of the application at runtime.

In general I think specialization is a great idea to increase runtime performance in our Scala code, but it also has a cost in compilation time because the compiler needs to generate aditional specialized classes. So use @specialized judiciosly.

Here are more detailed information about Type Specialization in Scala:


[http://www.scala-lang.org/old/sites/default/files/sids/dragos/Thu,%202010-05-06,%2017:56/sid-spec.pdf](http://www.scala-lang.org/old/sites/default/files/sids/dragos/Thu,%202010-05-06,%2017:56/sid-spec.pdf)

[http://www.scala-notes.org/2011/04/specializing-for-primitive-types/](http://www.scala-notes.org/2011/04/specializing-for-primitive-types/)