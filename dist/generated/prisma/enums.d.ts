export declare const SportCategory: {
    readonly running: "running";
    readonly cycling: "cycling";
    readonly triathlon: "triathlon";
    readonly trekking: "trekking";
    readonly fitness: "fitness";
    readonly racquet: "racquet";
    readonly water: "water";
    readonly adventure: "adventure";
};
export type SportCategory = (typeof SportCategory)[keyof typeof SportCategory];
export declare const EventStatus: {
    readonly upcoming: "upcoming";
    readonly closed: "closed";
    readonly completed: "completed";
    readonly cancelled: "cancelled";
};
export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];
export declare const DifficultyLevel: {
    readonly Beginner: "Beginner";
    readonly Intermediate: "Intermediate";
    readonly Advanced: "Advanced";
    readonly Expert: "Expert";
};
export type DifficultyLevel = (typeof DifficultyLevel)[keyof typeof DifficultyLevel];
export declare const FollowTarget: {
    readonly organizer: "organizer";
    readonly event: "event";
};
export type FollowTarget = (typeof FollowTarget)[keyof typeof FollowTarget];
export declare const ReminderType: {
    readonly registration_open: "registration_open";
    readonly registration_close: "registration_close";
    readonly event_date: "event_date";
};
export type ReminderType = (typeof ReminderType)[keyof typeof ReminderType];
export declare const RequestStatus: {
    readonly pending: "pending";
    readonly approved: "approved";
    readonly rejected: "rejected";
};
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];
export declare const FeedbackType: {
    readonly feature_request: "feature_request";
    readonly general_feedback: "general_feedback";
    readonly bug_report: "bug_report";
};
export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];
export declare const ActivityAction: {
    readonly save: "save";
    readonly follow: "follow";
    readonly calendar_add: "calendar_add";
};
export type ActivityAction = (typeof ActivityAction)[keyof typeof ActivityAction];
