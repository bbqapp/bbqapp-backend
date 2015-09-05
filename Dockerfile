FROM node:0.12.7-wheezy

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install --production

WORKDIR /src

EXPOSE  3000
CMD ["bin/www"]
