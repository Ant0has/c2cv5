'use client'

import { ReactNode, useEffect, useRef } from 'react';
import { analytics } from '@/shared/services/analytics.service';

type Context = { from: string; to: string; routeSlug?: string };
type MountModule = { mount: (host: HTMLElement, context: Context & { signal: AbortSignal; onEvent: (name: string, values: Record<string, string>) => void }) => Promise<() => void> };
const GOALS = new Set(['view', 'quote_success', 'quote_error', 'order_open', 'order_success', 'order_error', 'fallback']);

/** The legacy calculator remains in the light DOM for a fail-open rollback. */
export default function TripConstructor({ context, children, id }: { context: Context; children: ReactNode; id?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const contextKey = JSON.stringify(context);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let stopped = false, mounting = false, dispose: (() => void) | undefined;
    const controller = new AbortController();
    const onEvent = (name: string, values: Record<string, string> = {}) => {
      if (GOALS.has(name)) analytics.reachGoal('constructor_' + name, values);
    };
    const restore = () => { dispose?.(); dispose = undefined; element.removeAttribute('data-c2c-constructor'); };
    const check = async () => {
      if (stopped || mounting || document.visibilityState === 'hidden') return;
      mounting = true;
      try {
        const response = await fetch('/trip-constructor/api/config', { cache: 'no-store', signal: AbortSignal.timeout(7000) });
        if (!response.ok) throw Error('Configuration unavailable');
        const config = await response.json();
        if (stopped) return;
        if (config.enabled !== true) { restore(); return; }
        if (!dispose) {
          const url = '/trip-constructor-widget/v2/mount.mjs';
          const module: MountModule = await import(/* webpackIgnore: true */ url);
          if (stopped) return;
          const cleanup = await module.mount(element, { ...JSON.parse(contextKey), signal: controller.signal, onEvent });
          if (stopped) { cleanup(); return; }
          dispose = cleanup;
          element.setAttribute('data-c2c-constructor', 'ready');
        }
      } catch {
        // A transient config fetch failure must not erase an already filled form.
        if (!dispose && !stopped) onEvent('fallback');
      } finally { mounting = false; }
    };
    check();
    const timer = window.setInterval(check, 30000);
    document.addEventListener('visibilitychange', check);
    return () => { stopped = true; controller.abort(); clearInterval(timer); document.removeEventListener('visibilitychange', check); restore(); };
  }, [contextKey]);
  return <div id={id} ref={host} data-trip-constructor="v2" style={{ minWidth: 0, scrollMarginTop: 24 }}>{children}</div>;
}
