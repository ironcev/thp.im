---
title: Local Functions, Subtle Leaks
subtitle: C# 7.0 local functions, leaking under the hood.
tags: csharp csharp70 under-the-hood
image: "csharp-70-local-functions-leaking-under-the-hood.jpg"
publishedOn: "2018-03-17T12:00:00+0100"
lastUpdatedOn: "2018-03-18T12:00:00+0100"
---
##Are You Sure?
The two [local functions](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/local-functions) surprised me at first. Nested at the top of an `if` statement, right after the condition, neatly formatted, they looked just like a regular method call, and not a local function definition. I took me a second or two to calibrate my eyes and recognize what the code was actually doing.

"Is it a good idea to use local functions here? They create [closures](http://csharpindepth.com/articles/chapter5/closures.aspx) in the background, don't they?" Stefan asked. Stefan is always careful when it comes to low level code performance. Unnecessary heap allocations are to be avoided unless we have a really good reason to tolerate them. And I agree.

"Oh no", I reassured him. "Local functions do not create closures in the background. There is no need for that. The compiler turns them into private methods and passes the enclosing local variables as ref arguments. There are no [hidden heap allocations]({% post_url 2015-12-17-no-more-hidden-allocations-please %}) here."

"Are you sure?" Stefan asked me, a bit suspiciously.
"Yes, I am sure." I answered, with a voice that didn't leave any place for additional doubts.

We restructured the code a bit. One of the local functions wasn't actually needed so we deleted it. We moved the other one out of the `if` statement to the bottom of the enclosing method. The code got really nice and readable. We were both satisfied with the outcome of our short refactoring session, up to a single detail. [ReSharper](https://www.jetbrains.com/resharper/) was complaining of an [implicitly captured closure](https://stackoverflow.com/a/15843306/7025570). An implicitly captured closure that we didn't see. Or better to say, we couldn't see it. Local methods do not create closures, that's what I said. There were some lambdas in the code, but they didn't capture any local variables. After pondering about it a bit we decided to ignore this tiny mystery. ReSharper got confused again as it sometimes does. It's obviously that, what else. Case closed. Or maybe not ;-)

