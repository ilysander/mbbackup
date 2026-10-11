import AnalyticsEvent from './AnalyticsEvent';
import AnalyticsLabels from './AnalyticsLabels';
import ScreensLabels from './ScreensLabels';
import ScreensIds from './ScreensIds';
import ScreensClass from './ScreensClass';
import { ScreensEvents } from './ScreenEvents';

/**
 * Este tipo debe usarse cuando se considere que `accessibilityLabel`
 * deba ir siempre si como analyticsEvent
 */

export type AnalyticsLabelsType = keyof typeof AnalyticsLabels;
export type ScreensLabelsType = keyof typeof ScreensLabels;
export type ScreensClassType = keyof typeof ScreensClass;
export type ScreensIdsType = keyof typeof ScreensIds;
export type EventLabelsType = keyof typeof ScreensEvents;

export { AnalyticsLabels as A, ScreensEvents as K, AnalyticsEvent, ScreensLabels, ScreensIds };
