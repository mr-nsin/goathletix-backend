import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProfileModel = runtime.Types.Result.DefaultSelection<Prisma.$ProfilePayload>;
export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null;
    _min: ProfileMinAggregateOutputType | null;
    _max: ProfileMaxAggregateOutputType | null;
};
export type ProfileMinAggregateOutputType = {
    id: string | null;
    fullName: string | null;
    preferredLocation: string | null;
    onboardingCompleted: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ProfileMaxAggregateOutputType = {
    id: string | null;
    fullName: string | null;
    preferredLocation: string | null;
    onboardingCompleted: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ProfileCountAggregateOutputType = {
    id: number;
    fullName: number;
    preferredLocation: number;
    sportsInterest: number;
    onboardingCompleted: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ProfileMinAggregateInputType = {
    id?: true;
    fullName?: true;
    preferredLocation?: true;
    onboardingCompleted?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ProfileMaxAggregateInputType = {
    id?: true;
    fullName?: true;
    preferredLocation?: true;
    onboardingCompleted?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ProfileCountAggregateInputType = {
    id?: true;
    fullName?: true;
    preferredLocation?: true;
    sportsInterest?: true;
    onboardingCompleted?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ProfileAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[];
    cursor?: Prisma.ProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProfileCountAggregateInputType;
    _min?: ProfileMinAggregateInputType;
    _max?: ProfileMaxAggregateInputType;
};
export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
    [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProfile[P]> : Prisma.GetScalarType<T[P], AggregateProfile[P]>;
};
export type ProfileGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithAggregationInput | Prisma.ProfileOrderByWithAggregationInput[];
    by: Prisma.ProfileScalarFieldEnum[] | Prisma.ProfileScalarFieldEnum;
    having?: Prisma.ProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProfileCountAggregateInputType | true;
    _min?: ProfileMinAggregateInputType;
    _max?: ProfileMaxAggregateInputType;
};
export type ProfileGroupByOutputType = {
    id: string;
    fullName: string | null;
    preferredLocation: string | null;
    sportsInterest: $Enums.SportCategory[];
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: ProfileCountAggregateOutputType | null;
    _min: ProfileMinAggregateOutputType | null;
    _max: ProfileMaxAggregateOutputType | null;
};
export type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProfileGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProfileGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProfileGroupByOutputType[P]>;
}>>;
export type ProfileWhereInput = {
    AND?: Prisma.ProfileWhereInput | Prisma.ProfileWhereInput[];
    OR?: Prisma.ProfileWhereInput[];
    NOT?: Prisma.ProfileWhereInput | Prisma.ProfileWhereInput[];
    id?: Prisma.UuidFilter<"Profile"> | string;
    fullName?: Prisma.StringNullableFilter<"Profile"> | string | null;
    preferredLocation?: Prisma.StringNullableFilter<"Profile"> | string | null;
    sportsInterest?: Prisma.EnumSportCategoryNullableListFilter<"Profile">;
    onboardingCompleted?: Prisma.BoolFilter<"Profile"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Profile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Profile"> | Date | string;
    follows?: Prisma.FollowListRelationFilter;
    userCalendars?: Prisma.UserCalendarListRelationFilter;
    reminders?: Prisma.ReminderListRelationFilter;
    eventRequests?: Prisma.EventRequestListRelationFilter;
    userFeedbacks?: Prisma.UserFeedbackListRelationFilter;
    activityLogs?: Prisma.ActivityLogListRelationFilter;
};
export type ProfileOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredLocation?: Prisma.SortOrderInput | Prisma.SortOrder;
    sportsInterest?: Prisma.SortOrder;
    onboardingCompleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    follows?: Prisma.FollowOrderByRelationAggregateInput;
    userCalendars?: Prisma.UserCalendarOrderByRelationAggregateInput;
    reminders?: Prisma.ReminderOrderByRelationAggregateInput;
    eventRequests?: Prisma.EventRequestOrderByRelationAggregateInput;
    userFeedbacks?: Prisma.UserFeedbackOrderByRelationAggregateInput;
    activityLogs?: Prisma.ActivityLogOrderByRelationAggregateInput;
};
export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ProfileWhereInput | Prisma.ProfileWhereInput[];
    OR?: Prisma.ProfileWhereInput[];
    NOT?: Prisma.ProfileWhereInput | Prisma.ProfileWhereInput[];
    fullName?: Prisma.StringNullableFilter<"Profile"> | string | null;
    preferredLocation?: Prisma.StringNullableFilter<"Profile"> | string | null;
    sportsInterest?: Prisma.EnumSportCategoryNullableListFilter<"Profile">;
    onboardingCompleted?: Prisma.BoolFilter<"Profile"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Profile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Profile"> | Date | string;
    follows?: Prisma.FollowListRelationFilter;
    userCalendars?: Prisma.UserCalendarListRelationFilter;
    reminders?: Prisma.ReminderListRelationFilter;
    eventRequests?: Prisma.EventRequestListRelationFilter;
    userFeedbacks?: Prisma.UserFeedbackListRelationFilter;
    activityLogs?: Prisma.ActivityLogListRelationFilter;
}, "id">;
export type ProfileOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredLocation?: Prisma.SortOrderInput | Prisma.SortOrder;
    sportsInterest?: Prisma.SortOrder;
    onboardingCompleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ProfileCountOrderByAggregateInput;
    _max?: Prisma.ProfileMaxOrderByAggregateInput;
    _min?: Prisma.ProfileMinOrderByAggregateInput;
};
export type ProfileScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProfileScalarWhereWithAggregatesInput | Prisma.ProfileScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProfileScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProfileScalarWhereWithAggregatesInput | Prisma.ProfileScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Profile"> | string;
    fullName?: Prisma.StringNullableWithAggregatesFilter<"Profile"> | string | null;
    preferredLocation?: Prisma.StringNullableWithAggregatesFilter<"Profile"> | string | null;
    sportsInterest?: Prisma.EnumSportCategoryNullableListFilter<"Profile">;
    onboardingCompleted?: Prisma.BoolWithAggregatesFilter<"Profile"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Profile"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Profile"> | Date | string;
};
export type ProfileCreateInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutProfileInput;
};
export type ProfileUncheckedCreateInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowUncheckedCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarUncheckedCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderUncheckedCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestUncheckedCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutProfileInput;
};
export type ProfileUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutProfileNestedInput;
};
export type ProfileUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUncheckedUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUncheckedUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUncheckedUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUncheckedUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutProfileNestedInput;
};
export type ProfileCreateManyInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ProfileUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProfileUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EnumSportCategoryNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel> | null;
    has?: $Enums.SportCategory | Prisma.EnumSportCategoryFieldRefInput<$PrismaModel> | null;
    hasEvery?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    hasSome?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type ProfileCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    preferredLocation?: Prisma.SortOrder;
    sportsInterest?: Prisma.SortOrder;
    onboardingCompleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProfileMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    preferredLocation?: Prisma.SortOrder;
    onboardingCompleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProfileMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    preferredLocation?: Prisma.SortOrder;
    onboardingCompleted?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProfileScalarRelationFilter = {
    is?: Prisma.ProfileWhereInput;
    isNot?: Prisma.ProfileWhereInput;
};
export type ProfileNullableScalarRelationFilter = {
    is?: Prisma.ProfileWhereInput | null;
    isNot?: Prisma.ProfileWhereInput | null;
};
export type ProfileCreatesportsInterestInput = {
    set: $Enums.SportCategory[];
};
export type ProfileUpdatesportsInterestInput = {
    set?: $Enums.SportCategory[];
    push?: $Enums.SportCategory | $Enums.SportCategory[];
};
export type ProfileCreateNestedOneWithoutFollowsInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutFollowsInput, Prisma.ProfileUncheckedCreateWithoutFollowsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutFollowsInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneRequiredWithoutFollowsNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutFollowsInput, Prisma.ProfileUncheckedCreateWithoutFollowsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutFollowsInput;
    upsert?: Prisma.ProfileUpsertWithoutFollowsInput;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutFollowsInput, Prisma.ProfileUpdateWithoutFollowsInput>, Prisma.ProfileUncheckedUpdateWithoutFollowsInput>;
};
export type ProfileCreateNestedOneWithoutUserCalendarsInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutUserCalendarsInput, Prisma.ProfileUncheckedCreateWithoutUserCalendarsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutUserCalendarsInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneRequiredWithoutUserCalendarsNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutUserCalendarsInput, Prisma.ProfileUncheckedCreateWithoutUserCalendarsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutUserCalendarsInput;
    upsert?: Prisma.ProfileUpsertWithoutUserCalendarsInput;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutUserCalendarsInput, Prisma.ProfileUpdateWithoutUserCalendarsInput>, Prisma.ProfileUncheckedUpdateWithoutUserCalendarsInput>;
};
export type ProfileCreateNestedOneWithoutRemindersInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutRemindersInput, Prisma.ProfileUncheckedCreateWithoutRemindersInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutRemindersInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneRequiredWithoutRemindersNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutRemindersInput, Prisma.ProfileUncheckedCreateWithoutRemindersInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutRemindersInput;
    upsert?: Prisma.ProfileUpsertWithoutRemindersInput;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutRemindersInput, Prisma.ProfileUpdateWithoutRemindersInput>, Prisma.ProfileUncheckedUpdateWithoutRemindersInput>;
};
export type ProfileCreateNestedOneWithoutEventRequestsInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutEventRequestsInput, Prisma.ProfileUncheckedCreateWithoutEventRequestsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutEventRequestsInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneWithoutEventRequestsNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutEventRequestsInput, Prisma.ProfileUncheckedCreateWithoutEventRequestsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutEventRequestsInput;
    upsert?: Prisma.ProfileUpsertWithoutEventRequestsInput;
    disconnect?: Prisma.ProfileWhereInput | boolean;
    delete?: Prisma.ProfileWhereInput | boolean;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutEventRequestsInput, Prisma.ProfileUpdateWithoutEventRequestsInput>, Prisma.ProfileUncheckedUpdateWithoutEventRequestsInput>;
};
export type ProfileCreateNestedOneWithoutUserFeedbacksInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutUserFeedbacksInput, Prisma.ProfileUncheckedCreateWithoutUserFeedbacksInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutUserFeedbacksInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneWithoutUserFeedbacksNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutUserFeedbacksInput, Prisma.ProfileUncheckedCreateWithoutUserFeedbacksInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutUserFeedbacksInput;
    upsert?: Prisma.ProfileUpsertWithoutUserFeedbacksInput;
    disconnect?: Prisma.ProfileWhereInput | boolean;
    delete?: Prisma.ProfileWhereInput | boolean;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutUserFeedbacksInput, Prisma.ProfileUpdateWithoutUserFeedbacksInput>, Prisma.ProfileUncheckedUpdateWithoutUserFeedbacksInput>;
};
export type ProfileCreateNestedOneWithoutActivityLogsInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutActivityLogsInput, Prisma.ProfileUncheckedCreateWithoutActivityLogsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutActivityLogsInput;
    connect?: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateOneWithoutActivityLogsNestedInput = {
    create?: Prisma.XOR<Prisma.ProfileCreateWithoutActivityLogsInput, Prisma.ProfileUncheckedCreateWithoutActivityLogsInput>;
    connectOrCreate?: Prisma.ProfileCreateOrConnectWithoutActivityLogsInput;
    upsert?: Prisma.ProfileUpsertWithoutActivityLogsInput;
    disconnect?: Prisma.ProfileWhereInput | boolean;
    delete?: Prisma.ProfileWhereInput | boolean;
    connect?: Prisma.ProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProfileUpdateToOneWithWhereWithoutActivityLogsInput, Prisma.ProfileUpdateWithoutActivityLogsInput>, Prisma.ProfileUncheckedUpdateWithoutActivityLogsInput>;
};
export type ProfileCreateWithoutFollowsInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userCalendars?: Prisma.UserCalendarCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutProfileInput;
};
export type ProfileUncheckedCreateWithoutFollowsInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userCalendars?: Prisma.UserCalendarUncheckedCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderUncheckedCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestUncheckedCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutProfileInput;
};
export type ProfileCreateOrConnectWithoutFollowsInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutFollowsInput, Prisma.ProfileUncheckedCreateWithoutFollowsInput>;
};
export type ProfileUpsertWithoutFollowsInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutFollowsInput, Prisma.ProfileUncheckedUpdateWithoutFollowsInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutFollowsInput, Prisma.ProfileUncheckedCreateWithoutFollowsInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutFollowsInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutFollowsInput, Prisma.ProfileUncheckedUpdateWithoutFollowsInput>;
};
export type ProfileUpdateWithoutFollowsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userCalendars?: Prisma.UserCalendarUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutProfileNestedInput;
};
export type ProfileUncheckedUpdateWithoutFollowsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userCalendars?: Prisma.UserCalendarUncheckedUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUncheckedUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUncheckedUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutProfileNestedInput;
};
export type ProfileCreateWithoutUserCalendarsInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutProfileInput;
};
export type ProfileUncheckedCreateWithoutUserCalendarsInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowUncheckedCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderUncheckedCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestUncheckedCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutProfileInput;
};
export type ProfileCreateOrConnectWithoutUserCalendarsInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutUserCalendarsInput, Prisma.ProfileUncheckedCreateWithoutUserCalendarsInput>;
};
export type ProfileUpsertWithoutUserCalendarsInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutUserCalendarsInput, Prisma.ProfileUncheckedUpdateWithoutUserCalendarsInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutUserCalendarsInput, Prisma.ProfileUncheckedCreateWithoutUserCalendarsInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutUserCalendarsInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutUserCalendarsInput, Prisma.ProfileUncheckedUpdateWithoutUserCalendarsInput>;
};
export type ProfileUpdateWithoutUserCalendarsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutProfileNestedInput;
};
export type ProfileUncheckedUpdateWithoutUserCalendarsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUncheckedUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUncheckedUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUncheckedUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutProfileNestedInput;
};
export type ProfileCreateWithoutRemindersInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutProfileInput;
};
export type ProfileUncheckedCreateWithoutRemindersInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowUncheckedCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarUncheckedCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestUncheckedCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutProfileInput;
};
export type ProfileCreateOrConnectWithoutRemindersInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutRemindersInput, Prisma.ProfileUncheckedCreateWithoutRemindersInput>;
};
export type ProfileUpsertWithoutRemindersInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutRemindersInput, Prisma.ProfileUncheckedUpdateWithoutRemindersInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutRemindersInput, Prisma.ProfileUncheckedCreateWithoutRemindersInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutRemindersInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutRemindersInput, Prisma.ProfileUncheckedUpdateWithoutRemindersInput>;
};
export type ProfileUpdateWithoutRemindersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutProfileNestedInput;
};
export type ProfileUncheckedUpdateWithoutRemindersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUncheckedUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUncheckedUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUncheckedUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutProfileNestedInput;
};
export type ProfileCreateWithoutEventRequestsInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutProfileInput;
};
export type ProfileUncheckedCreateWithoutEventRequestsInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowUncheckedCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarUncheckedCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderUncheckedCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutProfileInput;
};
export type ProfileCreateOrConnectWithoutEventRequestsInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutEventRequestsInput, Prisma.ProfileUncheckedCreateWithoutEventRequestsInput>;
};
export type ProfileUpsertWithoutEventRequestsInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutEventRequestsInput, Prisma.ProfileUncheckedUpdateWithoutEventRequestsInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutEventRequestsInput, Prisma.ProfileUncheckedCreateWithoutEventRequestsInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutEventRequestsInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutEventRequestsInput, Prisma.ProfileUncheckedUpdateWithoutEventRequestsInput>;
};
export type ProfileUpdateWithoutEventRequestsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutProfileNestedInput;
};
export type ProfileUncheckedUpdateWithoutEventRequestsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUncheckedUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUncheckedUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUncheckedUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutProfileNestedInput;
};
export type ProfileCreateWithoutUserFeedbacksInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutProfileInput;
};
export type ProfileUncheckedCreateWithoutUserFeedbacksInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowUncheckedCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarUncheckedCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderUncheckedCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestUncheckedCreateNestedManyWithoutProfileInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutProfileInput;
};
export type ProfileCreateOrConnectWithoutUserFeedbacksInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutUserFeedbacksInput, Prisma.ProfileUncheckedCreateWithoutUserFeedbacksInput>;
};
export type ProfileUpsertWithoutUserFeedbacksInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutUserFeedbacksInput, Prisma.ProfileUncheckedUpdateWithoutUserFeedbacksInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutUserFeedbacksInput, Prisma.ProfileUncheckedCreateWithoutUserFeedbacksInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutUserFeedbacksInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutUserFeedbacksInput, Prisma.ProfileUncheckedUpdateWithoutUserFeedbacksInput>;
};
export type ProfileUpdateWithoutUserFeedbacksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutProfileNestedInput;
};
export type ProfileUncheckedUpdateWithoutUserFeedbacksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUncheckedUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUncheckedUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUncheckedUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUncheckedUpdateManyWithoutProfileNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutProfileNestedInput;
};
export type ProfileCreateWithoutActivityLogsInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackCreateNestedManyWithoutProfileInput;
};
export type ProfileUncheckedCreateWithoutActivityLogsInput = {
    id: string;
    fullName?: string | null;
    preferredLocation?: string | null;
    sportsInterest?: Prisma.ProfileCreatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    follows?: Prisma.FollowUncheckedCreateNestedManyWithoutProfileInput;
    userCalendars?: Prisma.UserCalendarUncheckedCreateNestedManyWithoutProfileInput;
    reminders?: Prisma.ReminderUncheckedCreateNestedManyWithoutProfileInput;
    eventRequests?: Prisma.EventRequestUncheckedCreateNestedManyWithoutProfileInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedCreateNestedManyWithoutProfileInput;
};
export type ProfileCreateOrConnectWithoutActivityLogsInput = {
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutActivityLogsInput, Prisma.ProfileUncheckedCreateWithoutActivityLogsInput>;
};
export type ProfileUpsertWithoutActivityLogsInput = {
    update: Prisma.XOR<Prisma.ProfileUpdateWithoutActivityLogsInput, Prisma.ProfileUncheckedUpdateWithoutActivityLogsInput>;
    create: Prisma.XOR<Prisma.ProfileCreateWithoutActivityLogsInput, Prisma.ProfileUncheckedCreateWithoutActivityLogsInput>;
    where?: Prisma.ProfileWhereInput;
};
export type ProfileUpdateToOneWithWhereWithoutActivityLogsInput = {
    where?: Prisma.ProfileWhereInput;
    data: Prisma.XOR<Prisma.ProfileUpdateWithoutActivityLogsInput, Prisma.ProfileUncheckedUpdateWithoutActivityLogsInput>;
};
export type ProfileUpdateWithoutActivityLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUpdateManyWithoutProfileNestedInput;
};
export type ProfileUncheckedUpdateWithoutActivityLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredLocation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sportsInterest?: Prisma.ProfileUpdatesportsInterestInput | $Enums.SportCategory[];
    onboardingCompleted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUncheckedUpdateManyWithoutProfileNestedInput;
    userCalendars?: Prisma.UserCalendarUncheckedUpdateManyWithoutProfileNestedInput;
    reminders?: Prisma.ReminderUncheckedUpdateManyWithoutProfileNestedInput;
    eventRequests?: Prisma.EventRequestUncheckedUpdateManyWithoutProfileNestedInput;
    userFeedbacks?: Prisma.UserFeedbackUncheckedUpdateManyWithoutProfileNestedInput;
};
export type ProfileCountOutputType = {
    follows: number;
    userCalendars: number;
    reminders: number;
    eventRequests: number;
    userFeedbacks: number;
    activityLogs: number;
};
export type ProfileCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    follows?: boolean | ProfileCountOutputTypeCountFollowsArgs;
    userCalendars?: boolean | ProfileCountOutputTypeCountUserCalendarsArgs;
    reminders?: boolean | ProfileCountOutputTypeCountRemindersArgs;
    eventRequests?: boolean | ProfileCountOutputTypeCountEventRequestsArgs;
    userFeedbacks?: boolean | ProfileCountOutputTypeCountUserFeedbacksArgs;
    activityLogs?: boolean | ProfileCountOutputTypeCountActivityLogsArgs;
};
export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileCountOutputTypeSelect<ExtArgs> | null;
};
export type ProfileCountOutputTypeCountFollowsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FollowWhereInput;
};
export type ProfileCountOutputTypeCountUserCalendarsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCalendarWhereInput;
};
export type ProfileCountOutputTypeCountRemindersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReminderWhereInput;
};
export type ProfileCountOutputTypeCountEventRequestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventRequestWhereInput;
};
export type ProfileCountOutputTypeCountUserFeedbacksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserFeedbackWhereInput;
};
export type ProfileCountOutputTypeCountActivityLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
};
export type ProfileSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    preferredLocation?: boolean;
    sportsInterest?: boolean;
    onboardingCompleted?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    follows?: boolean | Prisma.Profile$followsArgs<ExtArgs>;
    userCalendars?: boolean | Prisma.Profile$userCalendarsArgs<ExtArgs>;
    reminders?: boolean | Prisma.Profile$remindersArgs<ExtArgs>;
    eventRequests?: boolean | Prisma.Profile$eventRequestsArgs<ExtArgs>;
    userFeedbacks?: boolean | Prisma.Profile$userFeedbacksArgs<ExtArgs>;
    activityLogs?: boolean | Prisma.Profile$activityLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.ProfileCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["profile"]>;
