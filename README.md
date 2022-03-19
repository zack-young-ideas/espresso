# Basic Blog

This is a basic blog application that I created using Express. It is
still a work in progress.

Before running the Web application, run the following command to
initialize a configuration file:

`./bin/index.js init`

The default configuration file is called config/development.js. It
defines the secret key that is used to sign session cookies and the
pepper used when hashing user passwords.

Once the configuration is established, the following command can be
used to launch a local Web server hosting the application:

`./bin/index.js run`

WARNING: This application is not secure enough to use in production.
Again, it is still a work in progress. Furthermore, the secret key and
secret pepper values must be kept hidden at all costs.
