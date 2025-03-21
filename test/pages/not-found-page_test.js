import { fixture, html, expect } from '@open-wc/testing';
import '../../src/pages/not-found-page.js';

suite('NotFoundPage', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<not-found-page></not-found-page>`);
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('not-found-page'));
  });

  test('should render 404 message', async () => {
    const message = element.shadowRoot.querySelector('h2');
    expect(message).to.exist;
    expect(message.textContent).to.include('404');
  });

  test('should render error description', async () => {
    const description = element.shadowRoot.querySelector('p');
    expect(description).to.exist;
    expect(description.textContent).to.include('exist');
  });

  test('should have correct styles applied', async () => {
    const styles = window.getComputedStyle(element);
    expect(styles.display).to.equal('block');
    expect(styles.padding).to.equal('16px');
    expect(styles.textAlign).to.equal('center');
  });
}); 