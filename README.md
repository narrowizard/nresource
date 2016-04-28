# nresource
一个基于nodejs的web静态资源服务器

## router
+ /js/{filename}
+ /css/{filename}
+ /sass/{filename}
+ /static/{filename}

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