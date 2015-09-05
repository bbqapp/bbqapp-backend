# bbqapp-backend

This is the backend implementation of the bbqapp.

## Backend Getting Started


* install node v0.12.XX
  * via nvm https://github.com/creationix/nvm

* you need mongodb 2.4.X
  * ubuntu

  ```
  sudo apt-get install mongodb
  ```

* install npm packages globally
  ```
  (sudo) npm install -g grunt-cli  # build tool
  (sudo) npm install -g mocha      # run tests
  ```

* install project dependencies
  * (sudo) npm install
  * now you are done and can start calling the grunt tasks:

```
grunt  // run server via nodemon, automatic code reload
grunt test // run test suite
grunt eslint // run eslint
grunt inspect // debugging
```

## Docker

First install docker on your machine.

Docker image can be build with:

```bash
sudo docker build -t bbqapp/backend
```

Run the docker image. Currently mongodb runs on same host (localhost):

```bash
sudo docker run --rm -p 3000:3000 --net=host --name bbqapp bbqapp/backend
```

## License

bbqapp-backend is release under the [MIT Licence](http://opensource.org/licenses/MIT)
