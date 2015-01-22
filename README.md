# Exports chat

### Website
https://exports-chat.herokuapp.com/home

### Install

The base of this app is [Yeoman Angular FullStack Generator](https://github.com/DaftMonk/generator-angular-fullstack)

Install the generator:

```bash
npm install -g generator-angular-fullstack
```

### Start developing

In the project root type in the terminal:

```
mongod  #to get the a mongoDB instance running
grunt serve

grunt serve:dist  # serve the distribution files
```

this gets a live-reload server  & mongo working


### Adding new components

Use the Yemoan generator to add new components, such as a new `service`, `controller`, `route`, or server-`endpoint`, etc.

Example:

```
yo angular-fullstack:route myroute
[?] Where would you like to create this route? client/app/
[?] What will the url of your route be? /myroute
```

Produces:

```
client/app/myroute/myroute.js
client/app/myroute/myroute.controller.js
client/app/myroute/myroute.controller.spec.js
client/app/myroute/myroute.html
client/app/myroute/myroute.scss
```

### Where to push changes

- Commit to Github for **Development** changes
- Commit to Heroku for **Distribution** changes.


#### Pushing to heroku

```bash
grunt
grunt buildcontrol:heroku
```
