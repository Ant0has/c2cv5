import { ThemeConfig } from "antd";

export const tokens: ThemeConfig = {
  token: {
    fontFamily: 'Inter',
    colorPrimary: '#ff9c00',
    colorError: '#ff9c00',
    borderRadius: 16,
    // colorBorder: 'transparent'
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
    },
    Form: {
      itemMarginBottom: 32,
      verticalLabelPadding: '0px 0px 16px',
      labelRequiredMarkColor: 'var(--orange)'
    },
    Input: {
      activeBg: 'var(--light-gray)',
      activeBorderColor: 'none',
      activeShadow: 'none',
      errorActiveShadow: 'none',
      hoverBg: 'none',
      hoverBorderColor: 'none',
      warningActiveShadow: 'none',
      inputFontSize: 16,
      paddingBlock: 20,
      paddingInline: 24
    },
    Pagination: {
      itemSize: 22,
      itemBg: 'var(--light-gray)',
      itemActiveBg: 'var(--orange)',
      itemInputBg: 'red'
    },
    DatePicker: {
      activeBg: 'var(--light-gray)',
      activeShadow: 'none',
      hoverBg: 'var(--light-gray)',
      errorActiveShadow: 'none',
      inputFontSize: 16,
      activeBorderColor: 'none'
    },
  }
}

