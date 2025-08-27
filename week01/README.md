## Videos

* Designing for the user: ([video](https://share.descript.com/view/xMB36Pljo2i), ~8min) ([slides](https://docs.google.com/presentation/d/1XoJzoDlC32x64kwSueUPlcn8iT4nBMp_XCCfnQUZhWs/edit?usp=sharing))
* Introduction to HTML: ([video](https://share.descript.com/view/Y8DeQS27PTm), ~31min) ([slides](https://docs.google.com/presentation/d/1V9VtReNTHLSYCwVcq84OpT2LCghTapSXtJ7IGUIL0E0/edit?usp=sharing))
* Introduction to CSS: ([video](https://share.descript.com/view/lu04aNn2QZa), ~1h 10min)
* Web Accessibility: Coming Soon!

## Readings

From [JavaScript.info](https://javascript.info/):
* Part 1, Chapter 1 -- An Introduction
* Part 1, Chapter 2 -- JavaScript Fundamentals
* Part 1, Chapter 3 -- Code quality
  - Please note that **section 3.4** is intended to be ironic; do not be a ninja!
  - **Section 3.5** talks about tests with Mocha. I tend to use [Jest](https://jestjs.io/), but Mocha is also a good choice. Either way, while we won't be writing many tests in this course, it's good background.
  - **Section 3.6** is also good background, but we won't worry much about transpilers in this course.

## References

- Designing for Users
  - [18F User Experience Design Guide](https://guides.18f.gov/ux-guide/)
  - [18F Personas Method Card](https://guides.18f.gov/methods/decide/personas/)
  - [18F Wireframing Method Card](https://guides.18f.gov/methods/make/wireframing/)
  - [18F Prototyping Method Card](https://guides.18f.gov/methods/make/prototyping/)
- Intro to CSS
  - An "inch" in CSS is usually equal to 96 pixels ([Smashing Magazine, _There Is No Such Thing As A CSS Absolute Unit_](https://www.smashingmagazine.com/2021/07/css-absolute-units/))
- Using GitHub with your `git` client
  - If you're using VS Code or GitHub Desktop, you may be able to simply log in to your GitHub Account. However, if you're interested in using the command line `git` command, you may need to set up SSH keys. It's a process, but it's not very hard, and is well-documented at https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys
- Our default linter configurations
  - Review: A linter is a program that you can use to check whether your code conforms to a certain set of style choices. You can often choose which style choices you care about.
  - In the Story Map project (and most code in this class) we will use a slightly modified version of [Google's eslint configuration](https://github.com/google/eslint-config-google) (which defines the JS style choices they adhere to within Google), and a slightly modified version of [the "standard" stylelint configuration](https://stylelint.io/user-guide/rules/).

## Practice

- Join the Slack (with your UPenn email address): https://join.slack.com/t/musa-tools-track/shared_invite/zt-3c714ynv6-K_oQ7jU82hC2LcVCi0NvtA
- Install [Node.js (LTS version)](https://nodejs.org/en/download) if you haven't already
  - Verify installation by running `node -v` and `npm -v` in a terminal
- Install VS Code if you haven't already
  - Install the ESLint and Stylelint extensions
- Set up your story map project
  - Fork the repository
  - Clone the repository
- Choose a data domain for your projects. Slack it to me. Start to find data sources. Slack those to me as well.
- Install the Axe developer tools
- Stub out an about page for your story map, explaining the data domain. Should have:
  - A title, and headers for each section
  - A persona explaining who you're targeting with content
  - No accessibility checker errors