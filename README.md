这是为Hexo制作的Wikidot语法渲染器，所有直接用于Wikidot语法解析的后端调用[wdpr](https://github.com/r74tech/wdpr)。

安装依赖后，Hexo目录下扩展名为`.wikidot`、`.wd`和`.ftml`的文件会被以Wikidot语法渲染。目前，为了正确提供`[[include]]`支持，在Hexo默认渲染流程工作时，这些文件会被以占位符`WIKIDOT_PENDING`替换，并在后处理中解析为HTML。以下是部分特性：

- `[[iftags]]`暂时不被解析。
- 大部分`[[module]]`不会工作，`[[module CSS]]`会被解析为一个位于对应位置的`<style>`标签。

目前`[[include]]`得到初步支持。任何以Wikidot语法渲染的Hexo页面或博客，可以根据其生成的链接`permalink`被交互引用，`[[include]]`语法内使用的页面名是`permalink`去除站点链接、开头斜杠、结尾斜杠和可能的`.html`的版本。注意引入时，含有`:`的URL对应含有`%3A`的文件名称。

即，为了正确引用页面`https://example.com/folder/page%3Aname`，需要使用以下语法：

```
[[include folder/page:name]]
```