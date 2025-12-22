class RoutesConfig {
  private readonly ABOUT = '/about';
  private readonly CONTACTS = '/contacts';
  private readonly TERMS = '/terms';
  private readonly PRIVACY_POLICY = '/privacy-policy';
  private readonly CANCELLATION = '/cancellation';
  private readonly FOR_BUSINESS = '/dlya-biznesa';

    public getAboutRoute(): string {
        return this.ABOUT;
    }

    public getContactsRoute(): string {
        return this.CONTACTS;
    }

    public getTermsRoute(): string {
        return this.TERMS;
    }

    public getPrivacyPolicyRoute(): string {
        return this.PRIVACY_POLICY;
    }

    public getCancellationRoute(): string {
        return this.CANCELLATION;
    }

    public getForBusinessRoute(): string {
        return this.FOR_BUSINESS;
    }
}

export const routesConfig = new RoutesConfig();
