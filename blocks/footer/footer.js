import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const text = await resp.text();

  const footerBlock = new DOMParser().parseFromString(text, 'text/html');

  const paragraphs = footerBlock.getElementsByTagName('p');
  // eslint-disable-next-line no-plusplus
  for (let i = paragraphs.length - 1; i >= 0; i--) {
    const p = paragraphs[i];
    const div = footerBlock.createElement('div');
    while (p.firstChild) {
      div.appendChild(p.firstChild);
    }
    p.replaceWith(div);
  }

  const logoUrl = new window.URL(`${window.hlx.codeBasePath}/icons/logo2.png`, window.location.href);

  return `
    <mj-section mj-class="mj-footer"  >
        <mj-column width="100%" align="left">
            <mj-image mj-class="mj-footer-logo" align="left" src="${logoUrl}" />
            <mj-text  color="#959595" font-family="Adobe Clean" font-size="11px">${footerBlock.body.outerHTML}</mj-text>
        </mj-column>
        <mj-column width="0%">
            <mj-spacer mj-class="mj-footer-min-height" />
        </mj-column>        
    </mj-section>
    `;
}