export type ProfileSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    preferredLocation?: boolean;
    sportsInterest?: boolean;
    onboardingCompleted?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["profile"]>;
export type ProfileSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    preferredLocation?: boolean;
    sportsInterest?: boolean;
    onboardingCompleted?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["profile"]>;
export type ProfileSelectScalar = {
    id?: boolean;
    fullName?: boolean;
    preferredLocation?: boolean;
    sportsInterest?: boolean;
    onboardingCompleted?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ProfileOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "fullName" | "preferredLocation" | "sportsInterest" | "onboardingCompleted" | "createdAt" | "updatedAt", ExtArgs["result"]["profile"]>;
export type ProfileInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    follows?: boolean | Prisma.Profile$followsArgs<ExtArgs>;
    userCalendars?: boolean | Prisma.Profile$userCalendarsArgs<ExtArgs>;
    reminders?: boolean | Prisma.Profile$remindersArgs<ExtArgs>;
    eventRequests?: boolean | Prisma.Profile$eventRequestsArgs<ExtArgs>;
    userFeedbacks?: boolean | Prisma.Profile$userFeedbacksArgs<ExtArgs>;
    activityLogs?: boolean | Prisma.Profile$activityLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.ProfileCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ProfileIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ProfilePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Profile";
    objects: {
        follows: Prisma.$FollowPayload<ExtArgs>[];
        userCalendars: Prisma.$UserCalendarPayload<ExtArgs>[];
        reminders: Prisma.$ReminderPayload<ExtArgs>[];
        eventRequests: Prisma.$EventRequestPayload<ExtArgs>[];
        userFeedbacks: Prisma.$UserFeedbackPayload<ExtArgs>[];
        activityLogs: Prisma.$ActivityLogPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        fullName: string | null;
        preferredLocation: string | null;
        sportsInterest: $Enums.SportCategory[];
        onboardingCompleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["profile"]>;
    composites: {};
};
export type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProfilePayload, S>;
export type ProfileCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProfileCountAggregateInputType | true;
};
export interface ProfileDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Profile'];
        meta: {
            name: 'Profile';
        };
    };
    findUnique<T extends ProfileFindUniqueArgs>(args: Prisma.SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProfileFindFirstArgs>(args?: Prisma.SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProfileFindManyArgs>(args?: Prisma.SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProfileCreateArgs>(args: Prisma.SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProfileCreateManyArgs>(args?: Prisma.SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProfileDeleteArgs>(args: Prisma.SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProfileUpdateArgs>(args: Prisma.SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProfileDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProfileUpdateManyArgs>(args: Prisma.SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProfileUpsertArgs>(args: Prisma.SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProfileCountArgs>(args?: Prisma.Subset<T, ProfileCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProfileCountAggregateOutputType> : number>;
    aggregate<T extends ProfileAggregateArgs>(args: Prisma.Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>;
    groupBy<T extends ProfileGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProfileGroupByArgs['orderBy'];
    } : {
        orderBy?: ProfileGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProfileFieldRefs;
}
export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    follows<T extends Prisma.Profile$followsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$followsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    userCalendars<T extends Prisma.Profile$userCalendarsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$userCalendarsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reminders<T extends Prisma.Profile$remindersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$remindersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    eventRequests<T extends Prisma.Profile$eventRequestsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$eventRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    userFeedbacks<T extends Prisma.Profile$userFeedbacksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$userFeedbacksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    activityLogs<T extends Prisma.Profile$activityLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Profile$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProfileFieldRefs {
    readonly id: Prisma.FieldRef<"Profile", 'String'>;
    readonly fullName: Prisma.FieldRef<"Profile", 'String'>;
    readonly preferredLocation: Prisma.FieldRef<"Profile", 'String'>;
    readonly sportsInterest: Prisma.FieldRef<"Profile", 'SportCategory[]'>;
    readonly onboardingCompleted: Prisma.FieldRef<"Profile", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Profile", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Profile", 'DateTime'>;
}
export type ProfileFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where: Prisma.ProfileWhereUniqueInput;
};
export type ProfileFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where: Prisma.ProfileWhereUniqueInput;
};
export type ProfileFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[];
    cursor?: Prisma.ProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProfileScalarFieldEnum | Prisma.ProfileScalarFieldEnum[];
};
export type ProfileFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[];
    cursor?: Prisma.ProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProfileScalarFieldEnum | Prisma.ProfileScalarFieldEnum[];
};
export type ProfileFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput | Prisma.ProfileOrderByWithRelationInput[];
    cursor?: Prisma.ProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProfileScalarFieldEnum | Prisma.ProfileScalarFieldEnum[];
};
export type ProfileCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProfileCreateInput, Prisma.ProfileUncheckedCreateInput>;
};
export type ProfileCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProfileCreateManyInput | Prisma.ProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProfileCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    data: Prisma.ProfileCreateManyInput | Prisma.ProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProfileUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProfileUpdateInput, Prisma.ProfileUncheckedUpdateInput>;
    where: Prisma.ProfileWhereUniqueInput;
};
export type ProfileUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProfileUpdateManyMutationInput, Prisma.ProfileUncheckedUpdateManyInput>;
    where?: Prisma.ProfileWhereInput;
    limit?: number;
};
export type ProfileUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProfileUpdateManyMutationInput, Prisma.ProfileUncheckedUpdateManyInput>;
    where?: Prisma.ProfileWhereInput;
    limit?: number;
};
export type ProfileUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where: Prisma.ProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProfileCreateInput, Prisma.ProfileUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProfileUpdateInput, Prisma.ProfileUncheckedUpdateInput>;
};
export type ProfileDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where: Prisma.ProfileWhereUniqueInput;
};
export type ProfileDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProfileWhereInput;
    limit?: number;
};
export type Profile$followsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelect<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    include?: Prisma.FollowInclude<ExtArgs> | null;
    where?: Prisma.FollowWhereInput;
    orderBy?: Prisma.FollowOrderByWithRelationInput | Prisma.FollowOrderByWithRelationInput[];
    cursor?: Prisma.FollowWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FollowScalarFieldEnum | Prisma.FollowScalarFieldEnum[];
};
export type Profile$userCalendarsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelect<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    include?: Prisma.UserCalendarInclude<ExtArgs> | null;
    where?: Prisma.UserCalendarWhereInput;
    orderBy?: Prisma.UserCalendarOrderByWithRelationInput | Prisma.UserCalendarOrderByWithRelationInput[];
    cursor?: Prisma.UserCalendarWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserCalendarScalarFieldEnum | Prisma.UserCalendarScalarFieldEnum[];
};
export type Profile$remindersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelect<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    include?: Prisma.ReminderInclude<ExtArgs> | null;
    where?: Prisma.ReminderWhereInput;
    orderBy?: Prisma.ReminderOrderByWithRelationInput | Prisma.ReminderOrderByWithRelationInput[];
    cursor?: Prisma.ReminderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReminderScalarFieldEnum | Prisma.ReminderScalarFieldEnum[];
};
export type Profile$eventRequestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelect<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    include?: Prisma.EventRequestInclude<ExtArgs> | null;
    where?: Prisma.EventRequestWhereInput;
    orderBy?: Prisma.EventRequestOrderByWithRelationInput | Prisma.EventRequestOrderByWithRelationInput[];
    cursor?: Prisma.EventRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventRequestScalarFieldEnum | Prisma.EventRequestScalarFieldEnum[];
};
export type Profile$userFeedbacksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    include?: Prisma.UserFeedbackInclude<ExtArgs> | null;
    where?: Prisma.UserFeedbackWhereInput;
    orderBy?: Prisma.UserFeedbackOrderByWithRelationInput | Prisma.UserFeedbackOrderByWithRelationInput[];
    cursor?: Prisma.UserFeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserFeedbackScalarFieldEnum | Prisma.UserFeedbackScalarFieldEnum[];
};
export type Profile$activityLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithRelationInput | Prisma.ActivityLogOrderByWithRelationInput[];
    cursor?: Prisma.ActivityLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ActivityLogScalarFieldEnum | Prisma.ActivityLogScalarFieldEnum[];
};
export type ProfileDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
};
