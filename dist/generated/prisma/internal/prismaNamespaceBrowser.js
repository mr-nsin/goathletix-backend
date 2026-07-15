"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.ActivityLogScalarFieldEnum = exports.UserFeedbackScalarFieldEnum = exports.EventRequestScalarFieldEnum = exports.ReminderScalarFieldEnum = exports.UserCalendarScalarFieldEnum = exports.FollowScalarFieldEnum = exports.ProfileScalarFieldEnum = exports.EventScalarFieldEnum = exports.OrganizerScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Organizer: 'Organizer',
    Event: 'Event',
    Profile: 'Profile',
    Follow: 'Follow',
    UserCalendar: 'UserCalendar',
    Reminder: 'Reminder',
    EventRequest: 'EventRequest',
    UserFeedback: 'UserFeedback',
    ActivityLog: 'ActivityLog'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.OrganizerScalarFieldEnum = {
    id: 'id',
    name: 'name',
    websiteUrl: 'websiteUrl',
    logoUrl: 'logoUrl',
    isVerified: 'isVerified',
    createdAt: 'createdAt'
};
exports.EventScalarFieldEnum = {
    id: 'id',
    sourceId: 'sourceId',
    eventName: 'eventName',
    sportType: 'sportType',
    eventDate: 'eventDate',
    city: 'city',
    state: 'state',
    venue: 'venue',
    distanceOptions: 'distanceOptions',
    elevationGain: 'elevationGain',
    difficulty: 'difficulty',
    priceRange: 'priceRange',
    registrationUrl: 'registrationUrl',
    organizerId: 'organizerId',
    terrain: 'terrain',
    isVirtual: 'isVirtual',
    status: 'status',
    md5PayloadHash: 'md5PayloadHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProfileScalarFieldEnum = {
    id: 'id',
    fullName: 'fullName',
    preferredLocation: 'preferredLocation',
    sportsInterest: 'sportsInterest',
    onboardingCompleted: 'onboardingCompleted',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.FollowScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    targetType: 'targetType',
    organizerId: 'organizerId',
    eventId: 'eventId',
    createdAt: 'createdAt'
};
exports.UserCalendarScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    eventId: 'eventId',
    createdAt: 'createdAt'
};
exports.ReminderScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    eventId: 'eventId',
    triggerType: 'triggerType',
    isTriggered: 'isTriggered',
    createdAt: 'createdAt'
};
exports.EventRequestScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    eventName: 'eventName',
    sportType: 'sportType',
    eventDate: 'eventDate',
    city: 'city',
    state: 'state',
    venue: 'venue',
    registrationUrl: 'registrationUrl',
    description: 'description',
    organizerName: 'organizerName',
    status: 'status',
    createdAt: 'createdAt'
};
exports.UserFeedbackScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    feedbackType: 'feedbackType',
    message: 'message',
    createdAt: 'createdAt'
};
exports.ActivityLogScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    userDisplayName: 'userDisplayName',
    actionType: 'actionType',
    targetId: 'targetId',
    targetName: 'targetName',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map