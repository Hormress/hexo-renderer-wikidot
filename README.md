这是为Hexo制作的Wikidot语法渲染器。目前，此插件只是在Hexo环境简单地调用[wdpr](https://github.com/r74tech/wdpr)。

安装依赖后，Hexo目录下扩展名为`.wikidot`、`.wd`和`.ftml`的文件会被以Wikidot语法渲染。目前，所有`[[module]]`和`[[include]]`会直接被移除。