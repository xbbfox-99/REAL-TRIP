import { Day, TripConfig } from './types';
import { TRIPS, JPY_TWD, KRW_TWD, OSAKA_DAYS, JEJU_DAYS } from './tripsData';

export { TRIPS, JPY_TWD, KRW_TWD, OSAKA_DAYS, JEJU_DAYS };

// Default backward compatibility for existing code
export const MEMBERS = TRIPS.osaka.members;
export const MEMBER_COLORS = TRIPS.osaka.memberColors;
export const CATEGORIES = TRIPS.osaka.categories;
export const DAYS: Day[] = OSAKA_DAYS;
