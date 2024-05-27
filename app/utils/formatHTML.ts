import { replaceAll } from "./replaceAll";

const _formatHTMLToText = (html: string) => {
  const regex = /(<([^>]+)>)/ig;
  return replaceAll(html.replace(regex, ''), '&nbsp;', '');
}

export const _handleRegexHTML = (html: string) => {
  const htmlTem = html ? replaceAll(html, '<br />', '\n') : '';
  return htmlTem ? _formatHTMLToText(htmlTem) : '';
}