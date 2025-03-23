# Change Log

Date in ISO format: YYYY-MM-DD

## v0.14.0 (2025-03-23)

- Feat, logger directory can be specified.
- Feat, create log directory if it does not exist.
- Feat, log rollover with old log getting gzip.
- Feat, log rollover interval configuration, multiple of hours.
- Feat, log rollover interval shown in output and log.
- Feat, log dir+filename shown in output and log.
- Deleted experimental log rollover code.

## v0.13.2 (2025-03-22)

- Fix, Improved parameter checking for overloaded function.
- Edit, Added Optional chain check in router code.

## v0.13.1 (2025-03-22)

- Fix, null access violation.

## v0.13.0 (2025-03-22)

- Feat, State management store now saves and read value by their type.
  - Types supported:
    - string
    - number (integers, floats, +/- Infinity, NaN)
    - bigint
    - boolean
    - Date
    - object
    - array
    - null
    - undefined

- Fix, possibly resource leak in Web middleware for gzip and brotli compression streams.
- Refactor, class, file name change for state management store.
- Test, unit test for StoreState to test saving and reading values by their types.

## v0.12.1 (2025-03-20)

- Fix, binding type error for store state.
- Feat, shut down method for StoreState.
- Feat, added call for graceful shutdown of StoreState.
- Added prefix to log messages to identify the source of log message.

## v0.12.0 (2025-03-20)

- BREAKING CHANGE on logger YAML configuration property, renamed "enabled" to "enable".
- Feat, added Etag support which can be enabled, by default it is disabled.
- Feat, added redirect method to ContextApplication class.
- Feat, Sqlite3 in-memory database support for state management.
- Feat, helper methods for state management.
- Test, new unit tests for state management methods.

## v0.11.0 (2025-03-20)

- Improved lookup time for log levels, changed mapping function to map.
  - Speed improvement in logging.
- Fix, typo with import, remoted "npm:" prefix.
- Fix, type error when using the null coalescing operator.
- Fix, HTPP cookie store to return null when not found.
- Fix, check for undefined headers when fetching cookies.
- Feat, handle graceful server error, send error message before closing socket.
- Fix, added missing types to fix TypeScript error.
- Added additional check on response status in router code.
- Added additional check on response status in Web middleware code.
- Added additional check on response status in Cors middleware code.

## v0.10.0 (2025-03-18)

- feat: Application context class, added time out method to deal with async operation.
- Now an asynchronous operation in a middleware will get timedout.
- Updated router to check timeout timer id before closing a response.

## v0.9.0 (2025-03-18)

- Fix, Web middleware not working correctly.
- Feat, Web middleware support compression for Brotli and Gzip.
- Feat, Web middleware correctly check mime-types, and set header for content-type.
- Feat, added async support in router code.
- Refactor, clean up and code block move in router code.

## v0.8.0 (2025-03-17)

- Revised benchmark results, all run with JaaScript code and Node.js v22.14.0.
- Feat, added web page support for the web server with a new middleware.
- Refactor, clean up and code block move in router code.
- This release contains an initial Web middleware to server web pages.

## v0.7.0 (2025-03-16)

- Added HTTPS support to the server.
- Added exception handling when creating Fast Logger to prevent startup crash.
- Support for self-signed SSL certificates for HTTPS {key, cert}.
- Support for self-signed SSL certificates with passphrase for HTTPS {key, cert, passphrase}.
- Support for SSL CA certificate for HTTPS {key, cery, ca}.
- Changed  start up message
  1. "mode" to "env", value are user defined in YAML.
  1. "secute" to "mode", value are "https" or "http".
- Fix, exception hanlding message for FuriRouter::processHTTPMethod.

## v0.6.1 (2025-03-15)

- Removed error file, we should not be defining exception classes.
- Cleaned up test making unnecessary exception test.
- Removed unnecessary assertion method which duplicates isSiteValue logic.
- Fixed Exception messages to contain classname::method prefix.
- Made Cors middleware avaliable off Furi.

## v0.6.0 (2025-03-14)

