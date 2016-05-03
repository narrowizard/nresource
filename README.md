# nresource
一个基于nodejs的web静态资源服务器

## start
1. linux下,运行app.js 可以创建一个forever 守护进程
1. 直接运行server.js
        
## directory
```
|-nresource
  |-content
    |-cached
      |-static
      |-js
      |-css
      |-sass
    |-css
    |-js
    |-sass
  |-controller
  |-utils
  server.js
  webconfig.json
```
+ content 资源目录
+ cached 缓存目录,该目录下缓存了各种生成的文件
+ static 静态资源目录,一般为各种框架(如:jquery)
+ webconfig.json 项目配置文件

## router
+ /js/{filename}
        eg: /js/libs|json2&libs|dhtmlxcalendar&libs|twemoji&ext|jdTools  
            该路由会查找项目content/js目录下的文件libs/json2.js,libs/dhtmlxcalendar.js,libs/twemoji.js,ext/jdTools四个文件,并按顺序将这些文件合并压缩后返回
+ /css/{filename}
        同js
+ /sass/{filefolder}
        eg: /sass/project
            该路由会查找项目content/sass目录下的project/main.scss文件,将其编译压缩后返回
+ /static/{filepath}
        eg: /static/jquery-2.2.3.min.js
            该路由会请求项目content/cached/static目录下的文件jquery-2.2.3.min.js
+ /ts/{filename}

{filename}:可以包含目录,目录间用|连接  
{filepath}:静态文件路径,不能包含..  
{filefolder}:项目目录

## config
配置文件:webconfig.json
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
当后台的资源文件修改后,存在缓存文件过期的问题,这时候需要按以下说明处理:
+ static 直接修改文件
+ js,css 修改源文件后,需要手动删除文件相关的缓存文件
+ sass 修改源文件后,需要手动删除该项目相关的css文件  
建议:项目调试时可以通过[配置](#config)将缓存关闭