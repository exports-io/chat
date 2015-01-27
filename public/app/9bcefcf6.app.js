"use strict";angular.module("chatApp",["ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","ui.bootstrap","luegg.directives"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){b.when("/","/messages/general"),b.otherwise("/messages/general"),b.rule(function(a,b){var c=b.path(),d=c.toLowerCase();return c!==d?d:void 0}),c.html5Mode(!0),d.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status?(d.path("/login"),c.remove("token"),b.reject(a)):b.reject(a)}}}]).run(["$rootScope","$location","Auth","socket",function(a,b,c,d){a.connectedUsers=[],a.$on("$stateChangeStart",function(a,d){c.isLoggedInAsync(function(a){d.authenticate&&!a&&b.path("/login")})}),d.socket.emit("userConnected",c.getCurrentUser()),d.socket.on("newUserConnected",function(b){a.connectedUsers.push(b)}),d.socket.on("userDisconnected",function(){a.connectedUsers.pop()})}]),angular.module("chatApp").config(["$stateProvider",function(a){a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}]),angular.module("chatApp").controller("LoginCtrl",["$scope","Auth","$location","$state",function(a,b,c,d){a.user={email:"p@ex.io",password:"pass"},a.errors={},a.login=function(c){a.submitted=!0,c.$valid&&b.login({email:a.user.email,password:a.user.password}).then(function(){d.go("index"),d.go("index.channel",{channel:"general"})})["catch"](function(b){a.errors.other=b.message})}}]),angular.module("chatApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){a.errors={},a.changePassword=function(b){a.submitted=!0,b.$valid&&c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){a.message="Password successfully changed."})["catch"](function(){b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""})}}]),angular.module("chatApp").controller("SignupCtrl",["$scope","Auth","$location",function(a,b,c){a.user={},a.errors={},a.register=function(d){a.submitted=!0,d.$valid&&b.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){b=b.data,a.errors={},angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})})}}]),angular.module("chatApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("chatApp").config(["$stateProvider",function(a){a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("chatApp").controller("ChannelContentCtrl",["$scope","$rootScope","$http","$state","$timeout","$stateParams","socket",function(a,b,c,d,e,f,g){a.inputText="",a.messages=[],a.scrollDown=!0,a.isTyping=!1,a.channelName=f.channel,c.get("/api/channels/"+a.channelName).then(function(b){a.thisChannel=b.data[0]},function(a){console.log(a)}),g.socket.emit("join",{channel:a.channelName}),c.get("/api/chats/"+a.channelName).success(function(b){a.messages=b,g.syncUpdates("chat",a.messages)}),a.sendMessage=function(){if(""!==a.inputText){var b={user:a.currentUser.name,text:a.inputText,channel:a.channelName,type:"message",ts:moment().valueOf()};c.post("/api/chats",b),a.inputText="",a.scrollDown=!0}};var h=null;a.setTyping=function(){console.log("is typing");var b={user:a.currentUser,channel:a.channelName};g.socket.emit("startTyping",b)},g.socket.on("isTyping",function(b){a.isTyping=!0,a.userTyping=b.user,h&&e.cancel(h),h=e(function(){a.isTyping=!1},4e3)}),a.$on("$destroy",function(){g.socket.emit("leave",{channel:a.channelName}),g.unsyncUpdates("chat")})}]).directive("enterSubmit",function(){return{restrict:"A",link:function(a,b,c){b.bind("keydown",function(b){var d=b.keyCode||b.which;13===d&&(b.shiftKey||(b.preventDefault(),a.$apply(c.enterSubmit)))})}}}),angular.module("chatApp").config(["$stateProvider",function(a){a.state("index.channel",{url:"messages/{channel:[^@]*}",views:{"content@index":{templateUrl:"app/channel/channel-content.html",controller:"ChannelContentCtrl"}}})}]),angular.module("chatApp").controller("IMContentCtrl",["$scope","$rootScope","$http","$state","$timeout","$stateParams","socket","IMStore",function(a,b,c,d,e,f,g){a.inputText="",a.messages=[],a.scrollDown=!0,a.isTyping=!1,a.imName=f.im,c.get("/api/user/"+a.imName).then(function(){},function(){}),c.get("/api/im/"+a.imName).then(function(b){a.thisIM=b.data[0]},function(){}),g.socket.emit("join",{channel:a.channelName}),c.get("/api/chats/"+a.channelName).success(function(b){a.messages=b,g.syncUpdates("chat",a.messages)}),a.sendMessage=function(){if(""!==a.inputText){var b={user:a.currentUser.name,text:a.inputText,channel:a.channelName,type:"message",ts:moment().valueOf()},d={user:a.currentUser,channel:a.channelName};g.socket.emit("stopTyping",d),c.post("/api/chats",b),a.inputText="",a.scrollDown=!0}};var h=null;a.setTyping=function(){var b={user:a.currentUser,channel:a.channelName};g.socket.emit("startTyping",b),h&&e.cancel(h),h=e(function(){g.socket.emit("stopTyping",b)},4e3)},g.socket.on("isTyping",function(b){a.isTyping=!0,a.userTyping=b.user,console.log(b)}),g.socket.on("isNotTyping",function(){a.isTyping=!1}),a.$on("$destroy",function(){g.socket.emit("leave",{channel:a.channelName}),g.unsyncUpdates("chat")})}]),angular.module("chatApp").config(["$stateProvider",function(a){a.state("index.im",{url:"messages/@{im}",views:{"content@index":{templateUrl:"app/im/im-content.html",controller:"IMContentCtrl"}}})}]),angular.module("chatApp").directive("textInput",function(){return{restrict:"E",scope:{value:"=ngModel",change:"=",ngEnter:"&",isTyping:"="},require:"ngModel",template:'<div class="textfield-footer"><textarea class="input-textarea" ng-model="value" ng-change="change"></textarea><span class="isTyping" ng-if="isTyping"><span class="isType-name">{{userTyping.name}}</span> is typing ...</span></div>',link:function(a,b){var c=160,d={del:8,ret:13},e=angular.element(b[0].querySelector("textarea.input-textarea")),f=angular.element(document.querySelector("div.content-wrapper"));e.originalHeight=e[0].offsetHeight,f.originalHeight=f[0].offsetHeight,b.bind("keydown",function(b){e[0].offsetHeight>=c?e.css("overflow-y","visible"):b.which===d.ret&&b.shiftKey?e[0].offsetHeight<c&&(e.css("height",function(){return e[0].offsetHeight+19}),f.css("height",function(){return f[0].offsetHeight-19})):b.which===d.ret&&(a.$apply(function(){a.ngEnter()}),e.css("height",function(){return e.originalHeight}),f.css("height",function(){return f.originalHeight}),b.preventDefault())})}}}),angular.module("chatApp").controller("SidebarCtrl",["$scope","$rootScope","$http","$state","$stateParams","$modal","$timeout","socket","Auth","ChannelStore","IMStore","UserStore",function(a,b,c,d,e,f,g,h,i,j,k){a.drawerOpen=!1,b.currentUser=a.currentUser=i.getCurrentUser(),c.get("/api/users/").success(function(b){a.users=b,console.log(b)}),c.get("/api/channels/").success(function(b){a.channels=b,h.syncUpdates("channel",a.channels)}),a.switchChannel=function(b){j.save(b),d.go("index.channel",{channel:b.name}),a.activeChannel=b.name,a.activeChatName=b.name,a.activeChatIcon="#",a.activeChatOnline=""},a.switchIM=function(b){k.save(b),d.transitionTo("index.im",{im:b.username},{reload:!1}),a.activeChatName=b.username,a.activeChatIcon="@",a.activeChatOnline=""},a.openDrawer=function(){a.drawerOpen=a.drawerOpen?!1:!0},a.logout=function(){i.logout(),d.go("login")},a.createNewChannel=function(){a.modalInstance=f.open({templateUrl:"myModalContent.html",controller:"ModalInstanceCtrl",size:"medium",scope:a,resolve:{items:function(){return a.items}}}),a.modalInstance.result.then(function(a){c.post("/api/channels",a).then(function(){},function(){})},function(){console.info("Modal dismissed at: "+new Date)})}}]).controller("ModalInstanceCtrl",["$scope","$rootScope",function(a,b){a.newChannel={name:"",purpose:{value:""},creator:b.currentUser._id,is_archived:!1,is_general:!1,is_member:!0,created:new Date},a.ok=function(){a.modalInstance.close(a.newChannel)},a.cancel=function(){a.modalInstance.dismiss("cancel")}}]).factory("ChannelStore",function(){var a=this,b={};return b.save=function(b){a.channel=b},b.get=function(){return a.channel},b}).factory("UserStore",function(){var a=this,b={};return b.save=function(b){a.channel=b},b.get=function(){return a.channel},b}).factory("IMStore",function(){var a=this,b={};return b.save=function(b){a.channel=b},b.get=function(){return a.channel},b}),angular.module("chatApp").config(["$stateProvider",function(a){a.state("index",{url:"/",views:{"":{templateUrl:"app/sidebar/sidebar.html",controller:"SidebarCtrl"}}})}]),angular.module("chatApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g={};return e.get("token")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=f.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return e.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}]),angular.module("chatApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}]),angular.module("chatApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("chatApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("chatApp").controller("NavbarCtrl",["$scope","$location","Auth",function(a,b,c){a.menu=[{title:"Home",link:"/"}],a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.logout=function(){c.logout(),b.path("/login")},a.isActive=function(a){return a===b.path()}}]),angular.module("chatApp").factory("socket",["socketFactory",function(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b});return{socket:c,syncUpdates:function(a,b,d){d=d||angular.noop,c.on(a+":save",function(a){var c=_.find(b,{_id:a._id}),e=b.indexOf(c),f="created";c?(b.splice(e,1,a),f="updated"):b.push(a),d(f,a,b)}),c.on(a+":remove",function(a){var c="deleted";_.remove(b,{_id:a._id}),d(c,a,b)})},unsyncUpdates:function(a){c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}]).factory("ChatSocket",["socketFactory",function(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b}),d=[],e=[],f=function(a,b,c){this.array=b,this.cb=c,this.modelName=a,this.join=angular.bind(this,this.join),this.leave=angular.bind(this,this.leave),this.save=angular.bind(this,this.save),this.remove=angular.bind(this,this.remove)};return f.prototype={sync:function(){return c.on(this.modelName+":save",this.save),c.on(this.modelName+":remove",this.remove),c.on("reconnect",this.join),this.join()},unsync:function(){return c.removeListener(this.modelName+":save",this.save),c.removeListener(this.modelName+":remove",this.remove),c.removeListener("reconnect",this.join),this.leave()},join:function(){return c.emit("join",this.modelName),this},leave:function(){return c.emit("leave",this.modelName),this},save:function(a){var b=this.array,c=_.find(b,{_id:a._id}),d=b.indexOf(c),e="created";c?(b.splice(d,1,a),e="updated"):b.push(a),this.cb(e,a,b)},remove:function(a){var b=this.array,c="deleted";_.remove(b,{_id:a._id}),this.cb(c,a,b)}},{socket:c,syncUpdates:function(a,b,c){c=c||angular.noop,d.push(b),e.push(new f(a,b,c).sync())},unsyncUpdates:function(a){var b=d.indexOf(a);b>=0&&(d.splice(b,1),e.splice(b,1)[0].unsync())}}}]),angular.module("chatApp").run(["$templateCache",function(a){a.put("app/account/login/login.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p><p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email value=p@ex.io required></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required></div><div class="form-group has-error"><p class=help-block ng-show="form.email.$error.required && form.password.$error.required && submitted">Please enter your email and password.</p><p class=help-block ng-show="form.email.$error.email && submitted">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Login</button> <a class="btn btn-default btn-lg btn-register" href=/signup>Register</a></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show="form.name.$error.required && submitted">A name is required</p></div><div class=form-group ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show="form.email.$error.email && submitted">Doesn\'t look like a valid email.</p><p class=help-block ng-show="form.email.$error.required && submitted">What\'s your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Sign up</button> <a class="btn btn-default btn-lg btn-register" href=/login>Login</a></div></form></div></div><hr></div>'),a.put("app/admin/admin.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/channel/channel-content.html",'<div class="row header"><div class=col-xs-12><div class=meta><div class=page-title><span>#</span>{{channelName}}</div></div></div></div><div class=content-wrapper scroll-glue=scrollDown ng-class="{\'drawer-open\': drawerOpen}"><div class=row><div class=col-xs-12><div class=channel-header><h4># {{channelName}}</h4><p>This is the very beginning of the <em>#{{thisChannel.name}}</em> channel, which you created {{thisChannel.created | date:\'shortDate\'}}</p><hr></div><div class=message-container><div class=message-group ng-repeat="msg in messages" ng-class="{\'show-user\' : msg.user != messages[$index -1].user || (msg.ts - messages[$index - 1].ts) >= 300000}"><div ng-if="msg.user != messages[$index -1].user || (msg.ts - messages[$index - 1].ts)  >= 300000 "><img class=message-avatar src=http://www.desa-net.com/exports_io/U037BREDX_32.jpg alt=""> <a class=message-sender>{{msg.user}}</a> <span class=message-ts>{{msg.ts | date:\'shortTime\'}}</span></div><div class=message-content><span class=message-ts-hover>{{msg.ts | date: \'h:mm\'}}</span> <span class=message-text>{{msg.text}}</span></div></div></div></div></div></div><!--\n<text-input ng-model="inputText"\n            ng-enter="sendMessage(inputText)"\n            change="setTyping()"\n            isTyping="isTyping">\n</text-input>\n--><div class=textfield-footer><textarea class=input-textarea ng-model=inputText ng-change=setTyping() enter-submit=sendMessage(inputText) ng-class="{\'input-drawer-open\': drawerOpen}"></textarea><span class=isTyping ng-if=isTyping><span class=isType-name>{{userTyping.name}}</span> is typing ...</span></div>'),a.put("app/im/im-content.html",'<div class="row header"><div class=col-xs-12><div class=meta><div class=page-title><span>@</span>{{imName}}</div></div></div></div><div class=content-wrapper scroll-glue=scrollDown ng-class="{\'drawer-open\': drawerOpen}"><div class=row><div class=col-xs-12><div class=channel-header><h3>@{{imName}}</h3><p>This is the very beginning of the <em>@{{imName}}</em> channel, which you created {{thisChannel.created | date:\'shortDate\'}}</p><hr></div><div class=message-container><div class=message-group ng-repeat="msg in messages" ng-class="{\'show-user\' : msg.user != messages[$index -1].user || (msg.ts - messages[$index - 1].ts)  >= 300000}"><div ng-if="msg.user != messages[$index -1].user || (msg.ts - messages[$index - 1].ts)  >= 300000 "><img class=message-avatar src=../assets/images/c57ba001.avatar.jpg alt=""> <a class=message-sender>{{msg.user}}</a> <span class=message-ts>{{msg.ts | date:\'shortTime\'}}</span></div><div class=message-content><span class=message-ts-hover>{{msg.ts | date: \'h:mm\'}}</span> <span class=message-text>{{msg.text}}</span></div></div></div></div></div></div><!--\n<text-input ng-model="inputText"\n            ng-enter="sendMessage(inputText)"\n            ng-change="setTyping()"\n            ng-if="isTyping">\n</text-input>\n\n--><div class=textfield-footer><textarea class=input-textarea ng-model=inputText ng-change=setTyping() enter-submit=sendMessage(inputText) ng-class="{\'input-drawer-open\': drawerOpen}"></textarea><span class=isTyping ng-if=isTyping><span class=isType-name>{{userTyping.name}}</span> is typing ...</span></div>'),a.put("app/sidebar/sidebar.html",'<div class=page-wrapper><div id=sidebar-wrapper><ul class=sidebar><li class=sidebar-header><a>Exports.io</a></li><li class=sidebar-title><span>Channels</span><a class=icon-new-channel ng-click=createNewChannel()><i class="fa fa-plus"></i></a></li><li class=sidebar-list ng-class="{\'active\': activeChannel == channel.name}" ng-repeat="channel in channels"><a ng-click=switchChannel(channel)><span class=channel-hashtag>#</span>{{channel.name}}</a></li><li class=sidebar-title><span>Direct Messages</span></li><li class=sidebar-list ng-repeat="user in users"><a ng-click=switchIM(user)><i class="fa fa-circle presence_icon" ng-class="{connected: \'icon-green\'}"></i> <span class=im-title>{{user.name}}</span></a></li><li class=sidebar-title><span>Private Groups</span></li></ul><ul class=sidebar-footer><li class=current-user><img class=current-user-avatar src=http://www.desa-net.com/exports_io/U037BREDX_32.jpg alt=""> <span class=current-user-name>{{currentUser.name}}</span> <span class=current-user-status><i class="fa fa-circle presence_icon" ng-class="{connected: \'icon-green\'}"></i> online</span></li><li class="current-user-toggle btn-group dropup" dropdown><button class=dropdown-toggle><span class="fa fa-chevron-up"></span></button><ul class=dropdown-menu role=menu><li><a href="">Preferences</a></li><li><a href="">Your Account</a></li><li><a href="">Your Profile</a></li><li><a href="">Change your Photo</a></li><li class=divider></li><li><a ng-click=logout()><i class="fa fa-sign-out"></i> Sign Out</a></li></ul></li></ul></div><div class="row header"><div class=header-title><span class=page-title-icon>{{activeChatIcon}}</span><span class=page-title>{{activeChatName}}</span> <span class=page-title-active><i class="fa fa-circle" ng-class="{connected: \'icon-green\'}"></i></span></div><div class=header-group><div class=header-search><form class=search-wrapper><input class=search-input type=search required placeholder=Search> <button class=search-input-icon-close type=reset></button></form></div><div class=drawer><a ng-click=openDrawer()><i class="fa fa-angle-left fa-2x fa-drawer-closed" ng-if=!drawerOpen></i> <i class="fa fa-angle-right fa-2x fa-drawer-open" ng-if=drawerOpen></i></a></div></div></div><div class=drawer-container ng-if=drawerOpen><h2>Files</h2><p>View and search files : content missing</p></div><div ui-view=content></div></div><div ng-controller=ModalInstanceCtrl><script type=text/ng-template id=myModalContent.html><div class="modal-header">\n      <h3 class="modal-title">Create a new Channel</h3>\n    </div>\n    <div class="modal-body">\n\n      <h5 style="text-align: center">This will create a new public channel that anyone on your team can join.</h5>\n\n      <p style="text-align: center">If you need this conversation to be private, create a new Private Group instead.</p>\n\n      <form class="form-horizontal">\n        <div class="form-group">\n          <label class="col-sm-2 control-label">Name</label>\n\n          <div class="col-sm-10">\n            <input type="text" class="form-control" ng-model="newChannel.name">\n          </div>\n        </div>\n        <div class="form-group">\n          <label class="col-sm-2 control-label">Purpose</label>\n\n          <div class="col-sm-10">\n            <input type="text" class="form-control" ng-model="newChannel.purpose.value">\n          </div>\n        </div>\n\n      </form>\n    </div>\n    <div class="modal-footer">\n      <button class="btn btn-default" ng-click="cancel()">Cancel</button>\n      <button class="btn btn-success" ng-click="ok()">Create Channel</button>\n    </div></script></div>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>chat</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(\'/admin\')}"><a href=/admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/signup\')}"><a href=/signup>Sign up</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/login\')}"><a href=/login>Login</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/settings\')}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/logout\')}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>')}]);