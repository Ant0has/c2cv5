class RoutesConfig {
  private readonly ABOUT = '/about';
  private readonly CONTACTS = '/contacts';
  private readonly TERMS = '/terms';
  private readonly PRIVACY_POLICY = '/privacy-policy';
  private readonly CANCELLATION = '/cancellation';
  private readonly FOR_BUSINESS = '/dlya-biznesa';
  private readonly OFERTA = '/oferta';
  private readonly DOSTAVKA_GRUZOV = '/dlya-biznesa/dostavka-gruzov';
  private readonly KORPORATIVNOE_TAKSI = '/dlya-biznesa/korporativnoe-taksi-mezhgorod';
  private readonly TRANSFER_MEROPRIYATIY = '/dlya-biznesa/transfer-dlya-meropriyatiy';
  private readonly PEREVOZKA_VAKHTOVYH = '/dlya-biznesa/perevozka-vakhtovyh-rabochih';
  private readonly MEDICINSKIJ_TRANSFER = '/dlya-biznesa/medicinskij-transfer';

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

    public getDostavkaGruzovRoute(): string {
        return this.DOSTAVKA_GRUZOV;
    }

    public getKorporativnoeTaksiRoute(): string {
        return this.KORPORATIVNOE_TAKSI;
    }

    public getTransferMeropriyatiyRoute(): string {
        return this.TRANSFER_MEROPRIYATIY;
    }

    public getPerevozkaVakhtovyhRoute(): string {
        return this.PEREVOZKA_VAKHTOVYH;
    }

    public getMedicinskijTransferRoute(): string {
        return this.MEDICINSKIJ_TRANSFER;
    }

    public getOfertaRoute(): string {
        return this.OFERTA;
    }


}

export const routesConfig = new RoutesConfig();
