import { DavisWizardPage } from './app.po';

describe('wizard App', function() {
  let page: DavisWizardPage;

  beforeEach(() => {
    page = new DavisWizardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
