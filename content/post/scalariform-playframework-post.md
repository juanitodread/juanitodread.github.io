+++
date = "2016-02-10T10:28:48-06:00"
title = "Scalariform on a Play project"
description = "Adding Scalariform on a PlayFramework project"
tags = ["Scala", "Playframework", "Scalariform"]
categories = ["Development"]
slug = "scalariform-playframework-post"
+++

In the last days I have been playing with some powerful tools for start web applications in a fast and easy way that resides on the Cloud. These tools are:

* [Playframework](https://www.playframework.com/) As my web framework. It is really easy to start a web application on Play and is oriented to REST. Play supports Scala or Java as a language (I recommend to use Scala).
* [Heroku](https://www.heroku.com/home) It is really simple to deploy a Scala application. I tried Openshift but is more complicated since they don't have an environment for Scala (You need to use a DIY).
* [MongoDB](https://www.mongodb.org/) Really easy and powerful NoSQL database.

You can check the app [here](https://crud-lab.herokuapp.com/).

Finally after some attempts I was able to run my sample application. I was using Atom as my code editor (I needed to add a plugin to recognize the Scala syntax). I can say that Atom is a really good tool to edit Scala files but it doesn't have plugins to format code like Eclipse or Intellij IDEA. Fortunately exists a tool in Scala ([Scalariform](https://github.com/scala-ide/scalariform)) to format the code. You can run as an external tool or include in your SBT (Also is the plugin that Eclipse uses to format the code).

I choosed to run Scalariform from my SBT script. The default behavior is that Scalariform is executed when the code is compiled but you can change the default behavior. I use the default behavior.

The only thing you need to do is add the Scalariform plugin into the plugins.sbt file. The file is located in:

```
root-play-project/project/plugins.sbt
```
To use the plugin just add this line in *plugins.sbt*

```
addSbtPlugin("org.scalariform" % "sbt-scalariform" % "1.6.0")
```

And that's all!. 

Now on every project compilation Scalariform will format all the Scala code :D. You can modify the default settings of Scalariform if you want a different style. The recommendation is to use the [Scala Style Guide](http://docs.scala-lang.org/style/declarations.html)