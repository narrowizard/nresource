# nresource
一个基于nodejs的web静态资源服务器

## directory
```
|-nresource
  |-content
    |-cached
      |-static
      |-js
    |-css
    |-js
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
        /js/libs|json2&libs|dhtmlxcalendar&libs|twemoji&ext|jdTools
+ /css/{filename}
+ /sass/{filename}
+ /static/{filename}
+ /ts/{filename}

{filename}:可以包含目录,目录间用|连接

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