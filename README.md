# bbqapp-backend

This is the backend implementation of the bbqapp.

## Backend Getting Started


* install node v4.1.0
  * via nvm https://github.com/creationix/nvm

* you need mongodb 2.4.X
  * ubuntu

  ```
  sudo apt-get install mongodb
  ```

* install npm packages globally
  ```
  npm install -g grunt-cli  # build tool
  npm install -g mocha      # run tests
  npm install -g swagger    # run swagger editor
  ```

* install project dependencies
  * (sudo) npm install

* Configure Environment variables

```bash
cd ./lib/config/env/env_dev.sh.template
cp env_dev.sh.template env_dev.sh
cp env_dev.sh.template env_test.sh
# adjust files to your needs
```

* Start running tasks

```
grunt  // run server via nodemon, automatic code reload
npm test // run test suite...yes it is npm :)
grunt eslint // run eslint
grunt inspect // debugging
grunt swagger // run swagger editor (save on-the-fly in api/swagger/swagger.yaml)
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
