---
title: "No More Hidden Allocations, Please!"
subtitle: "Implicit type conversions, eager evaluations, closures, boxing, and some other nasty things hiding below the water's surface."
tags: performance api-design il swissknife under-the-hood
image: "tip-of-the-iceberg.jpg"
publishedOn: "2015-12-17T12:00:00+01:00"
lastUpdatedOn: "2017-04-16T12:00:00+01:00"
---
##The `Argument` Class
The [`Argument`](https://github.com/ironcev/SwissKnife/blob/master/Source/SwissKnife/Diagnostics/Contracts/Argument.cs) class was one of the first types I added to [SwissKnife](https://github.com/ironcev/swissknife). It turns the following cumbersome-to-write code:

    void SomeMethod(string key, object value, string fileName)
    {
        if (string.IsNullOrWhiteSpace(key))
            throw new ArgumentException("Key cannot be null or whitespace.", "key");
        if (value == null)
            throw new ArgumentNullException("key");
        if (string.IsNullOrWhiteSpace(fileName))
            throw new ArgumentException("File name cannot be null or whitespace.",
                                        "fileName");
        if (!File.Exists(fileName))
            throw new ArgumentException("File does not exist.", "fileName");

        // Do something useful here.
    }

into a much shorter and much more expressive equivalent:

    void SomeMethod(string key, object value, string fileName)
    {
        Argument.IsNotNullOrWhitespace(key, "key");
        Argument.IsNotNull(value, "value");
        Argument.IsNotNullOrWhitespace(fileName, "fileName");
        Argument.IsValid(File.Exists(fileName), "File does not exist.", "fileName");

        // Do something useful here.
    }

Yes, I do check method preconditions. Always. And I'm a huge proponent of doing it. Arguing why you should do it as well would be a topic for a separate blog post. In this post I want to present what I've learned out of the terrible original design and implementation of the `Argument` class. It's about **low level code performance and effective API design**.

Concretely speaking:

- **how to avoid hidden object allocations and hidden method calls** in a code that shouldn't have it (as there is a code that should have it :-))
- **how to design public API that is both performant and pleasant to use**

You will see a lot of [IL](https://en.wikipedia.org/wiki/Common_Intermediate_Language) code snippets in this post. Do not worry though if your are not familiar with IL. C# equivalents are added next to each IL code snippet, to visualize what IL is doing in the background.

##The Acceptable Cost
The second code snippet above is much shorter and much more expressive. It offers another one advantage as well, which is out of the topic so far.

**The cost for that shortness, expressiveness and unspoken third advantage is *exactly one* additional method call.** Or at least it should be exactly one additional method call ;-)

`IsNotNullOrWhitespace()` or `IsNotNull()` have to be invoked and that takes few processor cycles. This is a build-in cost that we cannot avoid. I was always fine with that trade-off. "Here you go. Take your two or three processor cycles and give me back that shortness and expressiveness!" Fair enough.

**This *one* additional method call is acceptable. Anything more than that is not.**

After two years of daily usage of the `Argument` class **it turned out that the real cost is much higher**, up to the level where it started to seriously bother me.

**It turned out as well that the expressiveness is not that good either**, at least on some of the check methods.

##The Hidden Cost
Let's start analysing the real cost of a check method call. Here is the implementation of the `IsNotNull()` method. All other methods have similar, straightforward and totally trivial implementations.

<pre><code>public static void IsNotNull(object parameterValue, <strong>Option&lt;string&gt;</strong> parameterName)
{
    if (parameterValue == null)
        throw new ArgumentNullException(parameterName<strong>.ValueOrNull</strong>);
}</code></pre>

"What are those `Option<string>` and `.ValueOrNull` up there?!" you must be asking yourselves now.

Well, checking method preconditions is not the only thing I advocate. I'm a huge fan of the [Option Idiom]({% post_url 2013-05-15-option-idiom %}) as well. And when I started designing SwissKnife, one of the goals was a consistent usage of the option idiom, according to the semantic I proposed in the chapter [Forcing Out the Beast]({% post_url 2013-05-15-option-idiom %}#forcing-out-the-beast).

In this case, we are talking about the "[Accept Option&lt;T&gt; as a Method Parameter Instead of Null]({% post_url 2013-05-15-option-idiom %}#accept-optionlttgt-as-a-method-parameter-instead-of-null)" part of the semantic. The `parameterName` is optional. It can be null. Therefore, communicate that clearly to the callers by accepting `Option<string>` instead of `string`.

While being very noble in its intention, this attempt to enforce option idiom brought a hidden cost.

###Hidden Type Conversions and Instance Allocations
Let's take a look what happens behind the scene when we call `IsNotNull()` in its most usual form (actually, the only form that makes sense).

    Argument.IsNotNull(value, "value");
    
translates into the following IL code:

<pre><code>ldarg.2
ldstr      "value"
<strong>call       valuetype Option`1&lt;!0&gt; valuetype Option`1&lt;string&gt;::op_Implicit(!0)</strong>
call       void Argument::IsNotNull(string, valuetype Option`1&lt;string&gt;)
</code></pre>

Putting the second method argument (`value`) and its name (`"value"`) on the stack in order to `call Argument::IsNotNull()` with them as method parameters is fine. That's the acceptable cost, you remember. But what's that additional cryptic `call` before the call to `IsNotNull()`?

[SwissKnife's Option Idiom](https://github.com/ironcev/SwissKnife/blob/master/Source/SwissKnife/Option.cs) supports [implicit conversion from T to Option&lt;T&gt;]({% post_url 2013-05-15-option-idiom %}#implicit-conversion-from-t-to-optionlttgt). It is a neat feature. But in this case it causes **three hidden costs**:

- the call of the implicit conversion operator `op_Implicit()`
- execution of its code, whatever that code does
- allocation of a new Option&lt;string&gt; object on the stack

Taking the original example with four `Argument` methods calls, all this happens *five times* behind the scene! Scary, if you ask me.

And without any valid reason! Enforcing the option idiom in this case, beside the zealotic following of its usage, does not bring any additional information to the caller. I'm sure all of you out there, who are using `IsNotNull()` had no clue until now that it accepts `Option<string>` as its second argument. The only way for null to appear as to parameter name is to explicitly write it:

    Argument.IsNotNull(value, null);

which, trust me, no one will ever do.

And therefore I decided to introduce a hardly noticeable breaking change in SwissKnife and replace the `Option<string>` with the good old `string`. Which of course produced the expected IL instructions without any hidden method calls or object allocations:

    ldarg.2
    ldstr      "value"
    call       void Argument::IsNotNull(string, string)

Nice :-)

##The Obvious Non-Wanted Cost
So far you've learned that I'm a proponent of method preconditions checking and zealotic follower of the option idiom. Here it comes another one charming side of my personality.

I *love* oh I love well written exception messages. Yes, those with punctuation, capital letters where needed and without typos. Exception messages that strive for being as helpful and descriptive as possible and, most of all, (relevant) information-rich.

Which usually and often leads to something like this:

    void SomeMethod(string directory, string something)
    {
        Argument.IsValid(Directory.Exists(directory),
                         string.Format("The directory '{0}' does not exist. " +
                                       "Something was: {1}.",
                                       directory, something),
                         "directory");

        // Do something useful here.
    }

**This time, even without analysing any IL code, the additional cost is obvious.**
The `string.Format()` is called each and every time `IsValid()` is called. And `string.Format()` is actually doing something. And it returns a newly created string at the end of its hard work.
And if your software works fine, which is, I hope, the case in 99.9999% of the time, that string will never ever be used in the body of the `IsValid()` method.

    void IsValid(bool condition, string exceptionMessage, string parameterName)
    {
        if (!condition)
            throw new ArgumentException(exceptionMessage, parameterName);
    }

Now, this hurts. A lot.

Plus, there is a usability issue here as well. This standard and very often usage of the `IsValid()` method is neither expressive nor short any more.

**That additional `string.Format()` call reduces the readability a lot. The whole assertion looks clumsy and is not readable at all.**

Let's fix those issues.

###Eager Evaluation
The first one is a typical case of *eager evaluation*. **The building of the information-rich error message should happen *only* if the `condition` is false.**
But it happens always. The solution is, of course to implement somehow what is called *lazy evaluation*.

A typical implementation of lazy evaluation in C# uses lambda expressions.

####Lazy Evaluation Using Lambda Expressions
It simple and straightforward. We just have to declare the `IsValid()` as

<pre><code>void IsValid(bool condition, <strong>Func&lt;string&gt;</strong> exceptionMessage, string parameterName)
{
    if (!condition)
        throw new ArgumentException(exceptionMessage<strong>()</strong>, parameterName);
}</code></pre>

and provide lambda in the call instead of the string itself:

<pre><code>Argument.IsValid(Directory.Exists(directory),
            <strong>() =&gt;</strong> string.Format("The directory '{0}' does not exist. " +
                                                    "Something was: {1}.",
                                                    directory, something),
            "directory");</code></pre>

Voilà! No more expensive `string.Format()` call and string allocation. Mission completed.

Yes. Except the fact that **the usage of the `IsValid()` is even uglier than before** and the fact that **we forced the poor C# compiler to generate this monster**

<pre><code>.locals init ([0] class '&lt;&gt;c__DisplayClass1' 'CS$&lt;&gt;8__locals2')
<strong>newobj</strong>     instance void '&lt;&gt;c__DisplayClass1'::.ctor()
stloc.0
ldloc.0
ldarg.1
stfld      string '&lt;&gt;c__DisplayClass1'::directory
ldloc.0
ldarg.2
stfld      string '&lt;&gt;c__DisplayClass1'::something
ldloc.0
ldfld      string '&lt;&gt;c__DisplayClass1'::directory
call       bool [mscorlib]System.IO.Directory::Exists(string)
ldstr      "directory"
ldloc.0
ldftn      instance string '&lt;&gt;c__DisplayClass1'::'&lt;SomeMethod&gt;b__0'()
<strong>newobj</strong>     instance void class
                    [mscorlib]System.Func`1&lt;string&gt;::.ctor(object,native int)
call       void Argument::IsValid(bool,class [mscorlib]
                                  System.Func`1&lt;string&gt;,string)</code></pre>

Looks ugly, doesn't it? Well, it *is* ugly. And it does an ugly thing as well. **Those two `newobj` instructions do exactly what they say - they allocate two new objects!** What is going on here!?

Here is the promised rough C# equivalent of the above IL code:

    class CompilerGeneratedClass
    {
        public string directory;
        public string something;

        public string Method()
        {
            return string.Format("The directory '{0}' does not exist. " +
                                 "Something was: {1}.",
                                 directory, something);
        }
    }

    public void SomeMethod(string directory, string something)
    {
        var capturedVariables = new CompilerGeneratedClass
        {
            directory = directory,
            something = something
        };
        
        var lambda = new Func<string>(capturedVariables.Method);

        Argument.IsValid(Directory.Exists(directory),
                         "directory",
                         lambda);

        // Do something useful here.
    }

To handle the [closure](https://en.wikipedia.org/wiki/Closure_(computer_programming)) the C# compiler auto-generates a class containing the captured variables and the method that represents the lambda.
It creates afterwards an instance of that auto-generated class (the first `newobj` in the IL code) and as well an instance of `Func<string>` pointing on the method in the auto-generated class.

For our discussion, this whole trickery narrows down to the fact that **we have two hidden object allocations in place**. And an ugly looking API. Utterly unacceptable!

**Out of all the possible solutions to the problem, I find this one with lambdas to be the worst.**

####Lazy Evaluation Using Parameter Arrays
Which other options do we have than? One rather obvious would be to use parameter arrays (`params` in C# or `ParamArray`s in VB.NET).

<pre><code>void IsValid(bool condition, string parameterName,
             string format, <strong>params object[] args</strong>)</code></pre>

    Argument.IsValid(Directory.Exists(directory),
                     "directory",
                     "The directory '{0}' does not exist. " +
                     "Something was: {1}.",
                     directory, something);

This is charming indeed :-) The `IsValid()` call finally looks decent and readable. `string.Format()` is lazily evaluated as well.

We could already announce our winner if there wouldn't be a slight catch behind the scene. The generated IL instruction set is again surprisingly lengthy:

<pre><code><strong>newarr</strong>     [mscorlib]System.Object
stloc.0
ldloc.0
ldc.i4.0
ldarg.1
stelem.ref
ldloc.0
ldc.i4.1
ldarg.2
stelem.ref
ldloc.0
call       void Argument::IsValid(bool,string,string,<strong>object[]</strong>)</code></pre>

**The `params` and `ParamArray` keywords are just a syntax sugar around arrays.** Meaning, the last argument of the `IsValid()` method is just a plain good old .NET array.
**An array that compiler allocates in the background before the method is called**, based on the parameters we provided during the compile time.
The above IL code creates a new array (`newarr`) and populates it with the parameters.

In other words, another one hidden object allocation :-(

####Fixed Number of Object Arguments
Let us not despair! We still have one option to consider. Why not take the same approach used in `string.Format()` itself, or for example `Console.WriteLine()`?

Knowing that no one will call `IsValid()` with 20 arguments we can safely overload it and allow passing up to few arguments as `System.Object`s. The overload with two arguments that fits to our example would than look like this

<pre><code>void IsValid(bool condition, string parameterName,
             string format, <strong>object arg0, object arg1</strong>)</code></pre>

and the generated IL instruction set becomes

    ldstr      "directory"
    ldstr      "The directory '{0}' does not exist and something was: {1}."
    ldarg.1
    ldarg.2
    call       void Argument::IsValid(bool,string,string,object,object)

Finally! No more hidden object allocations :-) Just a plain function call.

But wait! Before opening the champaign bottle let's consider one more case.

###Boxing
What happens if our `something` in the `SomeMethod()` is of a [value type](https://msdn.microsoft.com/en-us/library/s1ax56ch.aspx). Let's take `int` for example:

<pre><code>void SomeMethod(string directory, <strong>int</strong> something)</code></pre>

Will our IL code stay nice and clean? Let's check.

<pre><code>ldstr      "directory"
ldstr      "The directory '{0}' does not exist and something was: {1}."
ldarg.1
ldarg.2
<strong>box</strong>        [mscorlib]System.Int32
call       void Argument::IsValid(bool,string,string,object,object)</code></pre>

`box`? `box`? What's that `box` over there? Well, the IL instruction for [boxing](https://msdn.microsoft.com/en-us/library/yz2be5wk.aspx). When converting value types into `System.Object` CLR has to *box* them.
The whole process is called of course *boxing*. Skipping the details, the part of the [MSDN documentation on boxing](https://msdn.microsoft.com/en-us/library/yz2be5wk.aspx) relevant to us says "when the CLR boxes a value type, it wraps the value inside a System.Object and **stores it on the managed heap**."

In other words, **we again got a hidden object allocation** :-(

If you slowly started being frustrated asking yourself if this will ever end, again, do not despair.
Yes, there is a way out of this hidden object allocations. It goes over two parallel bridges - [.NET generic methods and type inference](https://msdn.microsoft.com/en-us/library/twcad0zb.aspx).

##And the Winner is...
If we make our `IsValid()` overrides generic:

<pre><code>void IsValid<strong>&lt;TArg0, TArg1&gt;</strong>(bool condition, string parameterName,
                           string format, <strong>TArg0 arg0, TArg1 arg1</strong>)</code></pre>

the compiler will infer `TArg0` and `TArg1` to be `string` and `int` respectively. The `IsValid()` call will look exactly the same as above, but the generated IL code will change to

<pre><code>ldstr      "directory"
ldstr      "The directory '{0}' does not exist and something was: {1}."
ldarg.1
ldarg.2
call       void Argument::IsValid&lt;string,int32&gt;(bool,string,string,!!0,!!1)</code></pre>

Voilà! Finally! This time no hidden allocations at all! Just a plain method call. We got our winner :-)

Since there is no such thing as free lunch, our winner also comes with a slight cost.
CLR will have to generate native code for several different `IsValid()` methods during runtime.
But since those methods do almost nothing and have very less instructions in them, this is an overhead we can surely live with.

##Wait, We Are Not Done Yet!
Not done yet? What else is left to say on the topic after a post this long?! We are resecting a trivial static method here, whose implementation consists only of a single statement! C'mon!

Defining a public API is not an easy task. **Behind each well-crafted type or method there is a tons of questions to be answered and trade-offs to be considered.**
Performance is just one of them.

Below are few questions to consider that come to my mind.

###Dynamic Arguments
This innocently-looking piece of code:

<pre><code>void SomeMethod(dynamic argument)
{
    Argument.IsValid(true,
                     "argument",
                     "The argument is not this and that: {0}.", argument);

    // Do something useful here.
}</code></pre>

will compile to the following IL. Have fun reading it :-) And don't forget to scroll on right to grasp it whole ;-)

    .param [1]
    .custom instance void [System.Core]System.Runtime.CompilerServices.DynamicAttribute::.ctor() = ( 01 00 00 00 ) 
    // Code size       145 (0x91)
    .maxstack  8
    .locals init ([0] class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo[] CS$0$0000)
    IL_0000:  ldsfld     class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Action`6<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,bool,string,string,object>> '<SomeMethod>o__SiteContainer3'::'&lt;&gt;p__Site4'
    brtrue.s   IL_0066
    ldc.i4     0x100
    ldstr      "IsValid"
    ldnull
    ldtoken    Snippets.FormattedStringSnippets.WithDynamicArguments
    call       class [mscorlib]System.Type [mscorlib]System.Type::GetTypeFromHandle(valuetype [mscorlib]System.RuntimeTypeHandle)
    ldc.i4.5
    newarr     [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo
    stloc.0
    ldloc.0
    ldc.i4.0
    ldc.i4.s   33
    ldnull
    call       class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo::Create(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfoFlags,string)
    stelem.ref
    ldloc.0
    ldc.i4.1
    ldc.i4.3
    ldnull
    call       class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo::Create(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfoFlags,string)
    stelem.ref
    ldloc.0
    ldc.i4.2
    ldc.i4.3
    ldnull
    call       class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo::Create(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfoFlags,string)
    stelem.ref
    ldloc.0
    ldc.i4.3
    ldc.i4.3
    ldnull
    call       class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo::Create(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfoFlags,string)
    stelem.ref
    ldloc.0
    ldc.i4.4
    ldc.i4.0
    ldnull
    call       class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo::Create(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfoFlags,string)
    stelem.ref
    ldloc.0
    call       class [System.Core]System.Runtime.CompilerServices.CallSiteBinder [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.Binder::InvokeMember(valuetype [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpBinderFlags,
    string,
    class [mscorlib]System.Collections.Generic.IEnumerable`1<class [mscorlib]System.Type>,
    class [mscorlib]System.Type,
    class [mscorlib]System.Collections.Generic.IEnumerable`1<class [Microsoft.CSharp]Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo>)
    call       class [System.Core]System.Runtime.CompilerServices.CallSite`1<!0> class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Action`6<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,bool,string,string,object>>::Create(class [System.Core]System.Runtime.CompilerServices.CallSiteBinder)
    stsfld     class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Action`6<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,bool,string,string,object>> '<SomeMethod>o__SiteContainer3'::'&lt;&gt;p__Site4'
    ldsfld     class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Action`6<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,bool,string,string,object>> '<SomeMethod>o__SiteContainer3'::'&lt;&gt;p__Site4'
    ldfld      !0 class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Action`6<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,bool,string,string,object>>::Target
    ldsfld     class [System.Core]System.Runtime.CompilerServices.CallSite`1<class [mscorlib]System.Action`6<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,bool,string,string,object>> '<SomeMethod>o__SiteContainer3'::'&lt;&gt;p__Site4'
    ldtoken    Argument
    call       class [mscorlib]System.Type [mscorlib]System.Type::GetTypeFromHandle(valuetype [mscorlib]System.RuntimeTypeHandle)
    ldc.i4.1
    ldstr      "argument"
    ldstr      "The argument is not this and that: {0}."
    ldarg.1
    callvirt   instance void class [mscorlib]System.Action`6<class [System.Core]System.Runtime.CompilerServices.CallSite,class [mscorlib]System.Type,bool,string,string,object>::Invoke(!0,!1,!2,!3,!4,!5)
    ret

So much about the word *hidden*. Do we want to consider this case as well? Or simply ignore it?

###Eagerly Evaluated Format Arguments
Consider this case, taken out of a real-life code:

<pre><code>Argument.IsValid(solution.Projects.Contains(project),
                 "project",
                 "The project must be contained in the solution.{0}" +
                 "The solution '{1}' does not contain the project '{2}'.",
                 <strong>Environment.NewLine</strong>,
                 <strong>solution.FileName</strong>,
                 <strong>project.ProjectName</strong>),
                 );</code></pre>

Although it doesn't look as a serious issue, the above code will always execute the getters for the `NewLine`, `FileName`, and `ProjectName` properties.
I've noticed several such examples in practice. Sometimes, the arguments passed to format include heavier things like `string.Join()` even in combination with `?:` operator.
And all of them are eagerly evaluated because our "winner" does not consider lazy evaluation of the format arguments.

But should it consider it all? Or we should simply leave it as it is right now?

###Code Contracts Support
Currently, some of the methods in the `Argument` class are attributed with the [`ContractArgumentValidatorAttribute`](https://msdn.microsoft.com/en-us/library/system.diagnostics.contracts.contractargumentvalidatorattribute(v=vs.110).aspx). They call [`Contract.EndContractBlock()`](https://msdn.microsoft.com/en-us/library/system.diagnostics.contracts.contract.endcontractblock(v=vs.110).aspx) as well. But some are not marked as `ContractArgumentValidator`s. Do we want the `Argument` to support code contracts or not? What are the pluses and what are the minuses of supporting them?

###Aggressive Inlining
Why bothering at all with the side effects of `Argument` method calls when we can simply inline all of them? Few well placed [`MethodImplOptions.AggressiveInlining`](https://msdn.microsoft.com/en-us/library/system.runtime.compilerservices.methodimploptions(v=vs.110).aspx)s and we are done.

Is it really that easy? Especially if we want to support code contracts as well? Will the `ContractArgumentValidatorAttribute` and `MethodImplAttribute` work together?

###IsWellNamed()
`IsValid` sounds as a bad name to me. It sticks out in a negative way. All other methods found in the `Attribute` class are very specific. `IsNotNull()`, `IsInRange()`, `IsGreaterThanZero()`, etc. `IsValid()` is used as a generic check, which is fine. But should its name be so generic and expressionless? Over time, I realized that I really don't like it. But I don't have a better one either :-(

`Fulfills()` maybe? Like

    Argument.Fulfills(condition, ...)

What do you think? All suggestions are welcome!

{% hx_src NoMoreHiddenAllocationsPlease %}