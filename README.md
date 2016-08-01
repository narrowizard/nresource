# nresource
a nodejs file server with compile typescript sass, compress and combine javascript css feature.

## start
+ install  
npm install
+ run server  
node server.js
+ run with deamon(only linux)  
node app.js 

## directory
```
|-nresource
  |-content  serving resource files
    |-cached  cache files
    |-css  css files
    |-js  js files
    |-sass  sass project
    |-ts  typescript files
    |-project tinyts project
  |-controller  
  |-utils  
  |-log  
  server.js  
  app.js  
  webconfig.json  
```

## router
+ /js/{filename}.js  
        eg: /js/libs|json2&libs|dhtmlxcalendar&libs|twemoji&ext|jdTools.js  
            combile and compress following four files:  
             `content/js/libs/json2.js`  
             `content/js/libs/dhtmlxcalendar.js`  
             `content/js/libs/twemoji.js`  
             `content/js/ext/jdTools.js`  
             and respond to client.
+ /css/{filename}.css  
        just like js router 
+ /sass/{projectfolder}  
        eg: /sass/project.css  
            looking for `content/sass/project/main.sass` or `content/sass/project/main.scss`,compile and respond to client if exists.the postfix is up to config.
+ /static/{filepath}  
        eg: /static/js/jquery-2.2.3.min.js  
            find file `content/cached/static/js/jquery-2.2.3.min.js` and respond to client.
+ /ts/{filename}.js  
        compile, compress file `content/ts/filename.ts` and respond to client.
+ /tinyts/{projectfolder}/{filename}.js  
        eg: /tinyts/demo/index.js
            compile tinyts project viewmodel and respond.for [detail](https://github.com/narrowizard/tinyts)?
            
## url query
+ cache: boolean, disable cache if true

## config
config nresource server in `webconfig.json`  
references:`webconfig.default.json`  
options
```
{
    "port": 8124,   // http port
    "contentPath": "content/",  // content path
    "cachePath": "cached/", // cache path,it means content/cached/
    "mode": "debug",    // debug or release
    "maxAge": {     // cache time
        "days": 365,
        "hours": 0,
        "minutes": 0,
        "seconds": 0
    },
    "sassMode": "scss", // sass or scss
    "useCache": true    // whether use cache or not
}
```
 
## cache

### cache directory
```
|-cached
  |-static // for static router
  |-js  // for js router
  |-css  // for css router
  |-sass  // for sass router
  |-ts  // for typescript router
  |-tinyts // for tinyts router 
    |-project //for tinyts router project router
      |-viewmodel.js 
```

### refresh cache
+ static  
 overwrite file 
+ js,css,sass,ts,tinyts  
 remove cache files manually
ps:disable cache when developing via [config](#config)