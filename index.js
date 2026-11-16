const path = require("node:path");
const { parse, processWikitext, createSettings } = require("@wdprlib/parser");
const { renderToHtml, renderWikitext } = require("@wdprlib/render");

let renderer = function(data) {
    return `WIKIDOT_PENDING`
}

const wd_ext = new Set([
    ".ftml",
    ".wikidot",
    ".wd",
]);

let wd_index = new Map();

function formatName(permalink) {
    const root = hexo.config.root;
    let pathname = new URL(permalink).pathname;
    pathname = pathname.startsWith(root) ? pathname.slice(root.length) : pathname;
    pathname = pathname.replace(/%3A/gi, ':').replace(/\/+$/, '').replace(/\.html$/i, '');
    return pathname;
}

function formatRef(pathname) {
    pathname = pathname.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\.html$/i, '');
    return pathname;
}

function buildIndex() {
    const pages = hexo.locals.get("pages").toArray();
    const posts = hexo.locals.get("posts").toArray();
    const index = new Map();
    for (const page of [...pages, ...posts]) {
        const ext = path.extname(page.source).toLowerCase();
        if (!wd_ext.has(ext)) continue;
        const pagename = formatName(page.permalink);
        if (index.has(pagename)) {
            hexo.log.warn(`Wikidot Renderer: Page name error "${pagename}"`);
        }
        index.set(pagename, page);
    }
    return index;
}

hexo.extend.filter.register('before_generate', function() {
    wd_index = buildIndex();
}, 5);

hexo.extend.filter.register("after_post_render", async function (page) {
    const ext = path.extname(page.source || "").toLowerCase();
    if (!wd_ext.has(ext)) return page;
    const fullName = formatName(page.permalink);
    const document = await processWikitext(page._content, {
        page: {
            fullName,
            unixName: fullName.slice(fullName.lastIndexOf(":") + 1),
            tags: [],
            urlPath: new URL(page.permalink, hexo.config.url).pathname
        },
        dataProvider: {
            fetchInclude: async (pageRef) => {
                if (pageRef.site) return null;
                const target = wd_index.get(formatRef(pageRef.page));
                if (!target) return null;
                return target._content;
            }
        },
        settings: {...createSettings("page"), allowStyleElements: true}
    });

    const rendered = await renderWikitext(document, {
        resolvers: {
            resolvePageExistence: async (names) => new Set(names)
        }
    });
    page.content = rendered.html;
    return page;
}, 5);

renderer.disableNunjucks = true;

hexo.extend.renderer.register('ftml', 'html', renderer);
hexo.extend.renderer.register('wikidot', 'html', renderer);
hexo.extend.renderer.register('wd', 'html', renderer);