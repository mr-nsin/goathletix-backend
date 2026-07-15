"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityAction = exports.FeedbackType = exports.RequestStatus = exports.ReminderType = exports.FollowTarget = exports.DifficultyLevel = exports.EventStatus = exports.SportCategory = void 0;
exports.SportCategory = {
    running: 'running',
    cycling: 'cycling',
    triathlon: 'triathlon',
    trekking: 'trekking',
    fitness: 'fitness',
    racquet: 'racquet',
    water: 'water',
    adventure: 'adventure'
};
exports.EventStatus = {
    upcoming: 'upcoming',
    closed: 'closed',
    completed: 'completed',
    cancelled: 'cancelled'
};
exports.DifficultyLevel = {
    Beginner: 'Beginner',
    Intermediate: 'Intermediate',
    Advanced: 'Advanced',
    Expert: 'Expert'
};
exports.FollowTarget = {
    organizer: 'organizer',
    event: 'event'
};
exports.ReminderType = {
    registration_open: 'registration_open',
    registration_close: 'registration_close',
    event_date: 'event_date'
};
exports.RequestStatus = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected'
};
exports.FeedbackType = {
    feature_request: 'feature_request',
    general_feedback: 'general_feedback',
    bug_report: 'bug_report'
};
exports.ActivityAction = {
    save: 'save',
    follow: 'follow',
    calendar_add: 'calendar_add'
};
//# sourceMappingURL=enums.js.map