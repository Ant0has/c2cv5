import { ThemeConfig } from "antd";

export const tokens: ThemeConfig = {
  token: {
    fontFamily: 'Inter'
  },
  components: {
    Tabs: {
      inkBarColor: 'var(--orange)',
      itemActiveColor: 'var(--orange)',
      itemHoverColor: 'var(--orange)',
      itemSelectedColor: 'var(--orange)',
      titleFontSizeLG: 18,
      titleFontSizeSM: 18,
      horizontalItemPadding: '0px 0px 16px',
      horizontalMargin: '0 0 32px 0',
      horizontalItemGutter: 48,
    },
    Collapse: {
      contentPadding: '0px',
      headerPadding: '0px'
    },
    Rate: {
      starBg: 'var(--gray)',
      starColor: 'var(--orange)'
    }
  }
}