On my way home I started rolling out in my head the code we had in front of us. I tried to envision what the compiler has to generate in the background so that the code works. It didn't take me much to realize that Yes I was sure but No I wasn't right :-(

Sorry Stefan!

My path to redemption is given below. In small and detailed steps, so that it's easy to follow. The path goes all the way down to a subtle memory leak one could get when approaching local functions naively as I did.

##C# 7.0 Local Functions Under The Hood
[SharpLab](https://sharplab.io/) is arguably the best and easiest way to peek under the hood and see what kind of code C# compiler generates in the background. The compiler uses cryptic, hard-to-read identifiers for the generated code. In the examples given below I made them human-readable. That way it is much easier to grasp what's really going on in the code. After each example I also provide a link to SharpLab so that you can try the code samples on your own and see what exactly gets generated. Let's start :-)

###Local Functions That do not Use Local Variables and Class Instance Members
The first `LocalFunction` on our path cannot be any simpler than it is. It does not use any of the local variables of its enclosing `Method` and does not access any of the class instance members:

    void Method()
    {
        int localVariable = 0;
        WriteLine(localVariable);
    
        LocalFunction();
    
        void LocalFunction()
        {
            WriteLine("I do not use local variables.");
            WriteLine("I do not use class instance members.");
        }
    }

The code that the compiler generates for it is straightforward and (almost ;-)) exactly what I would expect:

    void Method()
    {
        int value = 0;
        WriteLine(value);
        LocalFunction();
    }
    
    [CompilerGenerated]
    internal static void LocalFunction()
    {
        WriteLine("I do not use local variables.");
        WriteLine("I do not use class instance members.");
    }

<p style="text-align:center"><a href="https://sharplab.io/#v2:CYLg1APgAgDABFAjANgYgdAYQPYDsDO2ANgKYDcAsAFDVQBMcAMtgMYCGRUArAC4CWefABUAFmx4ARbADlsPAKr4SzdkQBqbAE582AI1L4AgrmCYibfPgCSBHm1wsSAWRIBbXSU35qAb2pwAhAAWOBceEWxgAAoASn9AvypA5Lg+XB44IlYODW09UjgAXjgYSiSUgIB1bR5lNJIorNVcnX0SGLL4ipUObn48WM7yiqgQns5eAVxYrpTEiorqvlrGeqiAIis4YGw4XDk4AFclTOyiOAA3LVaDdHWO2YW4JZW1ze3d/YzjkgQGNPwdgcv1cbg8XjuD2GKQAvrM4VQYUA==" class="new-window">Try this example on SharpLab.</a></p>

Our `LocalFunction` simply turns into an `internal static` method. I expected the method to be `private` and frankly saying I don't see a reason why it is `internal` and not `private`, but that's a slight detail. Important for our story is the following fact: **there are no any kind of closures involved and there is a zero performance penalty of any kind** compared to the code we would write manually. I was right so far. Let's walk further. 

###Local Functions That Use Local Variables
In our second step, the `LocalFunction` uses the local variables of its enclosing `Method`:

    void Method()
    {
        int localVariable = 0;
        string otherLocalVariable = localVariable.ToString();
    
        LocalFunction();
    
        void LocalFunction()
        {
            WriteLine($"I use {localVariable} and {otherLocalVariable}.");
        }
    }

The code that the compiler generates is again straightforward and justifies what I told to Stefan:

    [CompilerGenerated]
    private struct CapturedVariables
    {
        public int localVariable;
        public string otherLocalVariable;
    }
    
    void Method()
    {
        CapturedVariables capturedVariables;
        capturedVariables.localVariable = 0;
        capturedVariables.otherLocalVariable = capturedVariables.localVariable.ToString();
    
        LocalFunction(ref capturedVariables);
    }
    
    [CompilerGenerated]
    internal static void LocalFunction(ref CapturedVariables ptr)
    {
        WriteLine($"I use {ptr.localVariable} and {ptr.otherLocalVariable}.");
    }

<p style="text-align:center"><a href="https://sharplab.io/#v2:CYLg1APgAgDABFAjANgYgdAYQPYDsDO2ANgKYDcAsAFDVQBMcAMtgMYCGRUArAC4CWefABUAFmx4BVfCWbsiANTYAnPmwBGpfNQDe1OPoQAWOAFkSPEdmAAKAJR6DuqgZdw+uHnCKsOiletI4AF44GEpnV30keGwLEiVZX2VVDRJgrx8FZICSdCFsAGUeFVwAcztwh0jEzl4BXAqq1xrufjwAdT4LAAVlNgBbc3j8a285PxTSABo4WJF4momc20qIyKhjFrq8OyaXJ0jI9pUeGXcSawASACIASTgAV2k4bTGk/1SAXzg2XGAXuYLTJLL7oa4rPYGT7USFRTaZVr1To9PqDU5KEbuTy4B79NTxGbROCnAAePHsa1cB0OLmOXTOuAuN3uTzSr2B2S+Pz+ALiCQ5H1InzBEMpLmhlIlnyAA" class="new-window">Try this example on SharpLab.</a></p>

The compiler declares a `private struct` that contains (captures) the local variables. Every captured local variable will become a public field of that `struct`. It will then instantiate the `struct` in the `Method` and transform all the access to the original local variables into the access to those public fields. The `LocalFunction` will again become an `internal static` method but this time with a single `ref` parameter - a reference to the instance of the declared struct.

One may say of course that `CapturedVariables` struct is nothing but a closure struct, similar to generated closure classes we get in the background when dealing with lambdas that capture local variables. In other words, we have closures here, don't we? ;-) I don't see it that way. When I talk about closures I mean closure classes whose instances are heap-allocated and (potentially) live longer then the lexical scope of the captured variables. This is for me the crucial feature of closures - giving the captured variables possibility to "survive" after the method that declares them finishes its execution. This, of course, implies heap allocation.

In our case, however, there is no heap allocation involved (`CapturedVariables` is a `struct`), no additional memory is allocated (C# structs have zero additional memory overhead) and the captured variables will be removed from the stack when `Method` finishes its execution (they will not "survive" the method call). In other word, again, **there is no performance penalty of any kind** compared to the code we would write manually.

Just for the record, the `LocalFunction` can of course have its own parameters:

    void Method()
    {
        int localVariable = 0;
        string otherLocalVariable = localVariable.ToString();
    
        LocalFunctionWithParameters(localVariable, otherLocalVariable);
    
        void LocalFunctionWithParameters(int number, string text)
        {
            WriteLine($"I use {localVariable} and {otherLocalVariable}.");
        }
    }

In that case the compiler generated method will, expectedly, have the same parameters and the `ref`erence to the captured local variables will be appended as the last parameter:

    void Method()
    {
        CapturedVariables capturedVariables;
        capturedVariables.localVariable = 0;
        capturedVariables.otherLocalVariable = capturedVariables.localVariable.ToString();
    
        LocalFunctionWithParameters(capturedVariables.localVariable, capturedVariables.otherLocalVariable, ref capturedVariables);
    }
    
    [CompilerGenerated]
    internal static void LocalFunctionWithParameters(int number, string text, ref CapturedVariables ptr)
    {
        WriteLine($"I use {ptr.localVariable} and {ptr.otherLocalVariable}.");
    }

Important thing to mention is that **only the local variables that are actually used within the `LocalFunction` will be captured within the `CapturedVariables` struct**. In other words, if our `LocalFunction` uses only one `localVariable`:

    void Method()
    {
        int localVariable = 0;
        string otherLocalVariable = localVariable.ToString();
        WriteLine(otherLocalVariable);
    
        LocalFunction();
    
        void LocalFunction()
        {
            WriteLine($"I use only the local variable {localVariable}.");
        }
    }

the compiler will generate the following:

    [CompilerGenerated]
    internal struct CapturedVariables
    {
        public int localVariable;
    }
    
    void Method()
    {
        CapturedVariables capturedVariables;
        capturedVariables.localVariable = 0;
    
        string otherLocalVariable = capturedVariables.localVariable.ToString();
    
        WriteLine(otherLocalVariable);
    
        LocalFunction(ref capturedVariables);
    }
    
    [CompilerGenerated]
    internal static void LocalFunction(ref CapturedVariables ptr)
    {
        WriteLine($"I use only the local variable {ptr.localVariable}.");
    }

<p style="text-align:center"><a href="https://sharplab.io/#v2:CYLg1APgAgDABFAjANgYgdAYQPYDsDO2ANgKYDcAsAFDVQBMcAMtgMYCGRUArAC4CWefABUAFmx4BVfCQDyuIgE8AytgC2JZuyIA1NgCc+bAEal81AN7U41hABY4AWRI8R2YAAoAlFZuWqNgLg+XB44IlYOXQNjUjgAXjgYSn9A6yR4bBcSPU1I/UMTEniwiJ18mJJ0IWwlHgNcAHMvZNTrAHUDHg1gkndMkWzcsujCz2SfVKHufjxm6gnAqHsp3gFcLwWAv1bAjr4uxh73ABIAIgBJOABXaTg8RTgskq04ADdywrhzcK0ogtIAL7oU5jTY2AELCFUAFAA==" class="new-window">Try this example on SharpLab.</a></p>

Notice that the `localVariable` is indeed contained within the `CapturedVariables`, but the `otherLocalVariable` isn't.

###Local Functions That Use Class Instance Members
Ready for the third step? Away from local variables! Our `LocalFunction` , for the moment, uses only class instance members:

    void Method()
    {
        LocalFunction();
    
        void LocalFunction()
        {
            WriteLine($"I use {_instanceField}.");
            WriteLine($"I use {InstanceProperty}.");
            WriteLine($"I call {InstanceMethod()}.");
        }
    }

The code generated by the compiler is again straightforward. The generated method becomes and instance method, and this time, surprisingly, it is `private` and not `internal` as before:

    void Method()
    {
        this.LocalFunction();
    }
    
    [CompilerGenerated]
    private void LocalFunction()
    {
        WriteLine($"I use {this._instanceField}.");
        WriteLine($"I use {this.InstanceProperty}.");
        WriteLine($"I call {this.InstanceMethod()}.");
    }

<p style="text-align:center"><a href="https://sharplab.io/#v2:CYLg1APgAgDABFAjANgYgdAYQPYDsDO2ANgKYDcAsAFDVQBMcAMtgMYCGRUArAC4CWefABUAFmx4BVfCQDyuIgE9MRNvnwBJAjza4WJALIkAtgCMSAJ3zUA3tTj24AB3N8AbuJJw+uHnAD63vjauiQAYnwkRMBwALxwMJRUDggAzGjwmkE6egAK5tiOFjwKsQB8cABEFYnJ3r6ZwXqGPCLYwAAUAJRl8Yl2DlAALHDNrR2d/fa2SckOzOycvAK4XX0zswjD8xzc/Hhdk7PTGxsA6i48JIzeJO0AJBXqcACu0nDWAVrZYRFRAL7oCqdGonZLnPiXa64W4PJ6vTzWBrfPIFIoKAFAkGg+zgyE3e6POALIjvJEhUZtLoY4GHZJ/Q70qh/IA" class="new-window">Try this example on SharpLab.</a></p>

And what about the case when the `LocalFunction` uses both local variables and class instance members?

    void Method()
    {
        int localVariable = 0;
        string otherLocalVariable = localVariable.ToString();
        WriteLine(otherLocalVariable);
    
        LocalFunction();
    
        void LocalFunction()
        {
            WriteLine($"I use {localVariable} and {otherLocalVariable}.");
            WriteLine($"I use {_instanceField}.");
            WriteLine($"I use {InstanceProperty}.");
            WriteLine($"I call {InstanceMethod()}.");
        }
    }

My expectation was that the compiler will capture the local variables as before and generate an *instance* method that gets the local variables as a `ref` to a generated `struct`:

    [CompilerGenerated]
    internal struct CapturedVariables
    {
        public int localVariable;
        public string otherLocalVariable;
    }
    
    private void Method()
    {
        CapturedVariables capturedVariables;
        capturedVariables.localVariable = 0;
        capturedVariables.otherLocalVariable = capturedVariables.localVariable.ToString();
        WriteLine(capturedVariables.otherLocalVariable);
    
        LocalFunction(ref capturedVariables);
    }
    
    private void LocalFunction(ref CapturedVariables ptr) // <-- Instance method.
    {
        WriteLine($"I use {ptr.localVariable} and {ptr.otherLocalVariable}.");
        WriteLine($"I use {this._instanceField}.");
        WriteLine($"I use {this.InstanceProperty}.");
        WriteLine($"I call {this.InstanceMethod()}.");
    }

But that's not what happens. Apparently, the compiler generates a *static* method and passes `this` as one of the captured variables:

    [CompilerGenerated]
    internal struct CapturedVariables
    {
        public int localVariable;
        public string otherLocalVariable;
        public LocalFunctionsThatUseLocalVariablesAndClassInstanceMembers @this;
    }
    
    private void Method()
    {
        CapturedVariables capturedVariables;
        
        capturedVariables.@this = this; // <-- Capturing this.
        
        capturedVariables.localVariable = 0;
        capturedVariables.otherLocalVariable = capturedVariables.localVariable.ToString();
        WriteLine(capturedVariables.otherLocalVariable);
    
        LocalFunction(ref capturedVariables);
        ExpectedLocalFunction(ref capturedVariableswithoutThis);
    }
    
    [CompilerGenerated]
    internal static void LocalFunction(ref CapturedVariables ptr)
    {
        WriteLine($"I use {ptr.localVariable} and {ptr.otherLocalVariable}.");
        WriteLine($"I use {ptr.@this._instanceField}.");
        WriteLine($"I use {ptr.@this.InstanceProperty}.");
        WriteLine($"I call {ptr.@this.InstanceMethod()}.");
    }

<p style="text-align:center"><a href="https://sharplab.io/#v2:CYLg1APgAgDABFAjANgYgdAYQPYDsDO2ANgKYDcAsAFDVQBMcAMtgMYCGRUArAC4CWefABUAFmx4BVfCWbsiANTYAnPmwBGpfAEFcwTETb58ASQI82uFiQCyJALZqSS/NQDe1OJ7gAHFQDdxEjg+XB44AH0Q/HNLEgAxPhIiYDgAXjgYSiovBABmNHhTaIsrAAUlbG8nHgBPNIA+OAAiJqyckLCimKtbHhFsYAAKAEoGjKyPLygAFjhe/qHhyc93bJyvDrgiVg5FFXVSNPHl9aR4bD6nWV3lVQ0g9O25PbvSdCFsAGUeFVwAcxGbXWngA6ioeDIQiRBhcRFcdgpbgcSMMJmtgddOLwBLhAdQTjkZkwEdx+HgRgSvKtgcCwXwIYwoYMACRNYxwACu0jgrieN329wAvnALClXLD4c8kUL0E1UZTaeDIbhoaz2Vygq5ImYSvFEslBbL5eiaaClYyVSy2Zzua4urrypVqjVDXKgaazfTlarrXIiDz7bF5gMRq7jabBSdI1Ro0A==" class="new-window">Try this example on SharpLab.</a></p>

Strictly speaking, this produces a slight overhead of having the `Method`'s `this` pointer twice on the stack - once as the first, invisible, parameter of the method, and the second time within the instance of the `CapturedVariables` struct. I have some vague idea what could be the reason to do it that way (and not the way I originally expected) but of course I'm all but sure.

Anyhow, aside of this slight issue with `this` up to now we didn't see that local variables produce any additional burden when it comes to memory allocation. And most of all, there were no closure classes involved at all. Third step, and my conscience is still clear.

###Local Functions That Use Local Variables And Are Used in Lambda Expressions
But will it stay clear during the fourth step? On my way home, as I said, I was playing in my had with the code Stefan was writing. Was ReSharper really confused as we thought? Or was there indeed something going in the background that we weren't aware of?

The right answer came to me immediately after I realized that *the local function we had in the code was being called later on in a lambda expression*! The code we had was conceptually similar to this one:

    void Method()
    {
        int localVariable = 0;
        string otherLocalVariable = localVariable.ToString();
        WriteLine(otherLocalVariable);
    
        Enumerable.Range(0, 10).Where(i => !LocalFunction());
    
        bool LocalFunction()
        {
            WriteLine($"I use {localVariable} and {otherLocalVariable}.");
            return true;
        }
    }

As you can see, the `LocalFunction` uses local variables and at the same time it is used in the lambda expression passed to the `Where()` method. The fact that the `LocalFunction` is used in a lambda turns everything we learned above upside down! Basically, the lambda passed to `Where`, from the compiler perspective, can survive the lifetime of a single `Method` call. Which means that **the `LocalFunction` and all the variables it captures have to have a lifetime that extends the lifetime of the `Method` call**. Which at the end means that this time we have to capture the local variables used by `LocalFunction` in an instance of a closure class! And this time I mean *real closure*. One instantiated on a heap. Mea culpa, mea maxima culpa.

As this became apparent to me, I knew immediately what the compiler is going to generate in this case. Here it is:

    [CompilerGenerated]
    private sealed class Closure // <-- Real closure indeed.
    {
        public int localVariable;
        public string otherLocalVariable;
    
        internal bool Lambda(int i) => !LocalFunction();
    
        internal bool LocalFunction()
        {
            WriteLine($"I use {this.localVariable} and {this.otherLocalVariable}.");
            return true;
        }
    }
    
    private void Method()
    {
        Closure closure = new Closure(); // <-- Heap allocation.
        closure.localVariable = 0;
        closure.otherLocalVariable = closure.localVariable.ToString();
        
        WriteLine(closure.otherLocalVariable);
        
        Enumerable.Range(0, 10).Where(closure.Lambda);
    }

<p style="text-align:center"><a href="https://sharplab.io/#v2:CYLg1APgAgDABFAjAOgDIEsB2BHA3AWAChYFEA2U5AYQHtMBnGgGwFMDCioAmOVGgYwCGTKAFYALujr0AKgAtB4gKr0WfIUwBqggE7pBAI1b0AgpmAmdLFS2ABJTKkEBbA8EEBRAB4AHK/XopBiIAbyI4CIQAFjgAWRZxORpgAAoASnDIsMJI3LgscTgmAWFtPUNWOABeOBh2PMikeBpElh11Ut19IxZqopKtLoqWZBkaAGVxPUwAc3T6hrgAdT1xNSwWFJa5No7B8p609kyGj0wAV2c24eQAJUFZzZgAGjhEGDTkJZ2rFPRqgB8cAAhHsxJI6OkjkQTnkDDRmLwBuCgulYblsos8it0GsMJhNgASABEdjg51UcBCxQ0ZW6rAAvnAHsAqdtdgM6cMGchidCcljGgB2OBTc5sdGRBmw6WEWVAA===" class="new-window">Try this example on SharpLab.</a></p>

There is nothing surprising in that code. It's just a regular way how lambdas and closures are implemented.

The whole story motivated me to dig a bit deeper and double check my assumptions on background mechanics of local functions. Below is the case, our fifth step, that struck me bit.

###Local Functions That Use Local Variables Different Than Those Used in a Lambda Expression
I pictured a few cases in my head where local functions and lambdas were playing together. If they share local variables, those for sure have to be captured within a closure, that's clear - the lambda's need wins, so to say. But what about the case when we encounter a lambda expression and a local function in code, and they both access local variables, but *different ones*:

    void Method()
    {
        int localVariable = 0;
        string otherLocalVariable = localVariable.ToString();
    
        Action lambdaThatUsesOtherLocalVariable =() => WriteLine(otherLocalVariable);
    
        LocalFunction();
    
        void LocalFunction()
        {
            WriteLine($"I use only the local variable {localVariable}.");
        }
    }

As you can see the `LocalFunction` uses only the `localVariable` and the lambda only the `otherLocalVariable`. The generated code I expected to get was:

    [CompilerGenerated]
    private sealed class Closure
    {
        public string otherLocalVariable;
    
        internal void Lambda()
        {
            WriteLine(this.otherLocalVariable);
        }
    }
    
    [CompilerGenerated]
    internal struct CapturedVariables
    {
        public int localVariable;
    }
    
    void Method()
    {
        CapturedVariables capturedVariables;
        Closure closure = new Closure();
        capturedVariables.localVariable = 0;
        closure.otherLocalVariable = capturedVariables.localVariable.ToString();
    
        Action lambdaThatUsesOtherLocalVariable = new Action(closure.Lambda);
    
        LocalFunction(ref capturedVariables);
    }
    
    [CompilerGenerated]
    internal static void LocalFunction(ref CapturedVariables ptr)
    {
        WriteLine($"I use only the local variable {ptr.localVariable}.");
    }

Basically, I expected to have a closure class that captures only what the lambda really needs and a capturing struct that captures only what the `LocalFunction` needs. It turned out that the compiler follows other logic, though:

    [CompilerGenerated]
    private sealed class Closure
    {
        public string otherLocalVariable;
        public int localVariable;
    
        internal void Lambda()
        {
            WriteLine(this.otherLocalVariable);
        }
    
        internal void LocalFunction()
        {
            WriteLine($"I use only the local variable {this.localVariable}.");
        }
    }
    
    void Method()
    {
        Closure closure = new Closure();
        closure.localVariable = 0;
        closure.otherLocalVariable = closure.localVariable.ToString();
    
        Action lambdaThatUsesOtherLocalVariable = new Action(closure.Lambda);
    
        closure.LocalFunction();
    }

<p style="text-align:center"><a href="https://sharplab.io/#v2:CYLg1APgAgDABFAjAbgLAChYMQNmwOgGEB7AOwGdiAbAUzXQygCY4AZYgYwEMqoBWAC4BLMuQAqACy4CAquRrtuVAGpcATkK4AjWuQAiQgGaGaamqQGSupScXlyawAJKkAgqy4BbLcC4BRAA8ABzNychFSDABvDDg4hAAWOABZGgEJYmAACgBKWPiY9HjiuCELOCpOHlUNbVo4AF44GHoS+KR4YnTTRWr1TR0aRoqqlX66mnwxYgBlAQ1SAHNc+ny2pBYqLx8uK1l5cgB5brVesdrB4dzGgD44AHUNAQUymiyuiR7RmoHaHNWim02KN+MIyCsMGsSlAkmdQRFclDioUgSVHkJnqxXlkACQAIiccAArvI4GQqABPODdEZKOAAN3GlyilSUPwmAF98Hj/kj4hyoQL0BygA" class="new-window">Try this example on SharpLab.</a></p>

There is, indeed, only one closure class "shared" by the lambda and the `LocalFunction`...

After trying out several combinations of lambdas and/or local functions appearing separately and/or together in a method the following turned out.

**The C# compiler will always generate a single closure class per method, no matter if the lambdas and/or local functions share the same local variables or not.** One to rule them all :-(

To me personally, this breaks the [principle of least surprise](https://en.wikipedia.org/wiki/Principle_of_least_astonishment).

Which brings us to a subtle memory leak I mentioned couple of page-ups above.

##The Subtle Memory Leak
Since usually I would not expect that a local variable used in a local function is captured within the closure created by lambda that do not use that variable ;-) I would consider this code to be perfectly safe and free of memory leaks:

    Action Method()
    {
        var resourceDemandingObject = new ResourceDemandingClass();
        string someLocalVariable = "";
    
        Action lambdaThatUsesSomeLocalVariable = () => WriteLine(someLocalVariable);
    
        LocalFunctionThatUsesTheResourceDemandingObject();
    
        return lambdaThatUsesSomeLocalVariable;
    
        void LocalFunctionThatUsesTheResourceDemandingObject()
        {
            WriteLine($"I use the {resourceDemandingObject}.");
        }
    }
    
The `resourceDemandingObject` is not used anywhere else after the `LocalFunctionThatUsesTheResourceDemandingObject` is executed. Thus I would expect that it is garbage collected after the `Method` is executed. But knowing the surprising implementation rule mentioned above, we know that the **`resourceDemandingObject` will survive the execution of the `Method` since it is going to be captured by the closure referenced by the returned `Action` object**:

    [CompilerGenerated]
    private sealed class Closure
    {
        public string someLocalVariable;
        public ResourceDemandingClass resourceDemandingObject;
        internal void Lambda()
        {
            WriteLine(this.someLocalVariable);
        }

        internal void LocalFunctionThatUsesTheResourceDemandingObject()
        {
            WriteLine($"I use the {this.resourceDemandingObject}.");
        }
    }

    private Action Method()
    {
        Closure closure = new Closure();
        closure.resourceDemandingObject = new ResourceDemandingClass();
        closure.someLocalVariable = "";

        Action result = new Action(closure.Lambda);

        closure.LocalFunctionThatUsesTheResourceDemandingObject();

        return result;
    }

<p style="text-align:center"><a href="https://sharplab.io/#v2:CYLg1APgAgDABFAjAbgLAChYMQNmwOgGEB7AOwGdiAbAUzXQygCY4BlAVwCMAXWgWRoBbYgCcAngBkaAQwDWGAN4Y4KuAAcRASwBu07jQQsASjUrsRAYxoARIdNLBNpAOaEq08uTgK4AXwzKqkgsAtwAFsTAABQAlIEqSuiqyXC6InAipsTmVraC9o4uAPKcAFY0FtxwALxwpDQA7nAmZpY2dg5Oru6esfQpQYjwlII0EsQW0lQAatJa0py0NXAARCv08SnBcO6CnMDSACphegCq5KasxKPjkzNzmgtLtbE1AHxwAOpa+hJONFERmMJlNZvNFjQYhskgM4LcplAAKzcTRkY5nC7kY40FrZNp5ApdErlSp9AIwgZQADsO2kewO6O450u12BdzBjwh0NhCAALHCQVQkSi0ScmZjsbicu18p1imUKtxYptkokeclvppfv8ogASFYASTg7AucHCBgUmVauQ6hWcxMVvnwKyhKtU/gpfgwviAA===" class="new-window">Try this example on SharpLab.</a></p>

Scary, if you ask me.

##The Moral of the Story
Trust ReSharper :-) Or at least don't ignore its hints too quickly.

{% hx_src LocalFunctionsSubtleLeaks %}