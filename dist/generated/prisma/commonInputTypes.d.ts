import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type UuidFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidFilter<$PrismaModel> | string;
};
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type EnumSportCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.SportCategory | Prisma.EnumSportCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSportCategoryFilter<$PrismaModel> | $Enums.SportCategory;
};
export type EnumDifficultyLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DifficultyLevel | Prisma.EnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.DifficultyLevel[] | Prisma.ListEnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.DifficultyLevel[] | Prisma.ListEnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumDifficultyLevelNullableFilter<$PrismaModel> | $Enums.DifficultyLevel | null;
};
export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidNullableFilter<$PrismaModel> | string | null;
};
export type EnumEventStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | Prisma.EnumEventStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.EventStatus[] | Prisma.ListEnumEventStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EventStatus[] | Prisma.ListEnumEventStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEventStatusFilter<$PrismaModel> | $Enums.EventStatus;
};
export type EnumSportCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SportCategory | Prisma.EnumSportCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSportCategoryWithAggregatesFilter<$PrismaModel> | $Enums.SportCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSportCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSportCategoryFilter<$PrismaModel>;
};
export type EnumDifficultyLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DifficultyLevel | Prisma.EnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.DifficultyLevel[] | Prisma.ListEnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.DifficultyLevel[] | Prisma.ListEnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumDifficultyLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.DifficultyLevel | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDifficultyLevelNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDifficultyLevelNullableFilter<$PrismaModel>;
};
export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumEventStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | Prisma.EnumEventStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.EventStatus[] | Prisma.ListEnumEventStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EventStatus[] | Prisma.ListEnumEventStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEventStatusWithAggregatesFilter<$PrismaModel> | $Enums.EventStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEventStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEventStatusFilter<$PrismaModel>;
};
export type EnumFollowTargetFilter<$PrismaModel = never> = {
    equals?: $Enums.FollowTarget | Prisma.EnumFollowTargetFieldRefInput<$PrismaModel>;
    in?: $Enums.FollowTarget[] | Prisma.ListEnumFollowTargetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FollowTarget[] | Prisma.ListEnumFollowTargetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFollowTargetFilter<$PrismaModel> | $Enums.FollowTarget;
};
export type EnumFollowTargetWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FollowTarget | Prisma.EnumFollowTargetFieldRefInput<$PrismaModel>;
    in?: $Enums.FollowTarget[] | Prisma.ListEnumFollowTargetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FollowTarget[] | Prisma.ListEnumFollowTargetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFollowTargetWithAggregatesFilter<$PrismaModel> | $Enums.FollowTarget;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFollowTargetFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFollowTargetFilter<$PrismaModel>;
};
export type EnumReminderTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReminderType | Prisma.EnumReminderTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReminderType[] | Prisma.ListEnumReminderTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReminderType[] | Prisma.ListEnumReminderTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReminderTypeFilter<$PrismaModel> | $Enums.ReminderType;
};
export type EnumReminderTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReminderType | Prisma.EnumReminderTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReminderType[] | Prisma.ListEnumReminderTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReminderType[] | Prisma.ListEnumReminderTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReminderTypeWithAggregatesFilter<$PrismaModel> | $Enums.ReminderType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReminderTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReminderTypeFilter<$PrismaModel>;
};
export type EnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | Prisma.EnumRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RequestStatus[] | Prisma.ListEnumRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RequestStatus[] | Prisma.ListEnumRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus;
};
export type EnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | Prisma.EnumRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RequestStatus[] | Prisma.ListEnumRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RequestStatus[] | Prisma.ListEnumRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRequestStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRequestStatusFilter<$PrismaModel>;
};
export type EnumFeedbackTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackType | Prisma.EnumFeedbackTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.FeedbackType[] | Prisma.ListEnumFeedbackTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FeedbackType[] | Prisma.ListEnumFeedbackTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFeedbackTypeFilter<$PrismaModel> | $Enums.FeedbackType;
};
export type EnumFeedbackTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackType | Prisma.EnumFeedbackTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.FeedbackType[] | Prisma.ListEnumFeedbackTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FeedbackType[] | Prisma.ListEnumFeedbackTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFeedbackTypeWithAggregatesFilter<$PrismaModel> | $Enums.FeedbackType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFeedbackTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFeedbackTypeFilter<$PrismaModel>;
};
export type EnumActivityActionFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityAction | Prisma.EnumActivityActionFieldRefInput<$PrismaModel>;
    in?: $Enums.ActivityAction[] | Prisma.ListEnumActivityActionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ActivityAction[] | Prisma.ListEnumActivityActionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumActivityActionFilter<$PrismaModel> | $Enums.ActivityAction;
};
export type EnumActivityActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityAction | Prisma.EnumActivityActionFieldRefInput<$PrismaModel>;
    in?: $Enums.ActivityAction[] | Prisma.ListEnumActivityActionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ActivityAction[] | Prisma.ListEnumActivityActionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumActivityActionWithAggregatesFilter<$PrismaModel> | $Enums.ActivityAction;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumActivityActionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumActivityActionFilter<$PrismaModel>;
};
export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidFilter<$PrismaModel> | string;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumSportCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.SportCategory | Prisma.EnumSportCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSportCategoryFilter<$PrismaModel> | $Enums.SportCategory;
};
export type NestedEnumDifficultyLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DifficultyLevel | Prisma.EnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.DifficultyLevel[] | Prisma.ListEnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.DifficultyLevel[] | Prisma.ListEnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumDifficultyLevelNullableFilter<$PrismaModel> | $Enums.DifficultyLevel | null;
};
export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidNullableFilter<$PrismaModel> | string | null;
};
export type NestedEnumEventStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | Prisma.EnumEventStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.EventStatus[] | Prisma.ListEnumEventStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EventStatus[] | Prisma.ListEnumEventStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEventStatusFilter<$PrismaModel> | $Enums.EventStatus;
};
export type NestedEnumSportCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SportCategory | Prisma.EnumSportCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SportCategory[] | Prisma.ListEnumSportCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSportCategoryWithAggregatesFilter<$PrismaModel> | $Enums.SportCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSportCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSportCategoryFilter<$PrismaModel>;
};
export type NestedEnumDifficultyLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DifficultyLevel | Prisma.EnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    in?: $Enums.DifficultyLevel[] | Prisma.ListEnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.DifficultyLevel[] | Prisma.ListEnumDifficultyLevelFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumDifficultyLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.DifficultyLevel | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDifficultyLevelNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDifficultyLevelNullableFilter<$PrismaModel>;
};
export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedEnumEventStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | Prisma.EnumEventStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.EventStatus[] | Prisma.ListEnumEventStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EventStatus[] | Prisma.ListEnumEventStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEventStatusWithAggregatesFilter<$PrismaModel> | $Enums.EventStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEventStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEventStatusFilter<$PrismaModel>;
};
export type NestedEnumFollowTargetFilter<$PrismaModel = never> = {
    equals?: $Enums.FollowTarget | Prisma.EnumFollowTargetFieldRefInput<$PrismaModel>;
    in?: $Enums.FollowTarget[] | Prisma.ListEnumFollowTargetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FollowTarget[] | Prisma.ListEnumFollowTargetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFollowTargetFilter<$PrismaModel> | $Enums.FollowTarget;
};
export type NestedEnumFollowTargetWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FollowTarget | Prisma.EnumFollowTargetFieldRefInput<$PrismaModel>;
    in?: $Enums.FollowTarget[] | Prisma.ListEnumFollowTargetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FollowTarget[] | Prisma.ListEnumFollowTargetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFollowTargetWithAggregatesFilter<$PrismaModel> | $Enums.FollowTarget;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFollowTargetFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFollowTargetFilter<$PrismaModel>;
};
export type NestedEnumReminderTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReminderType | Prisma.EnumReminderTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReminderType[] | Prisma.ListEnumReminderTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReminderType[] | Prisma.ListEnumReminderTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReminderTypeFilter<$PrismaModel> | $Enums.ReminderType;
};
export type NestedEnumReminderTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReminderType | Prisma.EnumReminderTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ReminderType[] | Prisma.ListEnumReminderTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ReminderType[] | Prisma.ListEnumReminderTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumReminderTypeWithAggregatesFilter<$PrismaModel> | $Enums.ReminderType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumReminderTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumReminderTypeFilter<$PrismaModel>;
};
export type NestedEnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | Prisma.EnumRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RequestStatus[] | Prisma.ListEnumRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RequestStatus[] | Prisma.ListEnumRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus;
};
export type NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | Prisma.EnumRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RequestStatus[] | Prisma.ListEnumRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RequestStatus[] | Prisma.ListEnumRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRequestStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRequestStatusFilter<$PrismaModel>;
};
export type NestedEnumFeedbackTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackType | Prisma.EnumFeedbackTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.FeedbackType[] | Prisma.ListEnumFeedbackTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FeedbackType[] | Prisma.ListEnumFeedbackTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFeedbackTypeFilter<$PrismaModel> | $Enums.FeedbackType;
};
export type NestedEnumFeedbackTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackType | Prisma.EnumFeedbackTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.FeedbackType[] | Prisma.ListEnumFeedbackTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FeedbackType[] | Prisma.ListEnumFeedbackTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFeedbackTypeWithAggregatesFilter<$PrismaModel> | $Enums.FeedbackType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFeedbackTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFeedbackTypeFilter<$PrismaModel>;
};
export type NestedEnumActivityActionFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityAction | Prisma.EnumActivityActionFieldRefInput<$PrismaModel>;
    in?: $Enums.ActivityAction[] | Prisma.ListEnumActivityActionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ActivityAction[] | Prisma.ListEnumActivityActionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumActivityActionFilter<$PrismaModel> | $Enums.ActivityAction;
};
export type NestedEnumActivityActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityAction | Prisma.EnumActivityActionFieldRefInput<$PrismaModel>;
    in?: $Enums.ActivityAction[] | Prisma.ListEnumActivityActionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ActivityAction[] | Prisma.ListEnumActivityActionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumActivityActionWithAggregatesFilter<$PrismaModel> | $Enums.ActivityAction;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumActivityActionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumActivityActionFilter<$PrismaModel>;
};
