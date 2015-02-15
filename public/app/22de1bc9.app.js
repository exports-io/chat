!function(){"use strict";angular.module("chatApp",["ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","ui.bootstrap","luegg.directives"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){b.when("/","/messages/general"),b.otherwise("/messages/general"),b.rule(function(a,b){var c=b.path(),d=c.toLowerCase();return c!==d?d:void 0}),c.html5Mode(!0),d.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status?(d.path("/login"),c.remove("token"),b.reject(a)):b.reject(a)}}}]).run(["$rootScope","$location","$state","Auth","socket",function(a,b,c,d,e){a.connectedUsers=[],a.$on("$stateChangeStart",function(a,c){d.isLoggedInAsync(function(a){c.authenticate&&!a&&b.path("/login")})}),e.socket.emit("userConnected",d.getCurrentUser()),e.socket.on("newUserConnected",function(b){a.connectedUsers.push(b)}),e.socket.on("userDisconnected",function(){a.connectedUsers.pop()})}])}(),angular.module("chatApp").config(["$stateProvider",function(a){a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}]),angular.module("chatApp").controller("LoginCtrl",["$scope","Auth","$location","$state",function(a,b,c,d){a.user={email:"p@ex.io",password:"pass"},a.errors={},a.login=function(c){a.submitted=!0,c.$valid&&b.login({email:a.user.email,password:a.user.password}).then(function(){d.go("index"),d.go("index.channel",{channel:"general"})})["catch"](function(b){a.errors.other=b.message})}}]),angular.module("chatApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){a.errors={},a.changePassword=function(b){a.submitted=!0,b.$valid&&c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){a.message="Password successfully changed."})["catch"](function(){b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""})}}]),angular.module("chatApp").controller("SignupCtrl",["$scope","Auth","$location",function(a){a.user={},a.errors={}}]),angular.module("chatApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("chatApp").config(["$stateProvider",function(a){a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),function(){"use strict";function a(a,b,c,d,e,f,g,h){a.inputText="",a.messages=[],a.scrollDown=!0,a.isTyping=!1,a.channelName=c.channel,g.getWithName({channel:a.channelName}).$promise.then(function(c){a.thisChannel=c[0],e.socket.emit("join",{SEQ:a.thisChannel.SEQ}),h.getWithSEQ({SEQ:c[0].SEQ}).$promise.then(function(c){a.messages=c,e.syncUpdates("chat",a.messages);var g=null;a.sendMessage=function(){if(""!==a.inputText){g&&b.cancel(g);var c=new f(d.getCurrentUser().name,a.inputText,a.thisChannel.SEQ);c.post().then(function(){}),a.isTyping=!1,a.inputText="",a.scrollDown=!0}},a.setTyping=function(){var b={user:a.currentUser,SEQ:a.thisChannel.SEQ};return e.socket.emit("startTyping",b)},e.socket.on("isTyping",function(c){a.isTyping=!0,a.userTyping=c.user,g&&b.cancel(g),g=b(function(){a.isTyping=!1},4e3)})})},function(a){console.log(a)}),a.$on("$destroy",function(){e.socket.emit("leave",{channel:a.thisChannel.SEQ}),e.unsyncUpdates("chat")})}angular.module("chatApp").controller("ChannelContentCtrl",a),a.$inject=["$scope","$timeout","$stateParams","Auth","socket","Chat","ChannelAPI","ChatAPI"]}(),function(){"use strict";function a(a){a.state("index.channel",{url:"messages/{channel:[^@]*}",views:{"content@index":{templateUrl:"app/channel/channel-content.html",controller:"ChannelContentCtrl",resolve:{channel:b,chat:c}}}})}function b(a,b,c){var d=a.defer();return c.getWithName({channel:b.channel}).$promise.then(function(a){d.resolve(a[0])}),d.promise}function c(a,b){a.getWithSEQ({SEQ:b.SEQ}).$promise.then(function(a){return a})}angular.module("chatApp").config(a),a.$inject=["$stateProvider"]}(),function(){"use strict";function a(a){function b(a,b,c){this.user=a,this.text=b,this.SEQ=c,this.type="message",this.ts=moment().valueOf()}return b.prototype.post=function(){return a.post("/api/chats",this)},b}function b(a){function b(a,b,c){this.user=a,this.text=b,this.SEQ=c,this.type="message",this.ts=moment().valueOf()}return b.prototype.post=function(){return a.post("/api/chats",this)},b}angular.module("chatApp").factory("Chat",a).factory("ErrorLog",b),a.$inject=["$http"],b.$inject=["$http"]}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i){a.inputText="",a.messages=[],a.scrollDown=!0,a.isTyping=!1,a.imName=c.im,g.getWithUsername({username:a.imName}).$promise.then(function(c){var g=[i.getCurrentUser().SEQ,c[0].SEQ];f.users(g).then(function(c){a.thisIM=c.data[0],d.socket.emit("join",{SEQ:c.data[0].SEQ}),h.getWithSEQ({SEQ:c.data[0].SEQ}).$promise.then(function(b){a.messages=b,d.syncUpdates("chat",a.messages)}),a.setTyping=function(){var b={user:a.currentUser,SEQ:a.thisIM.SEQ};d.socket.emit("startTyping",b)};var f=null;a.sendMessage=function(){if(""!==a.inputText){var b=new e(i.getCurrentUser().name,a.inputText,a.thisIM.SEQ);b.post().then(function(){a.isTyping=!1,a.inputText="",a.scrollDown=!0})}},d.socket.on("isTyping",function(c){a.isTyping=!0,a.userTyping=c.user,f&&b.cancel(f),f=b(function(){a.isTyping=!1},4e3)})},function(a){console.log(a)})}),a.$on("$destroy",function(){d.socket.emit("leave",{SEQ:a.thisIM.SEQ}),d.unsyncUpdates("chat")})}angular.module("chatApp").controller("IMContentCtrl",a),a.$inject=["$scope","$timeout","$stateParams","socket","Chat","ImAPI","UserAPI","ChatAPI","Auth"]}(),function(){"use strict";angular.module("chatApp").config(["$stateProvider",function(a){a.state("index.im",{url:"messages/@{im}",views:{"content@index":{templateUrl:"app/im/im-content.html",controller:"IMContentCtrl"}}})}])}(),function(){"use strict";angular.module("chatApp").factory("ImAPI",["$http",function(a){return{open:function(b,c){return a({url:"api/ims/open/",method:"POST",params:{currentUser:b,otherUser:c}})},users:function(b,c){return a({url:"api/ims/users/",method:"GET",params:{users:b,them:c}})},list:function(){return a({url:"api/ims/list/",method:"GET"})}}}])}(),function(){"use strict";function a(a,b,c,d,e,f,g){a.activeChannel=d.params.im||d.params.channel||"",a.drawerOpen=!1,a.searchInput="",b.currentUser=a.currentUser=g.getCurrentUser(),c.get("/api/users/").success(function(b){a.users=b}),c.get("/api/channels/").success(function(b){a.channels=b,f.syncUpdates("channel",a.channels)}),a.switchChannel=function(b){d.go("index.channel",{channel:b.name}),a.activeChannel=b.name},a.switchIM=function(b){d.transitionTo("index.im",{im:b.username},{reload:!1}),a.activeChannel=b.username},a.querySearch=function(b){c.get("/api/chats/query/"+b).then(function(b){a.searchResults=b.data})},a.openDrawer=function(){a.drawerOpen=a.drawerOpen?!1:!0},a.logout=function(){g.logout(),d.go("login")},a.createNewChannel=function(){a.modalInstance=e.open({templateUrl:"myModalContent.html",controller:"ModalInstanceCtrl",size:"medium",scope:a,resolve:{items:function(){return a.items}}}),a.modalInstance.result.then(function(a){c.post("/api/channels",a).then(function(){},function(){})},function(){console.info("Modal dismissed at: "+new Date)})}}function b(a,b){a.newChannel={name:"",purpose:{value:""},creator:b.currentUser._id,is_archived:!1,is_general:!1,is_member:!0,created:new Date},a.ok=function(){a.modalInstance.close(a.newChannel)},a.cancel=function(){a.modalInstance.dismiss("cancel")}}angular.module("chatApp").controller("SidebarCtrl",a).controller("ModalInstanceCtrl",b),a.$inject=["$scope","$rootScope","$http","$state","$modal","socket","Auth","ChatAPI"],b.$inject=["$scope","$rootScope"]}(),angular.module("chatApp").config(["$stateProvider",function(a){a.state("index",{url:"/",views:{"":{templateUrl:"app/sidebar/sidebar.html",controller:"SidebarCtrl"}}})}]),angular.module("chatApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g={};return e.get("token")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=f.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return e.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}]),angular.module("chatApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}]),angular.module("chatApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("chatApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("chatApp").controller("NavbarCtrl",["$scope","$location","Auth",function(a,b,c){a.menu=[{title:"Home",link:"/"}],a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.logout=function(){c.logout(),b.path("/login")},a.isActive=function(a){return a===b.path()}}]),function(){"use strict";function a(){return{templateUrl:"components/searchInput/searchInput.html",restrict:"E",scope:{value:"=ngModel",results:"&",change:"&"},link:function(){},controller:["$scope","$http",function(){}]}}angular.module("chatApp").directive("searchInput",a)}(),function(){"use strict";function a(a){return a("api/chats/:SEQ:query",{},{getAll:{method:"GET",isArray:!0},getWithSEQ:{method:"GET",isArray:!0,params:{SEQ:"@SEQ"}},query:{method:"GET",isArray:!0,params:{query:"@query"}},post:{method:"POST"}})}function b(a){return a("api/channels/:channel",{},{getAll:{method:"GET",isArray:!0},getWithName:{method:"GET",isArray:!0,params:{channel:"@channel"}},post:{method:"POST"}})}function c(a){return a("api/users/:id/username/:username",{},{getAll:{method:"GET",isArray:!0},getWithUsername:{method:"GET",isArray:!0,params:{username:"@username"}},post:{method:"POST"}})}angular.module("chatApp").service("ChannelAPI",b).service("ChatAPI",a).service("UserAPI",c),a.$inject=["$resource"],b.$inject=["$resource"],c.$inject=["$resource"]}(),function(){"use strict";function a(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b});return{socket:c,syncUpdates:function(a,b,d){d=d||angular.noop,c.on(a+":save",function(a){var c=_.find(b,{_id:a._id}),e=b.indexOf(c),f="created";c?(b.splice(e,1,a),f="updated"):b.push(a),d(f,a,b)}),c.on(a+":remove",function(a){var c="deleted";_.remove(b,{_id:a._id}),d(c,a,b)})},unsyncUpdates:function(a){c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}angular.module("chatApp").factory("socket",a),a.$inject=["socketFactory"]}(),function(){"use strict";function a(){return{templateUrl:"components/textInput/textInput.html",restrict:"E",require:"ngModel",scope:{value:"=ngModel",setTyping:"&",enter:"&",isTyping:"=",userTyping:"=",ngClass:"="},link:function(a,b){var c=160,d={del:8,ret:13},e=angular.element(b[0].querySelector("textarea.input-textarea")),f=angular.element(document.querySelector("div.content-wrapper"));e.originalHeight=e[0].offsetHeight,f.originalHeight=f[0].offsetHeight,a.$watch("value",function(b){a.setTyping.call(b)}),b.bind("keydown",function(b){e[0].offsetHeight>=c?e.css("overflow-y","visible"):b.which===d.del||(b.which===d.ret&&b.shiftKey?e[0].offsetHeight<c&&(e.css("height",function(){return e[0].offsetHeight+19}),f.css("height",function(){return f[0].offsetHeight-19}),f[0].scrollTop=f[0].scrollHeight):b.which===d.ret&&(a.$apply(function(){a.enter()}),e.css("height",function(){return e.originalHeight}),f.css("height",function(){return f.originalHeight}),b.preventDefault()))})}}}angular.module("chatApp").directive("textInput",a)}(),angular.module("chatApp").run(["$templateCache",function(a){"use strict";a.put("app/account/login/login.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p><p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email value=p@ex.io required></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required></div><div class="form-group has-error"><p class=help-block ng-show="form.email.$error.required && form.password.$error.required && submitted">Please enter your email and password.</p><p class=help-block ng-show="form.email.$error.email && submitted">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Login</button> <a class="btn btn-default btn-lg btn-register" href=/signup>Register</a></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show="form.name.$error.required && submitted">A name is required</p></div><div class=form-group ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show="form.email.$error.email && submitted">Doesn\'t look like a valid email.</p><p class=help-block ng-show="form.email.$error.required && submitted">What\'s your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Sign up</button> <a class="btn btn-default btn-lg btn-register" href=/login>Login</a></div></form></div></div><hr></div>'),a.put("app/admin/admin.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/channel/channel-content.html",'<div class="row header"><div class=col-xs-12><div class=meta><div class=page-title><span>#</span>{{channelName}}</div></div></div></div><div class=content-wrapper scroll-glue=scrollDown ng-class="{\'drawer-open\': drawerOpen}"><div class=row><div class=col-xs-12><div class=channel-header><h4># {{channelName}}</h4><p>This is the very beginning of the <em>#{{thisChannel.name}}</em> channel, which you created {{thisChannel.created | date:\'shortDate\'}}</p><hr></div><div class=message-container><div class=message-group ng-repeat="msg in messages" ng-class="{\'show-user\' : msg.user != messages[$index -1].user || (msg.ts - messages[$index - 1].ts) >= 300000}"><div ng-if="msg.user != messages[$index -1].user || (msg.ts - messages[$index - 1].ts)  >= 300000 "><img class=message-avatar src=http://www.desa-net.com/exports_io/U037BREDX_32.jpg alt=""> <a class=message-sender>{{msg.user}}</a> <span class=message-ts>{{msg.ts | date:\'shortTime\'}}</span></div><div class=message-content><span class=message-ts-hover>{{msg.ts | date: \'h:mm\'}}</span> <span class=message-text>{{msg.text}}</span></div></div></div></div></div></div><text-input ng-model=inputText enter=sendMessage(inputText) set-typing=setTyping() ng-class="{\'input-drawer-open\': drawerOpen}" is-typing=isTyping user-typing=userTyping></text-input>'),a.put("app/im/im-content.html",'<div class="row header"><div class=col-xs-12><div class=meta><div class=page-title><span>@</span>{{imName}}</div></div></div></div><div class=content-wrapper scroll-glue=scrollDown ng-class="{\'drawer-open\': drawerOpen}"><div class=row><div class=col-xs-12><div class=channel-header><h3>@{{imName}}</h3><p>This is the very beginning of the <em>@{{imName}}</em> channel, which you created {{thisChannel.created | date:\'shortDate\'}}</p><hr></div><div class=message-container><div class=message-group ng-repeat="msg in messages" ng-class="{\'show-user\' : msg.user != messages[$index -1].user || (msg.ts - messages[$index - 1].ts)  >= 300000}"><div ng-if="msg.user != messages[$index -1].user || (msg.ts - messages[$index - 1].ts)  >= 300000 "><img class=message-avatar src=http://www.desa-net.com/exports_io/U037BREDX_32.jpg alt=""> <a class=message-sender>{{msg.user}}</a> <span class=message-ts>{{msg.ts | date:\'shortTime\'}}</span></div><div class=message-content><span class=message-ts-hover>{{msg.ts | date: \'h:mm\'}}</span> <span class=message-text>{{msg.text}}</span></div></div></div></div></div></div><text-input ng-model=inputText enter=sendMessage(inputText) set-typing=setTyping() ng-class="{\'input-drawer-open\': drawerOpen}" is-typing=isTyping user-typing=userTyping></text-input>'),a.put("app/sidebar/sidebar.html",'<div class=page-wrapper><div id=sidebar-wrapper><ul class=sidebar><li class=sidebar-header><a>Exports.io</a></li><li class=sidebar-title><span>Channels</span><a class=icon-new-channel ng-click=createNewChannel()><i class="fa fa-plus"></i></a></li><li class=sidebar-list ng-class="{\'active\': activeChannel == channel.name}" ng-repeat="channel in channels"><a ng-click=switchChannel(channel)><span class=channel-hashtag>#</span>{{channel.name}}</a></li><li class=sidebar-title><span>Direct Messages</span></li><li class=sidebar-list ng-class="{\'active\': activeChannel == user.username}" ng-repeat="user in users" ng-if="user.SEQ != currentUser.SEQ"><a ng-click=switchIM(user)><i class="fa fa-circle presence_icon" ng-class="{connected: \'icon-green\'}"></i> <span class=im-title>{{user.name}}</span></a></li><li class=sidebar-title><span>Private Groups</span></li></ul><div class=sidebar-footer><img class=current-user-avatar src=http://www.desa-net.com/exports_io/U037BREDX_32.jpg alt=""> <span class=current-user-name>{{currentUser.username}}</span> <span class=current-user-status><i class="fa fa-circle presence_icon" ng-class="{connected: \'icon-green\'}"></i> online</span><div class="current-user-toggle btn-group dropup" dropdown><button class=dropdown-toggle><span class="fa fa-chevron-up"></span></button><ul class=dropdown-menu role=menu><li><a href="">Preferences</a></li><li><a href="">Your Account</a></li><li><a href="">Your Profile</a></li><li><a href="">Change your Photo</a></li><li class=divider></li><li><a ng-click=logout()><i class="fa fa-sign-out"></i> Sign Out</a></li></ul></div></div></div><div class="row header"><div class=header-title><span class=page-title-icon>{{activeChatIcon}}</span><span class=page-title>{{activeChatName}}</span> <span class=page-title-active><i class="fa fa-circle" ng-class="{connected: \'icon-green\'}"></i></span></div></div><div class=header-group><div class=header-search><form class=search-wrapper><input class=search-input type=search placeholder=Search ng-model=searchInput ng-change=querySearch(searchInput) required></form><ul class=search-results ng-show=searchResults><li ng-repeat="res in searchResults | limitTo:7"><h5>{{res.user.split(" ")[0]}}</h5><span>{{res.ts | date: \'d/MM h:mm\'}}</span><p>{{res.text}}</p></li></ul><!--<search-input ng-model="searchInput" results="searchResults" change="querySearch(value)"></search-input>--></div><div class=drawer-toggle><a ng-click=openDrawer()><i class="fa fa-angle-left fa-2x drawer-icon" ng-class="{\'fa-angle-right drawer-toggle-open\': drawerOpen}"></i></a></div></div><div class=drawer-container ng-if=drawerOpen><h2>Files</h2><p>View and search files - content missing</p></div><div ui-view=content></div></div><div ng-controller=ModalInstanceCtrl><script type=text/ng-template id=myModalContent.html><div class="modal-header">\n      <h3 class="modal-title">Create a new Channel</h3>\n    </div>\n    <div class="modal-body">\n\n      <h5 style="text-align: center">This will create a new public channel that anyone on your team can join.</h5>\n\n      <p style="text-align: center">If you need this conversation to be private, create a new Private Group instead.</p>\n\n      <form class="form-horizontal">\n        <div class="form-group">\n          <label class="col-sm-2 control-label">Name</label>\n\n          <div class="col-sm-10">\n            <input type="text" class="form-control" ng-model="newChannel.name">\n          </div>\n        </div>\n        <div class="form-group">\n          <label class="col-sm-2 control-label">Purpose</label>\n\n          <div class="col-sm-10">\n            <input type="text" class="form-control" ng-model="newChannel.purpose.value">\n          </div>\n        </div>\n\n      </form>\n    </div>\n    <div class="modal-footer">\n      <button class="btn btn-default" ng-click="cancel()">Cancel</button>\n      <button class="btn btn-success" ng-click="ok()">Create Channel</button>\n    </div></script></div>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>chat</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(\'/admin\')}"><a href=/admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/signup\')}"><a href=/signup>Sign up</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/login\')}"><a href=/login>Login</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/settings\')}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/logout\')}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>'),a.put("components/searchInput/searchInput.html",'<input class=search-input type=search placeholder=Search ng-model=value required><ul class=search-results ng-show=searchResults><li ng-repeat="res in searchResults | limitTo:7"><h5>{{res.user.split(" ")[0]}}</h5><span>{{res.ts | date: \'d/MM h:mm\'}}</span><p>{{res.text}}</p></li></ul>'),a.put("components/textInput/textInput.html",'<ul class="dropdown-menu scrollable-menu" style=display:block><li mentio-menu-item=item ng-repeat="item in items track by $index"><a class=text-primary ng-bind-html="item.label | mentioHighlight:typedTerm:\'menu-highlighted\' | unsafe"></a></li></ul><div class=textfield-footer><textarea class=input-textarea ng-model=value ng-class=ngClass autocorrect=off autocomplete=off spellcheck></textarea><span class=isTyping ng-if=isTyping><span class=isType-name>{{userTyping.name}}</span> is typing ...</span></div><style>.scrollable-menu {\n    height: auto;\n    max-height: 300px;\n    overflow: auto;\n  }\n  .menu-highlighted {\n    font-weight: bold;\n  }</style>')}]);