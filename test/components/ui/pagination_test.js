import { fixture, html, expect } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/components/ui/pagination.js';

suite('Pagination', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<app-pagination></app-pagination>`);
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('app-pagination'));
  });

  test('should initialize with default values', () => {
    expect(element.currentPage).to.equal(1);
    expect(element.totalPages).to.equal(1);
    expect(element.visiblePageCount).to.equal(5);
  });

  test('should render pagination buttons', async () => {
    element.totalPages = 10;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll('.page-link');
    expect(buttons.length).to.equal(7);
  });

  test('should show correct visible pages', async () => {
    element.totalPages = 10;
    element.currentPage = 5;
    await element.updateComplete;

    const pageButtons = Array.from(element.shadowRoot.querySelectorAll('.page-link:not([aria-label])'));
    const pageNumbers = pageButtons.map(button => parseInt(button.textContent.trim()));

    expect(pageNumbers).to.deep.equal([3, 4, 5, 6, 7]);
  });

  test('should disable previous button on first page', async () => {
    element.totalPages = 10;
    element.currentPage = 1;
    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.page-link[aria-label="Previous"]');
    expect(prevButton.classList.contains('disabled')).to.be.true;
  });

  test('should disable next button on last page', async () => {
    element.totalPages = 10;
    element.currentPage = 10;
    await element.updateComplete;

    const nextButton = element.shadowRoot.querySelector('.page-link[aria-label="Next"]');
    expect(nextButton.classList.contains('disabled')).to.be.true;
  });

  test('should show active state for current page', async () => {
    element.totalPages = 10;
    element.currentPage = 3;
    await element.updateComplete;

    const activeButton = element.shadowRoot.querySelector('.page-link.active');
    expect(activeButton.textContent.trim()).to.equal('3');
  });

  test('should navigate to previous page', async () => {
    const eventSpy = spy();
    element.addEventListener('page-changed', eventSpy);

    element.totalPages = 10;
    element.currentPage = 5;
    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.page-link[aria-label="Previous"]');
    prevButton.click();
    await element.updateComplete;

    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail).to.deep.equal({ page: 4 });
  });

  test('should navigate to next page', async () => {
    const eventSpy = spy();
    element.addEventListener('page-changed', eventSpy);

    element.totalPages = 10;
    element.currentPage = 5;
    await element.updateComplete;

    const nextButton = element.shadowRoot.querySelector('.page-link[aria-label="Next"]');
    nextButton.click();
    await element.updateComplete;

    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail).to.deep.equal({ page: 6 });
  });

  test('should not emit event when clicking disabled buttons', async () => {
    const eventSpy = spy();
    element.addEventListener('page-changed', eventSpy);

    element.totalPages = 10;
    element.currentPage = 1;
    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.page-link[aria-label="Previous"]');
    prevButton.click();
    await element.updateComplete;

    expect(eventSpy).to.not.have.been.called;
  });

  test('should handle edge case with less pages than visible count', async () => {
    element.totalPages = 3;
    element.visiblePageCount = 5;
    await element.updateComplete;

    const pageButtons = element.shadowRoot.querySelectorAll('.page-link:not([aria-label])');
    expect(pageButtons.length).to.equal(3);
  });

  test('should adjust visible pages at the end', async () => {
    element.totalPages = 10;
    element.currentPage = 9;
    await element.updateComplete;

    const pageButtons = Array.from(element.shadowRoot.querySelectorAll('.page-link:not([aria-label])'));
    const pageNumbers = pageButtons.map(button => parseInt(button.textContent.trim()));

    expect(pageNumbers).to.deep.equal([6, 7, 8, 9, 10]);
  });
}); 