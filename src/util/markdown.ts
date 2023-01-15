import { marked } from "marked";

// from cinny: i need to adapt this to marked
// const rules = {
//   ...defaultRules,
  // userMention: {
  //   order: defaultRules.em.order - 0.9,
  //   match: /@[a-z0-9-_/]+:[a-z0-9.-]+/ig,
  //   parse: (capture, _, { room }) => ({
  //     type: 'mention',
  //     content: room.members.get(capture[0])?.name ? `@${room.membrs.get(capture[0]).name}` : capture[0],
  //     id: capture[1],
  //   }),
  // },
  // roomMention: {
  //   order: defaultRules.em.order - 0.8,
  //   match: /#[a-z0-9-_/]+:[a-z0-9.-]+/ig,
  //   parse: (capture) => ({
  //     type: 'mention',
  //     content: capture[0],
  //     id: capture[0],
  //   }),
  // },
  // mention: {
  //   plain: (node, _, state) => (state.kind === 'edit' ? node.id : node.content),
  //   html: (node) => htmlTag('a', sanitizeText(node.content), {
  //     href: `https://matrix.to/#/${encodeURIComponent(node.id)}`,
  //   }),
  // },
// };

// TEMP: this is for debugging
globalThis.marked = marked;

export function render(str: string): string {
  console.log(str);
  console.log(marked(str).trim());
  return marked(str)
    // .trim()
    // .replace(/\n/g, "<br>");
}
