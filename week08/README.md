## In lieu of class...

### Watch

* **The various ways we can load modules**, _Coming Soon!_
  * Using `<script src="..."></script>` in an HTML file -- Ideal for older libraries that don't use the ES module syntax
  * Using `<script src="..." type="module"></script>` in an HTML file -- Ideal for our code that uses ES module syntax
  * Using `import * from 'https://...';` in a JS module -- Ideal when:
    * We're loading newer libraries that do use ES module syntax, and are hosted on a CDN
    * We're writing a quick script and still working out the dependencies
  * Using `<script type="importmap">...</script>` and `import * from '...';` -- Ideal when:
    * We're loading newer libraries that do use ES module syntax, and are hosted on a CDN
    * We've worked out what our dependencies should be
  * Using `npm install ...` and `import * from '...';` -- Ideal when we're using a build system, like vite

* **Data Persistence, part 1** (~2 hours), <https://share.descript.com/view/oA8oUgUOnfN>
  * 00:00 - Introduction to Client-Side Data Persistence
  * 03:32 - Why Store Data on the Client?
  * 07:03 - Three Tools for Browser State Storage
  * 07:58 - Storing State in the URL
  * 09:38 - The Location API & URLSearchParams
  * 15:40 - The History API
  * 21:12 - Live Code: URL State in the Bike Share App
  * 37:19 - Cookies
  * 39:52 - Web Storage API
  * 01:03:48 - Live Code: Bike Filter Preferences with localStorage
  * 01:24:28 - Live Code: Station Favoriting with localStorage

## References

* _Cookies vs Local Storage in JavaScript_ - <https://dev.to/diwakarkashyap/cookies-vs-local-storage-in-javascript-3m0h>
* Bikeshare app [local storage branch](https://github.com/mjumbewu/dashboard-project/tree/local-storage-end)
