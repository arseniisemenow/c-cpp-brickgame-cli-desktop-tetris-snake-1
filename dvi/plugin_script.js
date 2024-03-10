(function () {
    function e(e) {
        this.tokens = [], this.tokens.links = {}, this.options = e || l.defaults, this.rules = o.normal, this.options.gfm && (this.options.tables ? this.rules = o.tables : this.rules = o.gfm)
    }

    function t(e, t) {
        if (this.options = t || l.defaults, this.links = e, this.rules = h.normal, !this.links) throw new Error("Tokens array requires a `links` property.");
        this.options.gfm ? this.options.breaks ? this.rules = h.breaks : this.rules = h.gfm : this.options.pedantic && (this.rules = h.pedantic)
    }

    function n(e) {
        this.tokens = [], this.token = null, this.options = e || l.defaults
    }

    function s(e, t) {
        return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    }

    function r(e, t) {
        return e = e.source, t = t || "", function n(s, r) {
            return s ? (r = r.source || r, r = r.replace(/(^|[^\[])\^/g, "$1"), e = e.replace(s, r), n) : new RegExp(e, t)
        }
    }

    function i() {
    }

    function a(e) {
        for (var t, n, s = 1; s < arguments.length; s++) {
            t = arguments[s];
            for (n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        return e
    }

    function l(t, s) {
        try {
            return s && (s = a({}, l.defaults, s)), n.parse(e.lex(t, s), s)
        } catch (r) {
            if (r.message += "\nPlease report this to https://github.com/chjj/marked.", (s || l.defaults).silent) return "An error occured:\n" + r.message;
            throw r
        }
    }

    var o = {
        newline: /^\n+/,
        code: /^( {4}[^\n]+\n*)+/,
        fences: i,
        hr: /^( *[-*_]){3,} *(?:\n+|$)/,
        heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
        nptable: i,
        lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
        blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
        list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
        html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
        table: i,
        paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
        text: /^[^\n]+/
    };
    o.bullet = /(?:[*+-]|\d+\.)/, o.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/, o.item = r(o.item, "gm")(/bull/g, o.bullet)(), o.list = r(o.list)(/bull/g, o.bullet)("hr", /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)(), o._tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b", o.html = r(o.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, o._tag)(), o.paragraph = r(o.paragraph)("hr", o.hr)("heading", o.heading)("lheading", o.lheading)("blockquote", o.blockquote)("tag", "<" + o._tag)("def", o.def)(), o.normal = a({}, o), o.gfm = a({}, o.normal, {
        fences: /^ *(`{3,}|~{3,}) *(\w+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
        paragraph: /^/
    }), o.gfm.paragraph = r(o.paragraph)("(?!", "(?!" + o.gfm.fences.source.replace("\\1", "\\2") + "|")(), o.tables = a({}, o.gfm, {
        nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
    }), e.rules = o, e.lex = function (t, n) {
        var s = new e(n);
        return s.lex(t)
    }, e.prototype.lex = function (e) {
        return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n"), this.token(e, !0)
    }, e.prototype.token = function (e, t) {
        for (var n, s, r, i, a, l, h, c, u, e = e.replace(/^ +$/gm, ""); e;) if ((r = this.rules.newline.exec(e)) && (e = e.substring(r[0].length), r[0].length > 1 && this.tokens.push({type: "space"})), r = this.rules.code.exec(e)) e = e.substring(r[0].length), r = r[0].replace(/^ {4}/gm, ""), this.tokens.push({
            type: "code",
            text: this.options.pedantic ? r : r.replace(/\n+$/, "")
        }); else if (r = this.rules.fences.exec(e)) e = e.substring(r[0].length), this.tokens.push({
            type: "code",
            lang: r[2],
            text: r[3]
        }); else if (r = this.rules.heading.exec(e)) e = e.substring(r[0].length), this.tokens.push({
            type: "heading",
            depth: r[1].length,
            text: r[2]
        }); else if (t && (r = this.rules.nptable.exec(e))) {
            for (e = e.substring(r[0].length), l = {
                type: "table",
                header: r[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
                align: r[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                cells: r[3].replace(/\n$/, "").split("\n")
            }, c = 0; c < l.align.length; c++) /^ *-+: *$/.test(l.align[c]) ? l.align[c] = "right" : /^ *:-+: *$/.test(l.align[c]) ? l.align[c] = "center" : /^ *:-+ *$/.test(l.align[c]) ? l.align[c] = "left" : l.align[c] = null;
            for (c = 0; c < l.cells.length; c++) l.cells[c] = l.cells[c].split(/ *\| */);
            this.tokens.push(l)
        } else if (r = this.rules.lheading.exec(e)) e = e.substring(r[0].length), this.tokens.push({
            type: "heading",
            depth: "=" === r[2] ? 1 : 2,
            text: r[1]
        }); else if (r = this.rules.hr.exec(e)) e = e.substring(r[0].length), this.tokens.push({type: "hr"}); else if (r = this.rules.blockquote.exec(e)) e = e.substring(r[0].length), this.tokens.push({type: "blockquote_start"}), r = r[0].replace(/^ *> ?/gm, ""), this.token(r, t), this.tokens.push({type: "blockquote_end"}); else if (r = this.rules.list.exec(e)) {
            for (e = e.substring(r[0].length), this.tokens.push({
                type: "list_start",
                ordered: isFinite(r[2])
            }), r = r[0].match(this.rules.item), this.options.smartLists && (i = o.bullet.exec(r[0])[0]), n = !1, u = r.length, c = 0; u > c; c++) l = r[c], h = l.length, l = l.replace(/^ *([*+-]|\d+\.) +/, ""), ~l.indexOf("\n ") && (h -= l.length, l = this.options.pedantic ? l.replace(/^ {1,4}/gm, "") : l.replace(new RegExp("^ {1," + h + "}", "gm"), "")), this.options.smartLists && c !== u - 1 && (a = o.bullet.exec(r[c + 1])[0], i === a || "." === i[1] && "." === a[1] || (e = r.slice(c + 1).join("\n") + e, c = u - 1)), s = n || /\n\n(?!\s*$)/.test(l), c !== u - 1 && (n = "\n" === l[l.length - 1], s || (s = n)), this.tokens.push({type: s ? "loose_item_start" : "list_item_start"}), this.token(l, !1), this.tokens.push({type: "list_item_end"});
            this.tokens.push({type: "list_end"})
        } else if (r = this.rules.html.exec(e)) e = e.substring(r[0].length), this.tokens.push({
            type: this.options.sanitize ? "paragraph" : "html",
            pre: "pre" === r[1],
            text: r[0]
        }); else if (t && (r = this.rules.def.exec(e))) e = e.substring(r[0].length), this.tokens.links[r[1].toLowerCase()] = {
            href: r[2],
            title: r[3]
        }; else if (t && (r = this.rules.table.exec(e))) {
            for (e = e.substring(r[0].length), l = {
                type: "table",
                header: r[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
                align: r[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                cells: r[3].replace(/(?: *\| *)?\n$/, "").split("\n")
            }, c = 0; c < l.align.length; c++) /^ *-+: *$/.test(l.align[c]) ? l.align[c] = "right" : /^ *:-+: *$/.test(l.align[c]) ? l.align[c] = "center" : /^ *:-+ *$/.test(l.align[c]) ? l.align[c] = "left" : l.align[c] = null;
            for (c = 0; c < l.cells.length; c++) l.cells[c] = l.cells[c].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
            this.tokens.push(l)
        } else if (t && (r = this.rules.paragraph.exec(e))) e = e.substring(r[0].length), this.tokens.push({
            type: "paragraph",
            text: "\n" === r[1][r[1].length - 1] ? r[1].slice(0, -1) : r[1]
        }); else if (r = this.rules.text.exec(e)) e = e.substring(r[0].length), this.tokens.push({
            type: "text",
            text: r[0]
        }); else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0));
        return this.tokens
    };
    var h = {
        escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
        autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
        url: i,
        tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
        link: /^!?\[(inside)\]\(href\)/,
        reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
        nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
        strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
        em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
        code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
        br: /^ {2,}\n(?!\s*$)/,
        del: i,
        text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
    };
    h._inside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/, h._href = /\s*<?([^\s]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/, h.link = r(h.link)("inside", h._inside)("href", h._href)(), h.reflink = r(h.reflink)("inside", h._inside)(), h.normal = a({}, h), h.pedantic = a({}, h.normal, {
        strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
    }), h.gfm = a({}, h.normal, {
        escape: r(h.escape)("])", "~|])")(),
        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
        del: /^~~(?=\S)([\s\S]*?\S)~~/,
        text: r(h.text)("]|", "~]|")("|", "|https?://|")()
    }), h.breaks = a({}, h.gfm, {
        br: r(h.br)("{2,}", "*")(),
        text: r(h.gfm.text)("{2,}", "*")()
    }), t.rules = h, t.output = function (e, n, s) {
        var r = new t(n, s);
        return r.output(e)
    }, t.prototype.output = function (e) {
        for (var t, n, r, i, a = ""; e;) if (i = this.rules.escape.exec(e)) e = e.substring(i[0].length), a += i[1]; else if (i = this.rules.autolink.exec(e)) e = e.substring(i[0].length), "@" === i[2] ? (n = ":" === i[1][6] ? this.mangle(i[1].substring(7)) : this.mangle(i[1]), r = this.mangle("mailto:") + n) : (n = s(i[1]), r = n), a += '<a href="' + r + '">' + n + "</a>"; else if (i = this.rules.url.exec(e)) e = e.substring(i[0].length), n = s(i[1]), r = n, a += '<a href="' + r + '">' + n + "</a>"; else if (i = this.rules.tag.exec(e)) e = e.substring(i[0].length), a += this.options.sanitize ? s(i[0]) : i[0]; else if (i = this.rules.link.exec(e)) e = e.substring(i[0].length), a += this.outputLink(i, {
            href: i[2],
            title: i[3]
        }); else if ((i = this.rules.reflink.exec(e)) || (i = this.rules.nolink.exec(e))) {
            if (e = e.substring(i[0].length), t = (i[2] || i[1]).replace(/\s+/g, " "), t = this.links[t.toLowerCase()], !t || !t.href) {
                a += i[0][0], e = i[0].substring(1) + e;
                continue
            }
            a += this.outputLink(i, t)
        } else if (i = this.rules.strong.exec(e)) e = e.substring(i[0].length), a += "<strong>" + this.output(i[2] || i[1]) + "</strong>"; else if (i = this.rules.em.exec(e)) e = e.substring(i[0].length), a += "<em>" + this.output(i[2] || i[1]) + "</em>"; else if (i = this.rules.code.exec(e)) e = e.substring(i[0].length), a += "<code>" + s(i[2], !0) + "</code>"; else if (i = this.rules.br.exec(e)) e = e.substring(i[0].length), a += "<br>"; else if (i = this.rules.del.exec(e)) e = e.substring(i[0].length), a += "<del>" + this.output(i[1]) + "</del>"; else if (i = this.rules.text.exec(e)) e = e.substring(i[0].length), a += s(i[0]); else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0));
        return a
    }, t.prototype.outputLink = function (e, t) {
        return "!" !== e[0][0] ? '<a href="' + s(t.href) + '"' + (t.title ? ' title="' + s(t.title) + '"' : "") + ">" + this.output(e[1]) + "</a>" : '<img src="' + s(t.href) + '" alt="' + s(e[1]) + '"' + (t.title ? ' title="' + s(t.title) + '"' : "") + ">"
    }, t.prototype.mangle = function (e) {
        for (var t, n = "", s = e.length, r = 0; s > r; r++) t = e.charCodeAt(r), Math.random() > .5 && (t = "x" + t.toString(16)), n += "&#" + t + ";";
        return n
    }, n.parse = function (e, t) {
        var s = new n(t);
        return s.parse(e)
    }, n.prototype.parse = function (e) {
        this.inline = new t(e.links, this.options), this.tokens = e.reverse();
        for (var n = ""; this.next();) n += this.tok();
        return n
    }, n.prototype.next = function () {
        return this.token = this.tokens.pop()
    }, n.prototype.peek = function () {
        return this.tokens[this.tokens.length - 1] || 0
    }, n.prototype.parseText = function () {
        for (var e = this.token.text; "text" === this.peek().type;) e += "\n" + this.next().text;
        return this.inline.output(e)
    }, n.prototype.tok = function () {
        switch (this.token.type) {
            case"space":
                return "";
            case"hr":
                return "<hr>\n";
            case"heading":
                return "<h" + this.token.depth + ">" + this.inline.output(this.token.text) + "</h" + this.token.depth + ">\n";
            case"code":
                if (this.options.highlight) {
                    var e = this.options.highlight(this.token.text, this.token.lang);
                    null != e && e !== this.token.text && (this.token.escaped = !0, this.token.text = e)
                }
                return this.token.escaped || (this.token.text = s(this.token.text, !0)), "<pre><code" + (this.token.lang ? ' class="' + this.options.langPrefix + this.token.lang + '"' : "") + ">" + this.token.text + "</code></pre>\n";
            case"table":
                var t, n, r, i, a, l = "";
                for (l += "<thead>\n<tr>\n", n = 0; n < this.token.header.length; n++) t = this.inline.output(this.token.header[n]), l += this.token.align[n] ? '<th align="' + this.token.align[n] + '">' + t + "</th>\n" : "<th>" + t + "</th>\n";
                for (l += "</tr>\n</thead>\n", l += "<tbody>\n", n = 0; n < this.token.cells.length; n++) {
                    for (r = this.token.cells[n], l += "<tr>\n", a = 0; a < r.length; a++) i = this.inline.output(r[a]), l += this.token.align[a] ? '<td align="' + this.token.align[a] + '">' + i + "</td>\n" : "<td>" + i + "</td>\n";
                    l += "</tr>\n"
                }
                return l += "</tbody>\n", "<table>\n" + l + "</table>\n";
            case"blockquote_start":
                for (var l = ""; "blockquote_end" !== this.next().type;) l += this.tok();
                return "<blockquote>\n" + l + "</blockquote>\n";
            case"list_start":
                for (var o = this.token.ordered ? "ol" : "ul", l = ""; "list_end" !== this.next().type;) l += this.tok();
                return "<" + o + ">\n" + l + "</" + o + ">\n";
            case"list_item_start":
                for (var l = ""; "list_item_end" !== this.next().type;) l += "text" === this.token.type ? this.parseText() : this.tok();
                return "<li>" + l + "</li>\n";
            case"loose_item_start":
                for (var l = ""; "list_item_end" !== this.next().type;) l += this.tok();
                return "<li>" + l + "</li>\n";
            case"html":
                return this.token.pre || this.options.pedantic ? this.token.text : this.inline.output(this.token.text);
            case"paragraph":
                return "<p>" + this.inline.output(this.token.text) + "</p>\n";
            case"text":
                return "<p>" + this.parseText() + "</p>\n"
        }
    }, i.exec = i, l.options = l.setOptions = function (e) {
        return a(l.defaults, e), l
    }, l.defaults = {
        gfm: !0,
        tables: !0,
        breaks: !1,
        pedantic: !1,
        sanitize: !1,
        smartLists: !1,
        silent: !1,
        highlight: null,
        langPrefix: "lang-"
    }, l.Parser = n, l.parser = n.parse, l.Lexer = e, l.lexer = e.lex, l.InlineLexer = t, l.inlineLexer = t.output, l.parse = l, "object" == typeof exports ? module.exports = l : "function" == typeof define && define.amd ? define(function () {
        return l
    }) : this.marked = l
}).call(function () {
    return this || ("undefined" != typeof window ? window : global)
}()), window.PR_SHOULD_USE_CONTINUATION = !0;
var prettyPrintOne, prettyPrint;
!function () {
    function e(e) {
        function t(e) {
            var t = e.charCodeAt(0);
            if (92 !== t) return t;
            var n = e.charAt(1);
            return t = u[n], t ? t : n >= "0" && "7" >= n ? parseInt(e.substring(1), 8) : "u" === n || "x" === n ? parseInt(e.substring(2), 16) : e.charCodeAt(1)
        }

        function n(e) {
            if (32 > e) return (16 > e ? "\\x0" : "\\x") + e.toString(16);
            var t = String.fromCharCode(e);
            return "\\" === t || "-" === t || "]" === t || "^" === t ? "\\" + t : t
        }

        function s(e) {
            var s = e.substring(1, e.length - 1).match(new RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]", "g")),
                r = [], i = "^" === s[0], a = ["["];
            i && a.push("^");
            for (var l = i ? 1 : 0, o = s.length; o > l; ++l) {
                var h = s[l];
                if (/\\[bdsw]/i.test(h)) a.push(h); else {
                    var c, u = t(h);
                    o > l + 2 && "-" === s[l + 1] ? (c = t(s[l + 2]), l += 2) : c = u, r.push([u, c]), 65 > c || u > 122 || (65 > c || u > 90 || r.push([32 | Math.max(65, u), 32 | Math.min(c, 90)]), 97 > c || u > 122 || r.push([-33 & Math.max(97, u), -33 & Math.min(c, 122)]))
                }
            }
            r.sort(function (e, t) {
                return e[0] - t[0] || t[1] - e[1]
            });
            for (var p = [], d = [], l = 0; l < r.length; ++l) {
                var g = r[l];
                g[0] <= d[1] + 1 ? d[1] = Math.max(d[1], g[1]) : p.push(d = g)
            }
            for (var l = 0; l < p.length; ++l) {
                var g = p[l];
                a.push(n(g[0])), g[1] > g[0] && (g[1] + 1 > g[0] && a.push("-"), a.push(n(g[1])))
            }
            return a.push("]"), a.join("")
        }

        function r(e) {
            for (var t = e.source.match(new RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)", "g")), r = t.length, l = [], o = 0, h = 0; r > o; ++o) {
                var c = t[o];
                if ("(" === c) ++h; else if ("\\" === c.charAt(0)) {
                    var u = +c.substring(1);
                    u && (h >= u ? l[u] = -1 : t[o] = n(u))
                }
            }
            for (var o = 1; o < l.length; ++o) -1 === l[o] && (l[o] = ++i);
            for (var o = 0, h = 0; r > o; ++o) {
                var c = t[o];
                if ("(" === c) ++h, l[h] || (t[o] = "(?:"); else if ("\\" === c.charAt(0)) {
                    var u = +c.substring(1);
                    u && h >= u && (t[o] = "\\" + l[u])
                }
            }
            for (var o = 0; r > o; ++o) "^" === t[o] && "^" !== t[o + 1] && (t[o] = "");
            if (e.ignoreCase && a) for (var o = 0; r > o; ++o) {
                var c = t[o], p = c.charAt(0);
                c.length >= 2 && "[" === p ? t[o] = s(c) : "\\" !== p && (t[o] = c.replace(/[a-zA-Z]/g, function (e) {
                    var t = e.charCodeAt(0);
                    return "[" + String.fromCharCode(-33 & t, 32 | t) + "]"
                }))
            }
            return t.join("")
        }

        for (var i = 0, a = !1, l = !1, o = 0, h = e.length; h > o; ++o) {
            var c = e[o];
            if (c.ignoreCase) l = !0; else if (/[a-z]/i.test(c.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ""))) {
                a = !0, l = !1;
                break
            }
        }
        for (var u = {b: 8, t: 9, n: 10, v: 11, f: 12, r: 13}, p = [], o = 0, h = e.length; h > o; ++o) {
            var c = e[o];
            if (c.global || c.multiline) throw new Error("" + c);
            p.push("(?:" + r(c) + ")")
        }
        return new RegExp(p.join("|"), l ? "gi" : "g")
    }

    function t(e, t) {
        function n(e) {
            switch (e.nodeType) {
                case 1:
                    if (s.test(e.className)) return;
                    for (var o = e.firstChild; o; o = o.nextSibling) n(o);
                    var h = e.nodeName.toLowerCase();
                    ("br" === h || "li" === h) && (r[l] = "\n", a[l << 1] = i++, a[l++ << 1 | 1] = e);
                    break;
                case 3:
                case 4:
                    var c = e.nodeValue;
                    c.length && (c = t ? c.replace(/\r\n?/g, "\n") : c.replace(/[ \t\r\n]+/g, " "), r[l] = c, a[l << 1] = i, i += c.length, a[l++ << 1 | 1] = e)
            }
        }

        var s = /(?:^|\s)nocode(?:\s|$)/, r = [], i = 0, a = [], l = 0;
        return n(e), {sourceCode: r.join("").replace(/\n$/, ""), spans: a}
    }

    function n(e, t, n, s) {
        if (t) {
            var r = {sourceCode: t, basePos: e};
            n(r), s.push.apply(s, r.decorations)
        }
    }

    function s(e) {
        for (var t = void 0, n = e.firstChild; n; n = n.nextSibling) {
            var s = n.nodeType;
            t = 1 === s ? t ? e : n : 3 === s && H.test(n.nodeValue) ? e : t
        }
        return t === e ? void 0 : t
    }

    function r(t, s) {
        var r, i = {};
        !function () {
            for (var n = t.concat(s), a = [], l = {}, o = 0, h = n.length; h > o; ++o) {
                var c = n[o], u = c[3];
                if (u) for (var p = u.length; --p >= 0;) i[u.charAt(p)] = c;
                var d = c[1], g = "" + d;
                l.hasOwnProperty(g) || (a.push(d), l[g] = null)
            }
            a.push(/[\0-\uffff]/), r = e(a)
        }();
        var a = s.length, l = function (e) {
            for (var t = e.sourceCode, o = e.basePos, c = [o, q], u = 0, p = t.match(r) || [], d = {}, g = 0, f = p.length; f > g; ++g) {
                var m, b = p[g], x = d[b], v = void 0;
                if ("string" == typeof x) m = !1; else {
                    var y = i[b.charAt(0)];
                    if (y) v = b.match(y[1]), x = y[0]; else {
                        for (var k = 0; a > k; ++k) if (y = s[k], v = b.match(y[1])) {
                            x = y[0];
                            break
                        }
                        v || (x = q)
                    }
                    m = x.length >= 5 && "lang-" === x.substring(0, 5), !m || v && "string" == typeof v[1] || (m = !1, x = B), m || (d[b] = x)
                }
                var w = u;
                if (u += b.length, m) {
                    var S = v[1], _ = b.indexOf(S), C = _ + S.length;
                    v[2] && (C = b.length - v[2].length, _ = C - S.length);
                    var E = x.substring(5);
                    n(o + w, b.substring(0, _), l, c), n(o + w + _, S, h(E, S), c), n(o + w + C, b.substring(C), l, c)
                } else c.push(o + w, x)
            }
            e.decorations = c
        };
        return l
    }

    function i(e) {
        var t = [], n = [];
        e.tripleQuotedStrings ? t.push([$, /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/, null, "'\""]) : e.multiLineStrings ? t.push([$, /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, null, "'\"`"]) : t.push([$, /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, null, "\"'"]), e.verbatimStrings && n.push([$, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
        var s = e.hashComments;
        if (s && (e.cStyleComments ? (s > 1 ? t.push([L, /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, "#"]) : t.push([L, /^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/, null, "#"]), n.push([$, /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/, null])) : t.push([L, /^#[^\r\n]*/, null, "#"])), e.cStyleComments && (n.push([L, /^\/\/[^\r\n]*/, null]), n.push([L, /^\/\*[\s\S]*?(?:\*\/|$)/, null])), e.regexLiterals) {
            var i = "/(?=[^/*])(?:[^/\\x5B\\x5C]|\\x5C[\\s\\S]|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+/";
            n.push(["lang-regex", new RegExp("^" + D + "(" + i + ")")])
        }
        var a = e.types;
        a && n.push([j, a]);
        var l = ("" + e.keywords).replace(/^ | $/g, "");
        l.length && n.push([T, new RegExp("^(?:" + l.replace(/[\s,]+/g, "|") + ")\\b"), null]), t.push([q, /^\s+/, null, " \r\n	В "]);
        var o = /^.[^\s\w\.$@\'\"\`\/\\]*/;
        return n.push([A, /^@[a-z_$][a-z_$@0-9]*/i, null], [j, /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null], [q, /^[a-z_$][a-z_$@0-9]*/i, null], [A, new RegExp("^(?:0x[a-f0-9]+|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)(?:e[+\\-]?\\d+)?)[a-z]*", "i"), null, "0123456789"], [q, /^\\[\s\S]?/, null], [P, o, null]), r(t, n)
    }

    function a(e, t, n) {
        function s(e) {
            switch (e.nodeType) {
                case 1:
                    if (i.test(e.className)) break;
                    if ("br" === e.nodeName) r(e), e.parentNode && e.parentNode.removeChild(e); else for (var t = e.firstChild; t; t = t.nextSibling) s(t);
                    break;
                case 3:
                case 4:
                    if (n) {
                        var o = e.nodeValue, h = o.match(a);
                        if (h) {
                            var c = o.substring(0, h.index);
                            e.nodeValue = c;
                            var u = o.substring(h.index + h[0].length);
                            if (u) {
                                var p = e.parentNode;
                                p.insertBefore(l.createTextNode(u), e.nextSibling)
                            }
                            r(e), c || e.parentNode.removeChild(e)
                        }
                    }
            }
        }

        function r(e) {
            function t(e, n) {
                var s = n ? e.cloneNode(!1) : e, r = e.parentNode;
                if (r) {
                    var i = t(r, 1), a = e.nextSibling;
                    i.appendChild(s);
                    for (var l = a; l; l = a) a = l.nextSibling, i.appendChild(l)
                }
                return s
            }

            for (; !e.nextSibling;) if (e = e.parentNode, !e) return;
            for (var n, s = t(e.nextSibling, 0); (n = s.parentNode) && 1 === n.nodeType;) s = n;
            h.push(s)
        }

        for (var i = /(?:^|\s)nocode(?:\s|$)/, a = /\r\n?|\n/, l = e.ownerDocument, o = l.createElement("li"); e.firstChild;) o.appendChild(e.firstChild);
        for (var h = [o], c = 0; c < h.length; ++c) s(h[c]);
        t === (0 | t) && h[0].setAttribute("value", t);
        var u = l.createElement("ol");
        u.className = "linenums";
        for (var p = Math.max(0, t - 1 | 0) || 0, c = 0, d = h.length; d > c; ++c) o = h[c], o.className = "L" + (c + p) % 10, o.firstChild || o.appendChild(l.createTextNode("В ")), u.appendChild(o);
        e.appendChild(u)
    }

    function l(e) {
        var t = /\bMSIE\s(\d+)/.exec(navigator.userAgent);
        t = t && +t[1] <= 8;
        var n = /\n/g, s = e.sourceCode, r = s.length, i = 0, a = e.spans, l = a.length, o = 0, h = e.decorations,
            c = h.length, u = 0;
        h[c] = r;
        var p, d;
        for (d = p = 0; c > d;) h[d] !== h[d + 2] ? (h[p++] = h[d++], h[p++] = h[d++]) : d += 2;
        for (c = p, d = p = 0; c > d;) {
            for (var g = h[d], f = h[d + 1], m = d + 2; c >= m + 2 && h[m + 1] === f;) m += 2;
            h[p++] = g, h[p++] = f, d = m
        }
        c = h.length = p;
        var b, x = e.sourceNode;
        x && (b = x.style.display, x.style.display = "none");
        try {
            for (; l > o;) {
                var v, y = (a[o], a[o + 2] || r), k = h[u + 2] || r, m = Math.min(y, k), w = a[o + 1];
                if (1 !== w.nodeType && (v = s.substring(i, m))) {
                    t && (v = v.replace(n, "\r")), w.nodeValue = v;
                    var S = w.ownerDocument, _ = S.createElement("span");
                    _.className = h[u + 1];
                    var C = w.parentNode;
                    C.replaceChild(_, w), _.appendChild(w), y > i && (a[o + 1] = w = S.createTextNode(s.substring(m, y)), C.insertBefore(w, _.nextSibling))
                }
                i = m, i >= y && (o += 2), i >= k && (u += 2)
            }
        } finally {
            x && (x.style.display = b)
        }
    }

    function o(e, t) {
        for (var n = t.length; --n >= 0;) {
            var s = t[n];
            U.hasOwnProperty(s) ? d.console && console.warn("cannot override language handler %s", s) : U[s] = e
        }
    }

    function h(e, t) {
        return e && U.hasOwnProperty(e) || (e = /^\s*</.test(t) ? "default-markup" : "default-code"), U[e]
    }

    function c(e) {
        var n = e.langExtension;
        try {
            var s = t(e.sourceNode, e.pre), r = s.sourceCode;
            e.sourceCode = r, e.spans = s.spans, e.basePos = 0, h(n, r)(e), l(e)
        } catch (i) {
            d.console && console.log(i && i.stack ? i.stack : i)
        }
    }

    function u(e, t, n) {
        var s = document.createElement("pre");
        s.innerHTML = e, n && a(s, n, !0);
        var r = {langExtension: t, numberLines: n, sourceNode: s, pre: 1};
        return c(r), s.innerHTML
    }

    function p(e) {
        function t(e) {
            return document.getElementsByTagName(e)
        }

        function n() {
            for (var t = d.PR_SHOULD_USE_CONTINUATION ? u.now() + 250 : 1 / 0; g < i.length && u.now() < t; g++) {
                var r = i[g], l = r.className;
                if (m.test(l) && !b.test(l)) {
                    for (var o = !1, h = r.parentNode; h; h = h.parentNode) {
                        var k = h.tagName;
                        if (y.test(k) && h.className && m.test(h.className)) {
                            o = !0;
                            break
                        }
                    }
                    if (!o) {
                        r.className += " prettyprinted";
                        var w, S = l.match(f);
                        !S && (w = s(r)) && v.test(w.tagName) && (S = w.className.match(f)), S && (S = S[1]);
                        var _;
                        if (x.test(r.tagName)) _ = 1; else {
                            var C = r.currentStyle,
                                E = C ? C.whiteSpace : document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(r, null).getPropertyValue("white-space") : 0;
                            _ = E && "pre" === E.substring(0, 3)
                        }
                        var N = r.className.match(/\blinenums\b(?::(\d+))?/);
                        N = N ? N[1] && N[1].length ? +N[1] : !0 : !1, N && a(r, N, _), p = {
                            langExtension: S,
                            sourceNode: r,
                            numberLines: N,
                            pre: _
                        }, c(p)
                    }
                }
            }
            g < i.length ? setTimeout(n, 250) : e && e()
        }

        for (var r = [t("pre"), t("code"), t("xmp")], i = [], l = 0; l < r.length; ++l) for (var o = 0, h = r[l].length; h > o; ++o) i.push(r[l][o]);
        r = null;
        var u = Date;
        u.now || (u = {
            now: function () {
                return +new Date
            }
        });
        var p, g = 0, f = /\blang(?:uage)?-([\w.]+)(?!\S)/, m = /\bprettyprint\b/, b = /\bprettyprinted\b/,
            x = /pre|xmp/i, v = /^code$/i, y = /^(?:pre|code|xmp)$/i;
        n()
    }

    var d = window, g = ["break,continue,do,else,for,if,return,while"],
        f = [g, "auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],
        m = [f, "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],
        b = [m, "alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],
        x = [m, "abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"],
        v = [x, "as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"],
        y = "all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",
        k = [m, "debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],
        w = "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",
        S = [g, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],
        _ = [g, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],
        C = [g, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"], E = [b, v, k, w + S, _, C],
        N = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,
        $ = "str", T = "kwd", L = "com", j = "typ", A = "lit", P = "pun", q = "pln", M = "tag", R = "dec", B = "src",
        I = "atn", O = "atv", z = "nocode",
        D = "(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*",
        H = /\S/, F = i({keywords: E, hashComments: !0, cStyleComments: !0, multiLineStrings: !0, regexLiterals: !0}),
        U = {};
    o(F, ["default-code"]), o(r([], [[q, /^[^<?]+/], [R, /^<!\w[^>]*(?:>|$)/], [L, /^<\!--[\s\S]*?(?:-\->|$)/], ["lang-", /^<\?([\s\S]+?)(?:\?>|$)/], ["lang-", /^<%([\s\S]+?)(?:%>|$)/], [P, /^(?:<[%?]|[%?]>)/], ["lang-", /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i], ["lang-js", /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i], ["lang-css", /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i], ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]]), ["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]), o(r([[q, /^[\s]+/, null, " 	\r\n"], [O, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, "\"'"]], [[M, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i], [I, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i], ["lang-uq.val", /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/], [P, /^[=<>\/]+/], ["lang-js", /^on\w+\s*=\s*\"([^\"]+)\"/i], ["lang-js", /^on\w+\s*=\s*\'([^\']+)\'/i], ["lang-js", /^on\w+\s*=\s*([^\"\'>\s]+)/i], ["lang-css", /^style\s*=\s*\"([^\"]+)\"/i], ["lang-css", /^style\s*=\s*\'([^\']+)\'/i], ["lang-css", /^style\s*=\s*([^\"\'>\s]+)/i]]), ["in.tag"]), o(r([], [[O, /^[\s\S]+/]]), ["uq.val"]), o(i({
        keywords: b,
        hashComments: !0,
        cStyleComments: !0,
        types: N
    }), ["c", "cc", "cpp", "cxx", "cyc", "m"]), o(i({keywords: "null,true,false"}), ["json"]), o(i({
        keywords: v,
        hashComments: !0,
        cStyleComments: !0,
        verbatimStrings: !0,
        types: N
    }), ["cs"]), o(i({keywords: x, cStyleComments: !0}), ["java"]), o(i({
        keywords: C,
        hashComments: !0,
        multiLineStrings: !0
    }), ["bsh", "csh", "sh"]), o(i({
        keywords: S,
        hashComments: !0,
        multiLineStrings: !0,
        tripleQuotedStrings: !0
    }), ["cv", "py"]), o(i({
        keywords: w,
        hashComments: !0,
        multiLineStrings: !0,
        regexLiterals: !0
    }), ["perl", "pl", "pm"]), o(i({
        keywords: _,
        hashComments: !0,
        multiLineStrings: !0,
        regexLiterals: !0
    }), ["rb"]), o(i({keywords: k, cStyleComments: !0, regexLiterals: !0}), ["js"]), o(i({
        keywords: y,
        hashComments: 3,
        cStyleComments: !0,
        multilineStrings: !0,
        tripleQuotedStrings: !0,
        regexLiterals: !0
    }), ["coffee"]), o(r([], [[$, /^[\s\S]+/]]), ["regex"]);
    var V = d.PR = {
        createSimpleLexer: r,
        registerLangHandler: o,
        sourceDecorator: i,
        PR_ATTRIB_NAME: I,
        PR_ATTRIB_VALUE: O,
        PR_COMMENT: L,
        PR_DECLARATION: R,
        PR_KEYWORD: T,
        PR_LITERAL: A,
        PR_NOCODE: z,
        PR_PLAIN: q,
        PR_PUNCTUATION: P,
        PR_SOURCE: B,
        PR_STRING: $,
        PR_TAG: M,
        PR_TYPE: j,
        prettyPrintOne: d.prettyPrintOne = u,
        prettyPrint: d.prettyPrint = p
    };
    "function" == typeof define && define.amd && define("google-code-prettify", [], function () {
        return V
    })
}(), function (e, t) {
    function n(e) {
        var n, s, r, i = t.createElement("a"), a = {};
        for (i.href = e, n = i.search.replace("?", "&").split("&"), r = 0; r < n.length; r++) s = n[r].split("="), s[0] && (a[s[0]] = s[1] || "");
        return a
    }

    t.body.style.display = "none", t.head = t.getElementsByTagName("head")[0], "getElementsByClassName" in t || (t.getElementsByClassName = function (e) {
        function n(e, t) {
            for (var n = [], s = new RegExp("(^| )" + t + "( |$)"), r = e.getElementsByTagName("*"), i = 0, a = r.length; a > i; i++) s.test(r[i].className) && n.push(r[i]);
            return n
        }

        return n(t.body, e)
    });
    var s = t.getElementsByTagName("xmp")[0] || t.getElementsByTagName("pre")[0] || t.getElementsByTagName("textarea")[0],
        r = t.getElementsByTagName("title")[0], i = t.getElementsByTagName("script"),
        a = t.getElementsByClassName("navbar")[0], l = t.createElement("meta");
    l.name = "viewport", l.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0", t.head.firstChild ? t.head.insertBefore(l, t.head.firstChild) : t.head.appendChild(l);
    for (var o = "", h = 0; h < i.length; h++) i[h].src.match("strapdown") && (o = i[h].src);
    var c = o.substr(0, o.lastIndexOf("/")), u = n(o);
    console.log(u), console.log("[strapdown.js] [INFO] search the URI for src = " + u.src);
    var p = s.getAttribute("theme") || u.theme || "united";
    p = p.toLowerCase();
    console.log("[strapdown.js] [INFO] Parser and lexer well imported. Origin = " + o + "\n Theme = " + p);
    var d = t.createElement("link");
    d.rel = "stylesheet", d.href = c + "/themes/" + p + ".min.css", t.head.appendChild(d);
    var d = t.createElement("link");
    d.rel = "stylesheet", d.href = c + "/strapdown.min.css", t.head.appendChild(d);
    var d = t.createElement("link");
    d.rel = "stylesheet";
    d.href = c + "/themes/bootstrap-responsive.min.css";
    t.head.appendChild(d);
    if (u.keepicon) {
        console.log("[strapdown.js] [INFO] Keeping the default favicon (not replacing with originBase/favicon.png ...");
    } else {
        var d = t.createElement("link");
        d.rel = "shortcut icon", d.href = c + "/favicon.png", t.head.appendChild(d)
    }
    ;var g = s.textContent || s.innerText, f = t.createElement("div");
    f.className = "container", f.id = "content", s.parentNode.replaceChild(f, s) || t.body.replaceChild(f, s);
    var f = t.createElement("div");
    u.nonavbarfixed ? (f.className = "navbar navbar-static-top", t.body.style = "padding-top: 0px;") : f.className = "navbar navbar-fixed-top";
    if (!a && r) {
        f.innerHTML = '<div class="navbar-inner"> <div class="container"> <div id="headline" class="brand"> </div> <div id="headline-copyrights" class="brand">(<a title="http://lbo.k.vu/md" href="https://lbesson.bitbucket.io/md/index.html?src=strapdown.js">StrapDown.js</a> v0.8, theme <a title="More information on this theme on bootswatch.com!" href="http://bootswatch.com/' + p + '">' + p + "</a>, thanks to <a href=\"https://bitbucket.org/\">BitBucket</a>)</div> <div id=\"headline-squirt\" class=\"brand\"> <a title=\"Quick reader script! Check https://lbesson.bitbucket.io/squirt/ for more details\" href=\"javascript:(function(){sq=window.sq;if(sq&&sq.closed){window.sq.closed&&window.document.dispatchEvent(new Event('squirt.again'));}else{sq=window.sq||{};sq.version='0.4';sq.host='https://lbesson.bitbucket.io/squirt';sq.j=document.createElement('script');sq.j.src=sq.host+'/squirt.js?src=strapdown.js';document.body.appendChild(sq.j);}})();\" >SquirtFR?</a> <a title=\"Import MathJax?\" href=\"javascript:(function(){ var scriptElMathJax = document.createElement('script'); scriptElMathJax.type = 'text/javascript'; scriptElMathJax.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML&amp;locale=fr'; document.head.appendChild(scriptElMathJax); })();\" >MathJax?</a> <a title=\"Fetch a beacon image?\" href=\"javascript:(function(){ var linkEl = document.createElement('img'); linkEl.alt = 'GA|Analytics'; linkEl.style = 'visibility: hidden; display: none;'; linkEl.src = 'https://perso.crans.org/besson/beacon/14/navbar/strapdown.js?pixel'; document.body.appendChild(linkEl); })();\">Beacon?</a></div> </div> </div>", !u.nonnavbar && t.body.insertBefore(f, t.body.firstChild);
        var m = r.innerHTML, b = t.getElementById("headline");
        b && (b.innerHTML = m)
    }
    marked.setOptions({gfm: !0, tables: !0, smartypants: !0, pedantic: u.pedantic || !1});
    var x = marked(g);
    t.getElementById("content").innerHTML = x;
    for (var v = t.getElementsByTagName("code"), h = 0, y = v.length; y > h; h++) {
        var k = v[h], w = k.className;
        k.className = "prettyprint lang-" + w
    }
    prettyPrint();
    for (var S = t.getElementsByTagName("table"), h = 0, y = S.length; y > h; h++) {
        var _ = S[h];
        _.className = "table table-striped table-bordered"
    }
    t.body.style.display = "";
    var C = t.createElement("script");
    if (C.type = "text/x-mathjax-config", C.innerHTML = "MathJax.Hub.Config({ tex2jax: { inlineMath: [['$','$']], displayMath: [ ['$$','$$']], processEscapes: true } });", t.body.appendChild(C), u.mathjax) {
        var C = t.createElement("script");
        C.type = "text/javascript", C.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML&amp;locale=fr", t.head.appendChild(C)
    }
    if (u.beacon) {
        var d = t.createElement("img");
        d.alt = "GA|Analytics", d.style = "visibility: hidden; display: none;", d.src = "https://perso.crans.org/besson/beacon/14/query/strapdown.js?pixel", t.body.appendChild(d)
    }
}(window, document);