- Fixed long standing issues with routing and only top level middleware execution.
- Fix, ending reponse prematurely in cors middleware.
- Fix, placement of next call in cors middleware.
  This resolves allowing top level middleware to execute properly, such as CORS middleware.
- New feature, support for HTTP OPTIONS method.
- New feature, support for HTTP HEAD method.
- New feature, graceful shutdown on SIGTERM signals.
- New feature, Functor to execute callback chain with application context.
- Updated Dev Containers with Git, Node, NVM, pnpm.
- New Unit tests for HEAD and OPTIONS.
- New Functional tests for HEAD and OPTIONS.

## v0.5.1 (2025-03-14)

- Fix, correctly set response header and handle preflight check.
- Updated test for CORS middleware.
- Fixed version number for Furi.

## v0.5.0 (2025-03-13)

- New feature, added support for HTTP OPTIONS.
- New feature, initial CORS middleware implementation.
- New feature, CORS middleware unit tests.
- New feature, CORS middleware functional test.
- Unit test code cleanup (@kloodz-mrioux contributor).
- New feature, Support for DevContainers (@kloodz-mrioux contributor).

## v0.4.2 (2025-03-09)

- Fix, export of json body parser middleware.
- Improved body parser middleware design, now supports:
  - `application/json`
  - `text/*`
  - `application/x-www-form-urlencoded`
- Body parses can now be access as: "Furi.BodyParser".
- Body parsers have an optional option, currently `limit` for limiting the size of the body.
- Default limit size for the request body is 250KB.

## v0.4.0 (2025-03-08)

- New feature, Cookie store added Max-Age
- New feature, more Unit test coverage for Cookie Store class.
- Fix, Middleware calling, causing bodyparsed middleware not to function correctly.
- Improved design of calling callback chain.
- Deleted function to call top-level middwares.

## v0.3.0 (2025-03-07)

- New feature, Cookie Store to work with cookies.
- New feature, Signed cookies.
- New feature, Time helper class to use with Cookies
- New feature, new unit test or time helper class.
- New feature, new unit test or Cookie store.
- New feature, new unit test or signed cookies.

## v0.2.9 (2025-03-05)

- Log file mode renamed from "buffered" to "buffer".
- Default log mode changed to "stream".
- Fix file logging and console logging separation.

## v0.2.8 (2025-03-04)

- Terminal logging output is now improved.
- Terminal logging can be enabled and disabled from the YAML config file.

## v0.2.7 (2025-03-04)

- Graceful shut down processing.
- New shut down handler for custom cleanup.
- Shutdown log message changed.

## v0.2.6 (2025-03-02)

- New feature, new function to allow Class based hander to be used with original
  call based handler methods.

## v0.2.4 (2025-03-02)

- Fixed logfile not getting created when using a NPM package.
- Fixed crash when reading YAML property values that was undefined.
- New feature, added runtime and logger info to log and console output.

## v0.2.0 (2025-02-25)

- New feature, specify routes using an array.
- New feature, class based route handler.
- New feature, core logging.
- New feature, fast buffered logger.
- New feature, logger worker thread.
- New feature, logger configuration from YAML file.
- New feature, logger level filtering.
- Graceful shutdown on SIGINT signal.
- Fixed lingering TypeScript typing error.
- Corrected some magic number code.
- Centralized array flattening on calls to build router map.
- Improved function names.
- Improved perform in loop creating path params.
- Refactor, switched from using string array to Buffer.
- Fix, no log file creation when logger is disabled.

## v0.1.4 (2025-02-24)

- Added version info to server startup message.
- Fixed laten bug, flatten array of arrays in router map merge.

## v0.1.0 (2025-02-23)

- Initial preview release of FURI.
- Router coded from the ground up using TypeScript.
  - Router is feature complete.
  - Router Supports:
    - Static routes.
    - Named routes.
    - Regex path matching.
    - Support to write and read request session data.
  - Middleware support is feature complete.
- Ongoing unit tests and functional tests.
- Early State Management for seamless data access.
- Uses a Context Application for unified functionality.
