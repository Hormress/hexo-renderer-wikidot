const { parse } = require("@wdprlib/parser");
const { renderToHtml } = require("@wdprlib/render");

let renderer = function(data) {
    return renderToHtml(parse(data.text).ast);
}

renderer.disableNunjucks = true;

hexo.extend.renderer.register('ftml', 'html', renderer);
hexo.extend.renderer.register('wikidot', 'html', renderer);
hexo.extend.renderer.register('wd', 'html', renderer);