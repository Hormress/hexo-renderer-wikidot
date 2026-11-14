const { parse } = require("@wdprlib/parser");
const { renderToHtml } = require("@wdprlib/render");

let renderer = function(data) {
    return renderToHtml(parse(data.text).ast);
}

hexo.extend.renderer.register('ftml', 'html', {renderer, disableNunjucks: true});
hexo.extend.renderer.register('wikidot', 'html', {renderer, disableNunjucks: true});
hexo.extend.renderer.register('wd', 'html', {renderer, disableNunjucks: true});