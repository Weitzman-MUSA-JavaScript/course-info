**Welcome to _JavaScript Programming for Planners & Designers_!**

# Syllabus

* **Course**: CPLN-6920/MUSA-6110, University of Pennsylvania
* **Location**: McNeil Building 286-7
* **Schedule**: 1:45-4:45PM, Wednesdays
* **Instructor**:
  * Mjumbe Poe, mjumbe@design.upenn.edu
* **Office Hours**:
  - Coworking in person ([check schedule here](https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&showCalendars=0&mode=WEEK&src=ZDRjNTI3NDhhNWIzMTFhZGM2NTdhZjVmZjEyYTIxNmY1MjkxNWFkMmFiMjYxYzM5YWNlZjlkMTRiMWI5MWIzNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F09300))
    _Usually in Van Pelt RDDSx Wednesdays, 10:00-1:00, but there are exceptions; check the calendar_
  - Virtually, by appointment ([book here](https://calendly.com/mjumbe-upenn/community))
* **Need help?**
  * [Slack](https://musa-tools-track.slack.com/)


## Course Overview

Dashboards, maps, and other interfaces that enable the display, analysis, and in some cases generation of new geospatial data, are often the _end product_ of a data analysis or modeling process. In this course we'll focus on the _interface_ and _interaction_ aspects of creating these products. Ultimately, the goal is for you to become conscientious builders of civic technology, able to craft data-backed interfaces that inform, empower, and engage the public.

You will learn to design and build accessible interfaces to help **users** access the value promised by geospatial data, modeling, and analysis. As this is a JavaScript course, we'll be doing _a lot_ of programming in JavaScript. Because of the nature of interactive interfaces with JavaScript, we'll also be doing a lot of work with HTML and CSS.

This course is the first part of a track in MUSA in which you will learn to build data products. In the second course (_Geospatial Cloud Computing & Visualization_) we'll focus on the _data pipeline_ aspects of building these products. The courses are best together, but they can each also stand alone.

## Objectives

By the end of this course, you should be able to:

* Apply user-centered design principles and accessibility standards to create intuitive, public-facing data interfaces.
* Demonstrate familiarity and comfort with the JavaScript language, alongside essential HTML and CSS.
* Understand the structure of client-side web applications, including how browsers load resources and respond to user interactions.
* Employ industry-standard "tools of the trade," including code editors, Git/GitHub, linting, testing, and the responsible use of AI as a learning and debugging tool.
* Use mapping, visualization, and analysis libraries such as [Leaflet](https://leafletjs.com/index.html), [D3](https://d3js.org/), [ApexCharts](https://apexcharts.com/), and [Turf.js](https://turfjs.org/).
* Access and manipulate data in a variety of formats directly in the browser, particularly [GeoJSON](https://geojson.org/), [CSV](https://en.wikipedia.org/wiki/Comma-separated_values), and [Mapbox Vector Tiles](https://docs.mapbox.com/vector-tiles/reference/).
* Access web services and APIs, such as [Mapbox](https://docs.mapbox.com/api/maps/) and [Nominatim](https://nominatim.org/), to extend application functionality.
* Confidently read, interpret, and apply technical documentation for JavaScript libraries and APIs.

## Course Outline

Throughout this 14-week course, you will learn to program applications using HTML, CSS, and JavaScript. In addition to programming skills, we will emphasize the "tools of the trade": you will use a text editor designed for programming, manage your code with Git, and submit your assignments using "Pull Requests" through GitHub. You will be operating with the same tools used by software developers in the industry.

I like to keep the course somewhat freeform. While there are foundational skills we must cover, your personal interests will help shape the direction of the class, especially in the final weeks. The course will follow flipped-classroom mechanics -- you will be expected to read and watch videos before we meet, allowing us to spend class time on discussions, live code demonstrations, or actively working on exercises and projects.

This syllabus is a living document. As the course progresses, greater detail will be added to reflect the content of each week.

### Exercises

* You will have short exercises to complete for almost every class, particularly during the first half of the semester.
* While these exercises are not graded, you are accountable for the skills practiced within them. We will not cover all of these skills comprehensively during class time, so completing them promptly is critical to your success in the course.
* Solutions for [earlier exercises](https://github.com/Weitzman-MUSA-JavaScript/intro-js-exercises) will be checked automatically, allowing you to tweak your code until it passes.
* Solutions for [later exercises](https://github.com/Weitzman-MUSA-JavaScript/data-in-js-exercises) are more subjective and will not have automated checks. For many of these, I have included a sample solution in the [**solutions**](https://github.com/Weitzman-MUSA-JavaScript/data-in-js-exercises/tree/solutions) branch of the repository. We will review and discuss select solutions together in class.

### Projects

Your core portfolio for this class will consist of three individual projects. To help you build expertise and depth, I highly encourage you to use the same domain of data for all three assignments, allowing your work to compound over the semester. Your chosen dataset should relate to urban or environmental spatial analytics -- this can cover a broad range of social, infrastructural, political, economic, or environmental concerns, so long as it connects back to cities and/or nature.

While each project has a suggested structure, I am very open to self-directed proposals that align with your interests, provided they utilize the tools we are learning. Together, these projects represent three critical classes of interface responsibilities that conscientious builders of civic technology must master:

1.  **Telling a Narrative** ([starter repo](https://github.com/Weitzman-MUSA-JavaScript/story-map-project)) -- Interfaces that communicate a narrative. You will choose a dataset and create an interactive experience that guides users through the insights and patterns within the data. You will present this narrative accessibly using maps, text, and multimedia. _The focus of this project is storytelling with data._

    > *Note:* Because you will just be getting started with HTML, CSS, JavaScript, and working with data in the browser, I will provide a couple of starter templates (such as a scrolly-telling layout or a click-through story map). At a minimum, you can focus simply on integrating GeoJSON datasets into one of these templates. However, if you want to stretch out of your comfort zone and make further modifications to the provided templates -- or use other templates you find elsewhere -- I will fully support you in doing so.

    _**Weeks 1-4** will be spent working on this project._

2.  **Supporting Decisions** ([starter repo](https://github.com/Weitzman-MUSA-JavaScript/dashboard-project)) -- Interfaces that support decision-making. You will use data to build visualizations and analyses that help users make informed choices. While dashboards are a common tool for this (and we will discuss them in class), a dashboard is not the only way to provide data for making decisions. You are encouraged to build whatever type of interactive tool best fits your use case, provided the focus remains on ensuring the right information is presented to the user in the right time and context. _The focus of this project is actionable data delivery._

    _**Weeks 5-8** will be spent working on this project._

3.  **Inviting Participation** ([starter repo](https://github.com/Weitzman-MUSA-JavaScript/engagement-project)) -- Interfaces that enable participation and collaboration. Your final project will focus on engaging the public around data. Building upon the concepts learned throughout the class, you will incorporate a significant amount of interactivity to invite members of the public to create, manipulate, or add to a dataset in some way. 

    Final projects may be done in groups or independently. Criteria for success will be hammered out in a final project proposal. Group projects will be expected to engage with a wider scope and greater difficulty. _The focus of this project is public engagement and data generation._

    _**Weeks 9-14** will be spent working on this project._

## Work Evaluation & Feedback

My primary target for this course is to help each of you learn how to create data-backed interfaces that inform, empower, and engage people in the real world. I want you all to become conscientious builders of civic technology. I believe the best way to achieve this is through practice, which is why the course is centered around the three interface responsibilities outlined above.

Part of my job, however, is to evaluate your work and assign a grade. In data analysis, there is a concept called Goodhart's Law (which we will discuss when we get to dashboards) that states: *when a measure becomes a target, it ceases to be a good measure.* 

Your grade is, ostensibly, a measure of the quality of your work. Getting you to a good grade is not my target. In fact, your grade is a second-order measure. The quality of your work is itself merely a measure of whether you are learning and able to put into practice the things I want you to learn.

As such, while I will provide a default set of grading criteria in this syllabus so that I am not grading you simply on "vibes," I do not deeply care about the grade itself. If there is a different way you want to measure your learning and practice, come talk to me. I am happy to offer flexibility for those who want to do something specific, as long as it hits the core competencies I think are important. Like any well-chosen defaults, the grading criteria can be overridden when it makes sense to do so.

Beyond (and, in my opinion, more important than) a grade, more thorough, practical evaluation of and feedback on your work will come in the form of:
1. **Code reviews** -- You will submit pull requests (PRs) via GitHub, which the course instructors will review to leave direct feedback and suggestions on your code.
2. **Linters** -- You will learn to read the automated output from linters and accessibility checkers, using them to debug and improve your work before submission.
3. **Real-time Discussions** -- Some of the most valuable feedback happens before you write a single line of code. You are highly encouraged to use class time, coworking hours, or scheduled appointments with me to talk through your logic, ask questions, and get immediate feedback on your ideas, wireframes, and code in progress.

## Software

* **Code Editors**
  * [Visual Studio Code](https://code.visualstudio.com/)
  * [Sublime Text](https://www.sublimetext.com/)
* **Terminals**
  * [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/install)
  * Mac and Linux each come with a full-featured terminal already installed
* **Git Clients**
  * [GitHub Desktop](https://desktop.github.com/)
  * Visual Studio Code Git extensions (built-in, though you may have to [install `git` first](https://github.com/git-guides/install-git); VS Code should walk you through the installation)
  * [Sublime Merge](https://www.sublimemerge.com/)
* **Web Browsers (for Developer Tools)**
  * Google Chrome, Mozilla Firefox, or Microsoft Edge
* **Node.js**
  * [Node.js](https://nodejs.org/en/download/)
* **AI Coding Assistants (Optional but Recommended)**
  * Tools like ChatGPT, Claude, or GitHub Copilot (to be used responsibly for exploring repositories, debugging, and cementing concepts as we will discuss in class)
  * I encourage you to use these [agent skills](https://github.com/Weitzman-MUSA-JavaScript/student-agent-skills) when using an AI coding assistant or other LLM tool

## Supplementary Resources

* [Mozilla Developer Network (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - A **highly authoritative** body of documentation on JavaScript and many other web development topics.
* [Introduction to Web Mapping](https://bgu-geography.com/web-mapping/) - A web-based textbook specifically for JavaScript-based mapping. A good portion of this class will overlap with the material in this book.
* [Javascript.info](https://javascript.info/) - An excellent linear reference -- like a textbook for JavaScript.
* [Just JavaScript](https://justjavascript.com/) - A distilled mental model of how JavaScript works -- a way of thinking about JS that is intended to shift your understanding of the language. It's not free, but it's good.
* [Fundamentals of HTML, SVG, CSS and JavaScript for Data Visualisation](https://leanpub.com/html-svg-css-js-for-data-visualisation/) - An ideal foundation if you are looking for a straight-to-the-point guide to the languages driving web-based data visualization.
* [D3 in Depth: Geographic](https://www.d3indepth.com/geographic/) - A detailed look at D3's approach to rendering geographic information.
* [The A11Y Project](https://www.a11yproject.com/) - A community-driven effort to make web accessibility easier, which will be essential as you build intuitive interfaces.
* [18F Guide on Accessibility](https://guides.18f.org/accessibility/) - From a collection of best practices and guides for building digital services, including web development and accessibility (archived from 18f.gsa.gov).
* [FreeCodeCamp](https://www.freecodecamp.org/learn/) - Lots of exercises; courses in "Responsive Web Design", "Basic JavaScript", "ES6", and "Data Visualization" would be particularly useful for this class.
* [Eloquent Javascript](http://eloquentjavascript.net/) - This is a free book with some _advanced_ content. As you think about the application you might like to build for your final, the chapters on HTML forms, drawing with JavaScript, building a game, and constructing your own painting application will push you further than we can in class.
* [Map-based Web Application Examples](resources/webmap-examples.md)

There will be additional resources on topics covered in the class in the _[resources/](resources/)_ folder.

### Schedule

> Subject to change as necessary!

| Week | Date | Topic(s) | Learning Objective(s) (Students should be able to...) |
| :--: | :--: | :-- | :-- |
| **1** | **26&nbsp;Aug** | Getting started<br>Responsible use of AI coding assistants<br>**_Project Introduction: Telling a Narrative_** | <li> Know my name and what I do<br><li> Describe what JavaScript is good for in planning and data<br><li> Establish a responsible, documented workflow for using AI tools<br><li> Identify a potential dataset and overarching narrative for the first project |
| **2** | **02&nbsp;Sep** | Designing for the User<br>Intro to Web Tech (HTML/CSS)<br>Intro to Web Accessibility (A11y) | <li> Describe the right questions to ask when starting a product<br><li> Put together an HTML page structure with simple semantic tags<br><li> Evaluate the accessibility of existing civic tech platforms using personas, developer tools, and WCAG criteria<br><li> Identify when to use which CSS units |
| **3** | **09&nbsp;Sep** | Using JavaScript on the Web<br>Intro to Web Maps<br>The GeoJSON Data Format | <li> Create a script file to link to an HTML page<br><li> Explain what a library, framework, and CDN are<br><li> Import Leaflet for use and add a map to a page<br><li> Explain the relationship between JSON and GeoJSON |
| **4** | **16&nbsp;Sep** | The Box Model<br>Flexbox and Grid Layouts<br>Debugging layouts & specificity<br>Asynchronous Behavior #1 (Events)<br>JS Style & Linting | <li> Explain an element's padding, margin, border, and width/height<br><li> Create linear layouts with flexbox and tabular layouts with grid<br><li> Use browser developer tools to inspect layouts and CSS specificity<br><li> Use `addEventListener` to trigger JS on map and layer objects<br><li> Use tools in VS Code to auto-format code and identify issues |
| **5** | **23&nbsp;Sep** | Working with Data in JS (filtering, sorting, mapping, Turf.js)<br>Charting libraries<br>Organizing JavaScript Using Modules<br>**_Project Introduction: Supporting Decisions_** | <li> Use filter, map, and reduce functions to manipulate data<br><li> Generate GeoJSON structures and chart configurations from other data formats<br><li> Use import and export statements to organize code into modules<br><li> Discuss the strengths, weaknesses, and alternatives to dashboards |
| **6** | **30&nbsp;Sep** | DOM Manipulation<br>Asynchronous behavior #2 (Requests, Timers) | <li> Query, insert, and remove elements in the DOM<br><li> Format a request URL with query string parameters<br><li> Use GET and POST requests<br><li> Explain the Promise vs async/await syntax of fetch |
| **7** | **07&nbsp;Oct** | Map Tiles | <li> Render vector vs raster images (SVG vs Canvas) |
| **8** | **14&nbsp;Oct** | Browser APIs (Geolocation)<br>3rd-party APIs (Routing, Geocoding) | <li> Access and utilize user geolocation data in the browser<br><li> Integrate external APIs for routing and address translation |
| **9** | **21&nbsp;Oct** | **_Project Introduction: Inviting Participation_**<br>Browser-based data persistence (in-memory, session, and local storage) | <li>Case Study: Bikeshare Station Suggestion Tool</li> |
| **10** | **28&nbsp;Oct** | Back-end as a Service (Firebase, Supabase)<br>Remote data persistence (Firestore) | <li> Set up and utilize a BaaS backend to persist and sync user-generated data |
| **11** | **04&nbsp;Nov** | Reactive JavaScript patterns | <li> Implement state management and reactive data binding |
| **12** | **11&nbsp;Nov** | Front-end build tools | <li> Utilize build tools (e.g., Vite) to prepare a client-side application for production |
| **13** | **18&nbsp;Nov** | GIS Day @ Van Pelt, RDDSx |  |
|        | ~~25&nbsp;Nov~~ | (No class - Thanksgiving Break / Friday Schedule) |  |
| **14** | **02&nbsp;Dec** | Project presentations |  |

<!-- Hidden instructor notes omitted for brevity, but you can keep them in your raw file! -->

## Academic Integrity

In compliance with Penn's [Code of Academic Integrity](http://www.upenn.edu/academicintegrity/ai_codeofacademicintegrity.html), blatantly and egregiously copying another student's work will not be tolerated. However, because this course is designed to help prepare students for work in professional programming environments, *copying and pasting is not universally prohibited*: we encourage students to work together and to freely use the internet as a resource for finding solutions to vexing problems. Citing every copied and pasted line of code is *not* necessary. Large patterns or multiple lines of code taken from external sources *should*, however, be noted with in-code comments. If an instance is unclear, you should feel free to speak with the instructors.

### Note about AI tools...

I actually *want* you to use AI tools (like ChatGPT, Claude, or GitHub Copilot) in this class. You should use them to explore repositories, ask how to make modifications to code, and act as a personalized tutor to go deeper on concepts we discuss in class. 

However, you must use a **responsible process**. This course is about learning to program and design interfaces, not just learning how to prompt an agent. When you use AI to help write code, you must:
1. Make frequent Git commits so your progress is clear.
2. Document your LLM context (either via code comments or PR descriptions). 
3. **Deeply understand the code you are submitting.** 

Understand that these tools often make mistakes that can be difficult to identify if you don't know what you're doing. If you come to me or any other instructor to help debug something generated with AI, you must disclose the source of the code (we can usually tell anyway). The expectation is that you can explain *why* the code was written the way it was, not just that an AI generated it for you.