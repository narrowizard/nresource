# nresource
一个基于nodejs的web静态资源服务器

## start
1. linux下,运行app.js 可以创建一个forever 守护进程
1. 直接运行server.js
        
## directory
```
|-nresource
  |-content  资源目录
    |-cached  缓存目录,该目录下缓存了各种生成的文件
    |-css
    |-js
    |-sass
    |-ts
    |-tinyts  tinyts源码
    |-project 项目目录
  |-controller  项目控制器
  |-utils  项目工具类
  |-log  输出日志
  server.js  项目入口
  app.js  增加了forever功能(仅限linux系统)
  webconfig.json  项目配置文件
```

## router
+ /js/{filename}.js
        eg: /js/libs|json2&libs|dhtmlxcalendar&libs|twemoji&ext|jdTools.js
            该路由会查找项目content/js目录下的文件libs/json2.js,libs/dhtmlxcalendar.js,libs/twemoji.js,ext/jdTools四个文件,并按顺序将这些文件合并压缩后返回
+ /css/{filename}.css
        同js
+ /sass/{projectfolder}
        eg: /sass/project.css
            该路由会查找项目content/sass目录下的project/main.scss文件,将其编译压缩后返回
+ /static/{filepath}
        eg: /static/jquery-2.2.3.min.js
            该路由会请求项目content/cached/static目录下的文件jquery-2.2.3.min.js
+ /ts/{filename}.js

+ /tinyts/core.js
        返回编译后的tinyts源码
+ /tinyts/{projectfolder}/{filename}.js
        eg: /tinyts/demo/index.js
            该路由会编译demo项目下/viewmodels的index.ts文件,并返回
            
{filename}:可以包含目录,目录间用|连接  
{filepath}:静态文件路径,不能包含..
{projectfolder}:项目目录

##url query
+ cache: boolean,如果设置为false,则不使用缓存

## config
配置文件:webconfig.json  
参考配置文件:webconfig.default.json,请新建一个webconfig.json,并参照参考配置文件进行配置  
配置项
+ port  监听的http端口
+ contentPath   静态文件目录
+ cachePath 缓存文件目录
+ mode 运行模式,debug或release
+ maxAge 浏览器缓存时间
        maxAge:{
            days:number
            hours: number,
            minutes: number,
            seconds: number
        }
+ sassMode      sass或者scss      
+ useCache      是否打开缓存 
 
## cache

### cache directory
```
|-cached
  |-static 静态资源目录
  |-js  js缓存
  |-css  css缓存
  |-sass  sass缓存,缓存文件名为 项目名.css
  |-ts  ts缓存
  |-tinyts tinyts缓存
    |-core.js tinyts压缩源码缓存
    |-project 项目目录
      |-viewmodel.js 项目viewmodel缓存,缓存文件名为viewmodel.js
```
当后台的资源文件修改后,存在缓存文件过期的问题,这时候需要按以下说明处理:
+ static 直接修改文件
+ js,css 修改源文件后,需要手动删除文件相关的缓存文件
+ sass 修改源文件后,需要手动删除该项目相关的css文件  
建议:项目调试时可以通过[配置](#config)将缓存关闭