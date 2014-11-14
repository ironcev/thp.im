---
title: FunnelWeb on SQL CE
subtitle: 'How to run the <a href="http://www.funnelweblog.com">FunnelWeb</a> blog engine on Microsoft SQL Server Compact'
description: Step-by-step instructions on how to run FunnelWeb blog engine on Microsoft SQL Server Compact (SQL CE).
keywords: FunnelWeb Microsoft SQL Server Compact SQL CE
tags: funnelweb step-by-step
---
##What is FunnelWeb?
[FunnelWeb](http://www.funnelweblog.com/) is a simple, intuitive, and easy to use blog engine, exactly the one I was looking for when starting this blog. It's built "by developers for developers". Its creators like to call it "the blog engine of real developers".

Did I raise your curiosity? Would you like to install it locally and give it a try?

Well, installing it is an entry test for a "real developer". Do you know what cloning of [Mercurial](http://mercurial.selenic.com/) repository is? Do you create your published web sites by running [MSBuild](http://msdn.microsoft.com/en-us/library/ms171452\(v=vs.90\).aspx) scripts? Can you tell me, by heart, the connection string to your [SQL Server Compact (SQL CE)](http://en.wikipedia.org/wiki/SQL_Server_Compact) database? What is the name of the ASP.NET account on your local machine?

Can you answer all these interview questions? If the answer is yes, all you need to install it and get it running is a brief look on the [Getting Started](http://www.funnelweblog.com/getting-started) page on the FunnelWeb site. If the answer is no,  this step-by-step tutorial could be useful to you. It shows **how to set up the current release version of FunnelWeb** on a local machine running Windows 7 and IIS 7 and **how to connect it to SQL CE database**. The tutorial focus on potentially less known or less documented things like cloning Mercurial repository or **properly setting up FunnelWeb configuration file**. It assumes that IIS with ASP.NET 4.0 already runs on your machine and that you are familiar with [creating virtual directories in IIS](http://msdn.microsoft.com/en-us/library/bb763173\(v=vs.100\).aspx).

##Why SQL CE?
FunnelWeb currently uses either SQL Server 2008 (Express and other editions) or SQL CE to store blog content. SQL Server runs as a database service and brings all complexity of standard database management. Some hosting providers like [DiscountASP.NET](http://discountasp.net/) will even charge you additionally for database hosting. SQL CE is a lightweight embedded database that runs in-process. Database management narrows down to taking care of a single file. As such, it fits perfectly to the simplicity of FunnelWeb and my vision of an easily manageable blog.

##Installation Steps
The installation of a fully functional blog that runs on your local machine and uses SQL CE for storage consists of the following steps:

 1. Getting the source code of the latest release version.
 2. Building the blog web site out of the source code.
 3. Properly updating the configuration file.
 4. Creating virtual directory in IIS.
 5. Creating the SQL CE database inside of the FunnelWeb itself.
 
Each step is described in detail in the chapters below.

###Step 1: Getting the Source Code
FunnelWeb uses [Mercurial](http://mercurial.selenic.com/) source control system. If you are not familiar with Mercurial, this is the easiest way to get the latest source code (actually the whole [repository with complete history of the project](http://mercurial.selenic.com/wiki/UnderstandingMercurial)):

  1. Download and install TortoiseHg.  
  TortoiseHg is a Mercurial client that integrates into Windows shell. It's easy to use and will spare you of typing Mercurial commands directly. This installation will also install Mercurial command line interface (*hg.exe* file). Directory with Mercurial tools (inclusive *hg.exe*) will be added to the Windows system path making them accessible via command line. Note that *hg.exe* is actually used during the build process. Building of the web site will fail if *hg.exe* cannot be found in the system path.

  2. Clone the FunnelWeb release repository.  
First create a local directory in which the repository will be cloned. For the rest of this tutorial I will assume that the name of the directory is *C:\FunnelWebRepository*. Right mouse click on that directory. In the TortoiseHg menu choose the *TortoiseHg ► Clone...* option.

![Cloning the Mercurial repository](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/Cloning_the_Mercurial_repository.png)
    
The Clone dialog will appear. Set the source to [https://bitbucket.org/FunnelWeb/release](https://bitbucket.org/FunnelWeb/release) and click the Clone button.
    
![TortoiseHg's Clone dialog for cloning the Mercurial repository](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/TortoiseHg_Clone_dialog_for_cloning_the_Mercurial_repository.png)
    
Wait until all chunks are downloaded. If no error occurs your repository should look similar to this:
    
![Cloned FunnelWeb repository](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/Cloned_FunnelWeb_repository.png)

###Step 2: Building the Web Site
To build the web site, simply execute the *build.bat* file. Console window will appear showing the output of each build step. Wait until the Done message appears.
If everything goes well, there should be no error messages at the end. Note that the build process also runs unit tests. Some of those tests will try to connect to the database and will fail. Don't worry if that happens. The following output shows an error in unit test execution but should still be considered as successful build:

![Successful build of the FunnelWeb web site](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/Successful_build_of_the_FunnelWeb_web_site.png)

After the successful build your *c:\FunnelWebRepository\build\Published* directory should look like this:

![The FunnelWeb's Published directory](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/FunnelWeb_Published_directory.png)

###Step 3: Updating the Configuration File
Rename *My.config.sample* to *My.config*. *My.config* file contains database connection settings. Default configuration instructs FunnelWeb to connect to SQL Server Express database:

<pre>
<code>&lt;setting key="funnelweb.configuration.database.connection"
         value="<strong>database=FunnelWeb;server=.\SQLEXPRESS;
                trusted_connection=true;</strong>"/&gt;
&lt;setting key="funnelweb.configuration.database.schema"
         value="<strong>dbo</strong>"/&gt;
&lt;setting key="funnelweb.configuration.authentication.username"
         value="test"/&gt;
&lt;setting key="funnelweb.configuration.authentication.password"
         value="test"/&gt;
&lt;setting key="funnelweb.configuration.database.provider"
         value="<strong>sql</strong>"/&gt;</code>
</pre>

Username and password are both set to *test*. In order to connect to SQL CE change the configuration file as follows:

<pre>
<code>&lt;setting key="funnelweb.configuration.database.connection"
         value="<strong>Data Source=|DataDirectory|\FunnelWeb.sdf;
                Persist Security Info=False</strong>"/&gt;
&lt;<strong>setting key="funnelweb.configuration.database.schema"</strong>/&gt;
&lt;setting key="funnelweb.configuration.authentication.username"
         value="<strong>myUsername</strong>"/&gt;
&lt;setting key="funnelweb.configuration.authentication.password"
         value="<strong>myPassword</strong>"/&gt;
&lt;setting key="funnelweb.configuration.database.provider"
         value="<strong>SqlCe</strong>"/&gt;</code>
</pre>

Let's shortly explain the settings. SQL CE supports so called DataDirectories. That means we don't have to specify the entire path to an .sdf file in the connection string. Path can be specified as *&#x7C;DataDirectory&#x7C;\DatabaseName.sdf*. In case of ASP.NET the default data directory is the *App_Data* directory of the web site. This is where our database will be created by the FunnelWeb after we log in to the blog for the first time.

There is no need to specify the database schema and the provider has to be set to *SqlCe*. Strong suggestion is to change the username and password.

###Step 4: Creating the Virtual Directory
Once the blog is build and properly configured we can deploy it. Since we just want to try out the blog engine on our local machine, creating virtual directory will be sufficient. Here are the deployment steps:

  1. Copy the web site to the deployment directory.  
Create a directory which will contain the web site. For the rest of this tutorial I will assume that the name of the directory is *C:\FunnelWebBlog*. Copy the content of the *C:\FunnelWebRepository\build\Published* directory to the *C:\FunnelWebBlog*.

  2. [Create virtual directory in IIS](http://msdn.microsoft.com/en-us/library/bb763173\(v=vs.100\).aspx) that corresponds to *C:\FunnelWebBlog*.   
I will use FunnelWebBlog as alias. After creating the virtual directory, [convert it to application](http://msdn.microsoft.com/en-us/library/bb763173\(v=vs.90\).aspx) and set the application pool to the ASP.NET v4.0:

![Converting the IIS virtual directory to application](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/Converting_the_IIS_virtual_directory_to_application.png)
    
  3. Give ASP.NET account write permissions to the *Files* directory.   
*Files* directory will be used by the blog engine to store uploaded files. Therefore, ASP.NET account must have write permissions on this directory. On IIS 7 ASP.NET [runs under virtual account assigned to the application pool](http://learn.iis.net/page.aspx/624/application-pool-identities/). Enter IIS AppPool\ASP.NET v4.0 as account name:

![Giving the ASP.NET account write permissions to the files directory](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/Giving_the_ASP_NET_account_write_permissions_to_the_files_directory.png)
    
  4. Give ASP.NET account write permissions to the *My.config* file.   
Once the blog is up and running the *My.config* file doesn't have to be changed manually any more (for example, in case we want to change the database provider). It can be changed using the dedicated administration page within the blog itself. Therefore the ASP.NET account must have permissions to write to the *My.config* file.

###Step 5: Creating the SQL CE Database
We are now ready to start our blog. The SQL CE database will be created by the blog engine itself after we log in for the first time. Open the blog web site in your web browser. (If you gave the blog the same alias I did, simply click on this link: [http://localhost/funnelwebblog](http://localhost/funnelwebblog).) The following message will appear, giving us the false impression that something went wrong:

![The FunnelWeb database issue at login](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/FunnelWeb_database_issue_at_login.png)

However, everything is fine. At this moment FunnelWeb already created the *App_Data* directory in the background and is just waiting for us to log in using the credentials we specified in the *My.config* file. Enter the credentials and click on the Submit button. The following page will apear showing us that everything went well:

![FunnelWeb Upgrader](https://dl.dropboxusercontent.com/u/110510589/funnelweb-on-sql-ce/FunnelWeb_Upgrader.png)

In the background, our database file – *FunnelWeb.sdf* – is created and stored to the *App_Data* directory. Below the Save and Test button, there is a list of scripts that will be run against the database. Run the scripts by clicking on the upgrade button. After all scripts are ran, the blog will be fully functional and ready to use.

##Last but not Least
As I said at the beginning, FunnelWeb is simple, intuitive and extremely easy to use. From now on you can start exploring its possibilities on your own. But first, just to see if everything is set up well, try uploading some files and creating a blog post.

If this tutorial helped you to start your programming blog, please leave a link to it in a comment below. I'll be glad to visit it.