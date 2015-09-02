# hello-nodejs

Prototype of a "grillapp".
<br/>
The application is separated in frontend and backend.

## Backend Getting Started


* install node v0.10.XX
  * via nvm https://github.com/creationix/nvm

* you need mongodb 2.4.X
  * ubuntu

```
sudo apt-get install mongodb
```

* install npm packages globally (npm install -g <packagename>)
  * grunt-cli (the build tool)
  * mocha  (running tests)
  * node-inspector (debugging)


* change to backend/myapp/ and install project dependencies
  * (sudo) npm install
  * now you are done and can start calling the grunt tasks:

```
grunt  // run server via nodemon, automatic code reload
grunt test // run test suite
grunt eslint // run eslint
grunt inspect // debugging
```

## Frontend

Prototype
