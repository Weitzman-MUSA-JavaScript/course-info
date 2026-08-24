## Before Class...

### Watch

* Designing for the user: ([video](https://share.descript.com/view/xMB36Pljo2i), ~8min) ([slides](https://docs.google.com/presentation/d/1XoJzoDlC32x64kwSueUPlcn8iT4nBMp_XCCfnQUZhWs/edit?usp=sharing))
* Introduction to HTML: ([video](https://share.descript.com/view/Y8DeQS27PTm), ~31min) ([slides](https://docs.google.com/presentation/d/1V9VtReNTHLSYCwVcq84OpT2LCghTapSXtJ7IGUIL0E0/edit?usp=sharing))
* Introduction to CSS: ([video](https://share.descript.com/view/lu04aNn2QZa), ~1h 10min)
* Web Accessibility: Instead of a custom video, please watch this excellent [Accessible Web Mapping Apps](https://www.youtube.com/watch?v=McXvs3x2-6E) video from the ESRI Developer Summit a few years ago (~1h).

### Read

From [JavaScript.info](https://javascript.info/):
* Part 1, Chapter 1 -- An Introduction
* Part 1, Chapter 2 -- JavaScript Fundamentals
* Part 1, Chapter 3 -- Code quality
  - Please note that **section 3.4** is intended to be ironic; do not be a ninja!
  - **Section 3.5** talks about tests with Mocha. I tend to use [Jest](https://jestjs.io/), but Mocha is also a good choice. Either way, while we won't be writing many tests in this course, it's good background.
  - **Section 3.6** is also good background, but we won't worry much about transpilers in this course.

### Practice
* JavaScript Exercises
  * Fork the repository at https://github.com/Weitzman-MUSA-JavaScript/intro-js-exercises
  * Start the exercises in the [exercises](https://github.com/Weitzman-MUSA-JavaScript/intro-js-exercises/tree/main/exercises) directory. Follow the instructions in the comments to implement the functions and check your work. Try to get through at least part 1.

    > **AI recommendation: DISABLE** -- The exercises in this repository will be absolutely trivial for any AI agent to complete, but that is so far from the point. The goal is for you to start getting comfortable thinking in JavaScript. **I recommend entirely disabling any AI assistance, even auto-complete, while working through these exercises.**

## In class...

### Practice

* **Critiquing Accessibility**
  
  Choose a task on a public-sector site, and evaluate its accessibility for various users. See slides for more information: https://docs.google.com/presentation/d/1cuqEW3qh9q1Z_dyZPrgf0Sd2cGMLAfFFoCXoDgzCsQg/edit

### Review

* **JavaScript Exercises** -- We will review the **FizzBuzz** exercise from the JavaScript [exercises repository](https://github.com/Weitzman-MUSA-JavaScript/intro-js-exercises).

## References

- Designing for Users
  - [18F User Experience Design Guide](https://guides.18f.org/ux-guide/)
  - [18F Personas Method Card](https://guides.18f.org/methods/decide/personas/)
- Intro to CSS
  - An "inch" in CSS is usually equal to 96 pixels ([Smashing Magazine, _There Is No Such Thing As A CSS Absolute Unit_](https://www.smashingmagazine.com/2021/07/css-absolute-units/))
- Using GitHub with your `git` client
  - If you're using VS Code or GitHub Desktop, you may be able to simply log in to your GitHub Account. However, if you're interested in using the command line `git` command, you may need to set up SSH keys. It's a process, but it's not very hard, and is well-documented at https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys
- Our default linter configurations
  - Review: A linter is a program that you can use to check whether your code conforms to a certain set of style choices. You can often choose which style choices you care about.
  - In the Story Map project (and most code in this class) we will use a slightly modified version of [Google's eslint configuration](https://github.com/google/eslint-config-google) (which defines the JS style choices they adhere to within Google), and a slightly modified version of [the "standard" stylelint configuration](https://stylelint.io/user-guide/rules/).
