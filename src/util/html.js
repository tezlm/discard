// a lot (but not all) of this was copied from cinny
import linkifyHtml from "linkifyjs/html";
import sanitizeHtml from "sanitize-html";
import { parseMxc } from "./content.js";

const permittedHtmlTagsInline = [
  "font", "del", /*"p", */ "a", "sup", "sub", "b", "i",
	"u", "strong", "em", "strike", "code", "br", "span",
];

const permittedHtmlTags = [
	...permittedHtmlTagsInline,
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "ul", "ol",
  "li", "hr", "div", "table", "thead", "tbody", "tr", "th",
  "td", "caption", "pre", "img", "details", "summary",
];

const urlSchemes = ["https", "http", "ftp", "mailto", "magnet"];

const permittedTagToAttributes = {
  font: ["style", "data-mx-bg-color", "data-mx-color", "color"],
  span: ["style", "data-mx-bg-color", "data-mx-color", "data-mx-spoiler", "data-mx-maths", "data-mx-ping"],
  div: ["data-mx-maths"],
  a: ["name", "target", "href", "rel"],
  img: ["width", "height", "alt", "title", "src", "data-mx-emoticon"],
  o: ["start"],
  code: ["class"],
};

function transformFontSpanTags(tagName, attribs) {
	return {
		tagName,
		attribs: {
			...attribs,
			style: `background-color: ${attribs["data-mx-bg-color"]}; color: ${attribs["data-mx-color"]}`,
		},
	};
}

function transformATag(tagName, attribs) {
  const link = decodeURIComponent(attribs.href).match(/^https?:\/\/matrix.to\/#\/(@.+:.+)/);
  if (!link) return { tagName, attribs };
  const [_, userId] = link;
  const pill = {
    tagName: "span",
		// text: name ? ("@" + name) : userId,
    attribs: {
			...attribs,
			"data-mx-ping": userId,
    },
  };
  return pill;
}

function transformImgTag(tagName, attribs) {
	const { src } = attribs;
	if (!src.startsWith("mxc://")) return {};
	return {
		tagName,
		attribs: {
			...attribs,
			src: parseMxc(src),
		},
	};
}

const sanitizeOpts = {
	allowedTags: permittedHtmlTags,
	allowedAttributes: permittedTagToAttributes,
	disallowedTagsMode: "discard",
	allowedSchemes: urlSchemes,
	allowedSchemesByTag: {
		a: urlSchemes,
	},
	allowedSchemesAppliedToAttributes: ["href"],
	allowProtocolRelative: false,
	allowedClasses: {
		code: ["language-*"],
	},
	allowedStyles: {
		"*": {
			color: [/^#(?:[0-9a-fA-F]{3}){1,2}$/],
			"background-color": [/^#(?:[0-9a-fA-F]{3}){1,2}$/],
		},
	},
	transformTags: {
		font: transformFontSpanTags,
		span: transformFontSpanTags,
		a: transformATag,
		img: transformImgTag,
		p: "span",
	},
	nonTextTags: ["style", "script", "textarea", "option", "noscript", "mx-reply"],
	nestingLimit: 100,
};

const sanitizeOptsInline = {
	...sanitizeOpts,
	allowedTags: permittedHtmlTagsInline,
	transformTags: {
		font: transformFontSpanTags,
		span: transformFontSpanTags,
		a: transformATag,
		p: "span",
	},
}

export function parseHtml(html, opts = { linkify: true, sanitize: true, inline: false }) {
	if (opts.sanitize) html = sanitizeHtml(html, opts.inline ? sanitizeOptsInline : sanitizeOpts);
	if (opts.linkify)  html = linkifyHtml(html, { ignoreTags: ["pre", "code"] });
	return html;
}
