/**
 * Analytics service for Yandex Metrika
 * Counter: 36995060
 */

const COUNTER_ID = parseInt(process.env.NEXT_PUBLIC_YANDEX_ID || '36995060')

export const analytics = {
  reachGoal: (goalId: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(COUNTER_ID, 'reachGoal', goalId, params || {})
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] Goal:', goalId, params || '')
      }
    }
  }
}

// B2B Goals
export const b2bGoals = {
  formSubmit: (location?: string) =>
    analytics.reachGoal('b2b_form_submit', { form_location: location || 'page' }),

  ctaOffer: (buttonText?: string) =>
    analytics.reachGoal('b2b_cta_offer', { button_text: buttonText }),

  calcUsed: (from?: string, to?: string) =>
    analytics.reachGoal('b2b_calc_used', { from, to }),

  calcRoute: () =>
    analytics.reachGoal('b2b_calc_route'),

  faqOpened: (question?: string) =>
    analytics.reachGoal('b2b_faq_opened', { question: question?.substring(0, 50) }),

  phoneClick: (phone?: string) =>
    analytics.reachGoal('b2b_phone_click', { phone }),

  messengerClick: (messenger?: string) =>
    analytics.reachGoal('b2b_messenger_click', { messenger }),
}
