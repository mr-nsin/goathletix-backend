import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Organizer: "Organizer";
    readonly Event: "Event";
    readonly Profile: "Profile";
    readonly Follow: "Follow";
    readonly UserCalendar: "UserCalendar";
    readonly Reminder: "Reminder";
    readonly EventRequest: "EventRequest";
    readonly UserFeedback: "UserFeedback";
    readonly ActivityLog: "ActivityLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const OrganizerScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly websiteUrl: "websiteUrl";
    readonly logoUrl: "logoUrl";
    readonly isVerified: "isVerified";
    readonly createdAt: "createdAt";
};
export type OrganizerScalarFieldEnum = (typeof OrganizerScalarFieldEnum)[keyof typeof OrganizerScalarFieldEnum];
export declare const EventScalarFieldEnum: {
    readonly id: "id";
    readonly sourceId: "sourceId";
    readonly eventName: "eventName";
    readonly sportType: "sportType";
    readonly eventDate: "eventDate";
    readonly city: "city";
    readonly state: "state";
    readonly venue: "venue";
    readonly distanceOptions: "distanceOptions";
    readonly elevationGain: "elevationGain";
    readonly difficulty: "difficulty";
    readonly priceRange: "priceRange";
    readonly registrationUrl: "registrationUrl";
    readonly organizerId: "organizerId";
    readonly terrain: "terrain";
    readonly isVirtual: "isVirtual";
    readonly status: "status";
    readonly md5PayloadHash: "md5PayloadHash";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];
export declare const ProfileScalarFieldEnum: {
    readonly id: "id";
    readonly fullName: "fullName";
    readonly preferredLocation: "preferredLocation";
    readonly sportsInterest: "sportsInterest";
    readonly onboardingCompleted: "onboardingCompleted";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum];
export declare const FollowScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly targetType: "targetType";
    readonly organizerId: "organizerId";
    readonly eventId: "eventId";
    readonly createdAt: "createdAt";
};
export type FollowScalarFieldEnum = (typeof FollowScalarFieldEnum)[keyof typeof FollowScalarFieldEnum];
export declare const UserCalendarScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly eventId: "eventId";
    readonly createdAt: "createdAt";
};
export type UserCalendarScalarFieldEnum = (typeof UserCalendarScalarFieldEnum)[keyof typeof UserCalendarScalarFieldEnum];
export declare const ReminderScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly eventId: "eventId";
    readonly triggerType: "triggerType";
    readonly isTriggered: "isTriggered";
    readonly createdAt: "createdAt";
};
export type ReminderScalarFieldEnum = (typeof ReminderScalarFieldEnum)[keyof typeof ReminderScalarFieldEnum];
export declare const EventRequestScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly eventName: "eventName";
    readonly sportType: "sportType";
    readonly eventDate: "eventDate";
    readonly city: "city";
    readonly state: "state";
    readonly venue: "venue";
    readonly registrationUrl: "registrationUrl";
    readonly description: "description";
    readonly organizerName: "organizerName";
    readonly status: "status";
    readonly createdAt: "createdAt";
};
export type EventRequestScalarFieldEnum = (typeof EventRequestScalarFieldEnum)[keyof typeof EventRequestScalarFieldEnum];
export declare const UserFeedbackScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly feedbackType: "feedbackType";
    readonly message: "message";
    readonly createdAt: "createdAt";
};
export type UserFeedbackScalarFieldEnum = (typeof UserFeedbackScalarFieldEnum)[keyof typeof UserFeedbackScalarFieldEnum];
export declare const ActivityLogScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly userDisplayName: "userDisplayName";
    readonly actionType: "actionType";
    readonly targetId: "targetId";
    readonly targetName: "targetName";
    readonly createdAt: "createdAt";
};
export type ActivityLogScalarFieldEnum = (typeof ActivityLogScalarFieldEnum)[keyof typeof ActivityLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
