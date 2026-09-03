import { getAnalyticsAdapter, type AnalyticsEventName, type AnalyticsEventPayload } from "./adapter";

export function trackAnalyticsEvent(
  event: AnalyticsEventName,
  payload?: AnalyticsEventPayload,
) {
  getAnalyticsAdapter().track(event, payload);
}
