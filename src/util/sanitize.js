// a lot (but not all) of this was copied from cinny
import sanitizeHtml from "sanitize-html";

const permittedHtmlTags = [
  "font", "del", "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "p", "a", "ul", "ol", "sup", "sub",
  "li", "b", "i", "u", "strong", "em", "strike", "code",
  "hr", "br", "div", "table", "thead", "tbody", "tr", "th",
  "td", "caption", "pre", "span", "img", "details", "summary",
];

const urlSchemes = ["https", "http", "ftp", "mailto", "magnet"];

const permittedTagToAttributes = {
  font: ["style", "data-mx-bg-color", "data-mx-color", "color"],
  span: ["style", "data-mx-bg-color", "data-mx-color", "data-mx-spoiler", "data-mx-maths", "data-mx-pill", "data-mx-ping"],
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

function transformImgTag(tagName, attribs) {
	const { src } = attribs;
	return {
		tagName,
		attribs: {
			...attribs,
			src: src.startsWith("mxc://") ? state.client.mxcUrlToHttp(src) : src,
		},
	};
}

export function sanitizeMatrixHtml(body) {
	return sanitizeHtml(body, {
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
			// a: transformATag,
			img: transformImgTag,
		},
		nonTextTags: ["style", "script", "textarea", "option", "noscript", "mx-reply"],
		nestingLimit: 100,
	});
}
