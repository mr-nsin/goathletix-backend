import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type FollowModel = runtime.Types.Result.DefaultSelection<Prisma.$FollowPayload>;
export type AggregateFollow = {
    _count: FollowCountAggregateOutputType | null;
    _min: FollowMinAggregateOutputType | null;
    _max: FollowMaxAggregateOutputType | null;
};
export type FollowMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    targetType: $Enums.FollowTarget | null;
    organizerId: string | null;
    eventId: string | null;
    createdAt: Date | null;
};
export type FollowMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    targetType: $Enums.FollowTarget | null;
    organizerId: string | null;
    eventId: string | null;
    createdAt: Date | null;
};
export type FollowCountAggregateOutputType = {
    id: number;
    userId: number;
    targetType: number;
    organizerId: number;
    eventId: number;
    createdAt: number;
    _all: number;
};
export type FollowMinAggregateInputType = {
    id?: true;
    userId?: true;
    targetType?: true;
    organizerId?: true;
    eventId?: true;
    createdAt?: true;
};
export type FollowMaxAggregateInputType = {
    id?: true;
    userId?: true;
    targetType?: true;
    organizerId?: true;
    eventId?: true;
    createdAt?: true;
};
export type FollowCountAggregateInputType = {
    id?: true;
    userId?: true;
    targetType?: true;
    organizerId?: true;
    eventId?: true;
    createdAt?: true;
    _all?: true;
};
export type FollowAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FollowWhereInput;
    orderBy?: Prisma.FollowOrderByWithRelationInput | Prisma.FollowOrderByWithRelationInput[];
    cursor?: Prisma.FollowWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FollowCountAggregateInputType;
    _min?: FollowMinAggregateInputType;
    _max?: FollowMaxAggregateInputType;
};
export type GetFollowAggregateType<T extends FollowAggregateArgs> = {
    [P in keyof T & keyof AggregateFollow]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFollow[P]> : Prisma.GetScalarType<T[P], AggregateFollow[P]>;
};
export type FollowGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FollowWhereInput;
    orderBy?: Prisma.FollowOrderByWithAggregationInput | Prisma.FollowOrderByWithAggregationInput[];
    by: Prisma.FollowScalarFieldEnum[] | Prisma.FollowScalarFieldEnum;
    having?: Prisma.FollowScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FollowCountAggregateInputType | true;
    _min?: FollowMinAggregateInputType;
    _max?: FollowMaxAggregateInputType;
};
export type FollowGroupByOutputType = {
    id: string;
    userId: string;
    targetType: $Enums.FollowTarget;
    organizerId: string | null;
    eventId: string | null;
    createdAt: Date;
    _count: FollowCountAggregateOutputType | null;
    _min: FollowMinAggregateOutputType | null;
    _max: FollowMaxAggregateOutputType | null;
};
export type GetFollowGroupByPayload<T extends FollowGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FollowGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FollowGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FollowGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FollowGroupByOutputType[P]>;
}>>;
export type FollowWhereInput = {
    AND?: Prisma.FollowWhereInput | Prisma.FollowWhereInput[];
    OR?: Prisma.FollowWhereInput[];
    NOT?: Prisma.FollowWhereInput | Prisma.FollowWhereInput[];
    id?: Prisma.UuidFilter<"Follow"> | string;
    userId?: Prisma.UuidFilter<"Follow"> | string;
    targetType?: Prisma.EnumFollowTargetFilter<"Follow"> | $Enums.FollowTarget;
    organizerId?: Prisma.UuidNullableFilter<"Follow"> | string | null;
    eventId?: Prisma.UuidNullableFilter<"Follow"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Follow"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    organizer?: Prisma.XOR<Prisma.OrganizerNullableScalarRelationFilter, Prisma.OrganizerWhereInput> | null;
    event?: Prisma.XOR<Prisma.EventNullableScalarRelationFilter, Prisma.EventWhereInput> | null;
};
export type FollowOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    organizerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    eventId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    profile?: Prisma.ProfileOrderByWithRelationInput;
    organizer?: Prisma.OrganizerOrderByWithRelationInput;
    event?: Prisma.EventOrderByWithRelationInput;
};
export type FollowWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    unique_user_follow_organizer?: Prisma.FollowUnique_user_follow_organizerCompoundUniqueInput;
    unique_user_follow_event?: Prisma.FollowUnique_user_follow_eventCompoundUniqueInput;
    AND?: Prisma.FollowWhereInput | Prisma.FollowWhereInput[];
    OR?: Prisma.FollowWhereInput[];
    NOT?: Prisma.FollowWhereInput | Prisma.FollowWhereInput[];
    userId?: Prisma.UuidFilter<"Follow"> | string;
    targetType?: Prisma.EnumFollowTargetFilter<"Follow"> | $Enums.FollowTarget;
    organizerId?: Prisma.UuidNullableFilter<"Follow"> | string | null;
    eventId?: Prisma.UuidNullableFilter<"Follow"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Follow"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    organizer?: Prisma.XOR<Prisma.OrganizerNullableScalarRelationFilter, Prisma.OrganizerWhereInput> | null;
    event?: Prisma.XOR<Prisma.EventNullableScalarRelationFilter, Prisma.EventWhereInput> | null;
}, "id" | "unique_user_follow_organizer" | "unique_user_follow_event">;
export type FollowOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    organizerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    eventId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.FollowCountOrderByAggregateInput;
    _max?: Prisma.FollowMaxOrderByAggregateInput;
    _min?: Prisma.FollowMinOrderByAggregateInput;
};
export type FollowScalarWhereWithAggregatesInput = {
    AND?: Prisma.FollowScalarWhereWithAggregatesInput | Prisma.FollowScalarWhereWithAggregatesInput[];
    OR?: Prisma.FollowScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FollowScalarWhereWithAggregatesInput | Prisma.FollowScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Follow"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"Follow"> | string;
    targetType?: Prisma.EnumFollowTargetWithAggregatesFilter<"Follow"> | $Enums.FollowTarget;
    organizerId?: Prisma.UuidNullableWithAggregatesFilter<"Follow"> | string | null;
    eventId?: Prisma.UuidNullableWithAggregatesFilter<"Follow"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Follow"> | Date | string;
};
export type FollowCreateInput = {
    id?: string;
    targetType: $Enums.FollowTarget;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutFollowsInput;
    organizer?: Prisma.OrganizerCreateNestedOneWithoutFollowsInput;
    event?: Prisma.EventCreateNestedOneWithoutFollowsInput;
};
export type FollowUncheckedCreateInput = {
    id?: string;
    userId: string;
    targetType: $Enums.FollowTarget;
    organizerId?: string | null;
    eventId?: string | null;
    createdAt?: Date | string;
};
export type FollowUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutFollowsNestedInput;
    organizer?: Prisma.OrganizerUpdateOneWithoutFollowsNestedInput;
    event?: Prisma.EventUpdateOneWithoutFollowsNestedInput;
};
export type FollowUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    organizerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    eventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowCreateManyInput = {
    id?: string;
    userId: string;
    targetType: $Enums.FollowTarget;
    organizerId?: string | null;
    eventId?: string | null;
    createdAt?: Date | string;
};
export type FollowUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    organizerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    eventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowListRelationFilter = {
    every?: Prisma.FollowWhereInput;
    some?: Prisma.FollowWhereInput;
    none?: Prisma.FollowWhereInput;
};
export type FollowOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FollowUnique_user_follow_organizerCompoundUniqueInput = {
    userId: string;
    organizerId: string;
};
export type FollowUnique_user_follow_eventCompoundUniqueInput = {
    userId: string;
    eventId: string;
};
export type FollowCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    organizerId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FollowMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    organizerId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FollowMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    targetType?: Prisma.SortOrder;
    organizerId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FollowCreateNestedManyWithoutOrganizerInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutOrganizerInput, Prisma.FollowUncheckedCreateWithoutOrganizerInput> | Prisma.FollowCreateWithoutOrganizerInput[] | Prisma.FollowUncheckedCreateWithoutOrganizerInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutOrganizerInput | Prisma.FollowCreateOrConnectWithoutOrganizerInput[];
    createMany?: Prisma.FollowCreateManyOrganizerInputEnvelope;
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
};
export type FollowUncheckedCreateNestedManyWithoutOrganizerInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutOrganizerInput, Prisma.FollowUncheckedCreateWithoutOrganizerInput> | Prisma.FollowCreateWithoutOrganizerInput[] | Prisma.FollowUncheckedCreateWithoutOrganizerInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutOrganizerInput | Prisma.FollowCreateOrConnectWithoutOrganizerInput[];
    createMany?: Prisma.FollowCreateManyOrganizerInputEnvelope;
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
};
export type FollowUpdateManyWithoutOrganizerNestedInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutOrganizerInput, Prisma.FollowUncheckedCreateWithoutOrganizerInput> | Prisma.FollowCreateWithoutOrganizerInput[] | Prisma.FollowUncheckedCreateWithoutOrganizerInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutOrganizerInput | Prisma.FollowCreateOrConnectWithoutOrganizerInput[];
    upsert?: Prisma.FollowUpsertWithWhereUniqueWithoutOrganizerInput | Prisma.FollowUpsertWithWhereUniqueWithoutOrganizerInput[];
    createMany?: Prisma.FollowCreateManyOrganizerInputEnvelope;
    set?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    disconnect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    delete?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    update?: Prisma.FollowUpdateWithWhereUniqueWithoutOrganizerInput | Prisma.FollowUpdateWithWhereUniqueWithoutOrganizerInput[];
    updateMany?: Prisma.FollowUpdateManyWithWhereWithoutOrganizerInput | Prisma.FollowUpdateManyWithWhereWithoutOrganizerInput[];
    deleteMany?: Prisma.FollowScalarWhereInput | Prisma.FollowScalarWhereInput[];
};
export type FollowUncheckedUpdateManyWithoutOrganizerNestedInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutOrganizerInput, Prisma.FollowUncheckedCreateWithoutOrganizerInput> | Prisma.FollowCreateWithoutOrganizerInput[] | Prisma.FollowUncheckedCreateWithoutOrganizerInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutOrganizerInput | Prisma.FollowCreateOrConnectWithoutOrganizerInput[];
    upsert?: Prisma.FollowUpsertWithWhereUniqueWithoutOrganizerInput | Prisma.FollowUpsertWithWhereUniqueWithoutOrganizerInput[];
    createMany?: Prisma.FollowCreateManyOrganizerInputEnvelope;
    set?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    disconnect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    delete?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    update?: Prisma.FollowUpdateWithWhereUniqueWithoutOrganizerInput | Prisma.FollowUpdateWithWhereUniqueWithoutOrganizerInput[];
    updateMany?: Prisma.FollowUpdateManyWithWhereWithoutOrganizerInput | Prisma.FollowUpdateManyWithWhereWithoutOrganizerInput[];
    deleteMany?: Prisma.FollowScalarWhereInput | Prisma.FollowScalarWhereInput[];
};
export type FollowCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutEventInput, Prisma.FollowUncheckedCreateWithoutEventInput> | Prisma.FollowCreateWithoutEventInput[] | Prisma.FollowUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutEventInput | Prisma.FollowCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.FollowCreateManyEventInputEnvelope;
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
};
export type FollowUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutEventInput, Prisma.FollowUncheckedCreateWithoutEventInput> | Prisma.FollowCreateWithoutEventInput[] | Prisma.FollowUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutEventInput | Prisma.FollowCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.FollowCreateManyEventInputEnvelope;
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
};
export type FollowUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutEventInput, Prisma.FollowUncheckedCreateWithoutEventInput> | Prisma.FollowCreateWithoutEventInput[] | Prisma.FollowUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutEventInput | Prisma.FollowCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.FollowUpsertWithWhereUniqueWithoutEventInput | Prisma.FollowUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.FollowCreateManyEventInputEnvelope;
    set?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    disconnect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    delete?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    update?: Prisma.FollowUpdateWithWhereUniqueWithoutEventInput | Prisma.FollowUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.FollowUpdateManyWithWhereWithoutEventInput | Prisma.FollowUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.FollowScalarWhereInput | Prisma.FollowScalarWhereInput[];
};
export type FollowUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutEventInput, Prisma.FollowUncheckedCreateWithoutEventInput> | Prisma.FollowCreateWithoutEventInput[] | Prisma.FollowUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutEventInput | Prisma.FollowCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.FollowUpsertWithWhereUniqueWithoutEventInput | Prisma.FollowUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.FollowCreateManyEventInputEnvelope;
    set?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    disconnect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    delete?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    update?: Prisma.FollowUpdateWithWhereUniqueWithoutEventInput | Prisma.FollowUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.FollowUpdateManyWithWhereWithoutEventInput | Prisma.FollowUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.FollowScalarWhereInput | Prisma.FollowScalarWhereInput[];
};
export type FollowCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutProfileInput, Prisma.FollowUncheckedCreateWithoutProfileInput> | Prisma.FollowCreateWithoutProfileInput[] | Prisma.FollowUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutProfileInput | Prisma.FollowCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.FollowCreateManyProfileInputEnvelope;
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
};
export type FollowUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutProfileInput, Prisma.FollowUncheckedCreateWithoutProfileInput> | Prisma.FollowCreateWithoutProfileInput[] | Prisma.FollowUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutProfileInput | Prisma.FollowCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.FollowCreateManyProfileInputEnvelope;
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
};
export type FollowUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutProfileInput, Prisma.FollowUncheckedCreateWithoutProfileInput> | Prisma.FollowCreateWithoutProfileInput[] | Prisma.FollowUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutProfileInput | Prisma.FollowCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.FollowUpsertWithWhereUniqueWithoutProfileInput | Prisma.FollowUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.FollowCreateManyProfileInputEnvelope;
    set?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    disconnect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    delete?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    update?: Prisma.FollowUpdateWithWhereUniqueWithoutProfileInput | Prisma.FollowUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.FollowUpdateManyWithWhereWithoutProfileInput | Prisma.FollowUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.FollowScalarWhereInput | Prisma.FollowScalarWhereInput[];
};
export type FollowUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.FollowCreateWithoutProfileInput, Prisma.FollowUncheckedCreateWithoutProfileInput> | Prisma.FollowCreateWithoutProfileInput[] | Prisma.FollowUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.FollowCreateOrConnectWithoutProfileInput | Prisma.FollowCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.FollowUpsertWithWhereUniqueWithoutProfileInput | Prisma.FollowUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.FollowCreateManyProfileInputEnvelope;
    set?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    disconnect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    delete?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    connect?: Prisma.FollowWhereUniqueInput | Prisma.FollowWhereUniqueInput[];
    update?: Prisma.FollowUpdateWithWhereUniqueWithoutProfileInput | Prisma.FollowUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.FollowUpdateManyWithWhereWithoutProfileInput | Prisma.FollowUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.FollowScalarWhereInput | Prisma.FollowScalarWhereInput[];
};
export type EnumFollowTargetFieldUpdateOperationsInput = {
    set?: $Enums.FollowTarget;
};
export type FollowCreateWithoutOrganizerInput = {
    id?: string;
    targetType: $Enums.FollowTarget;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutFollowsInput;
    event?: Prisma.EventCreateNestedOneWithoutFollowsInput;
};
export type FollowUncheckedCreateWithoutOrganizerInput = {
    id?: string;
    userId: string;
    targetType: $Enums.FollowTarget;
    eventId?: string | null;
    createdAt?: Date | string;
};
export type FollowCreateOrConnectWithoutOrganizerInput = {
    where: Prisma.FollowWhereUniqueInput;
    create: Prisma.XOR<Prisma.FollowCreateWithoutOrganizerInput, Prisma.FollowUncheckedCreateWithoutOrganizerInput>;
};
export type FollowCreateManyOrganizerInputEnvelope = {
    data: Prisma.FollowCreateManyOrganizerInput | Prisma.FollowCreateManyOrganizerInput[];
    skipDuplicates?: boolean;
};
export type FollowUpsertWithWhereUniqueWithoutOrganizerInput = {
    where: Prisma.FollowWhereUniqueInput;
    update: Prisma.XOR<Prisma.FollowUpdateWithoutOrganizerInput, Prisma.FollowUncheckedUpdateWithoutOrganizerInput>;
    create: Prisma.XOR<Prisma.FollowCreateWithoutOrganizerInput, Prisma.FollowUncheckedCreateWithoutOrganizerInput>;
};
export type FollowUpdateWithWhereUniqueWithoutOrganizerInput = {
    where: Prisma.FollowWhereUniqueInput;
    data: Prisma.XOR<Prisma.FollowUpdateWithoutOrganizerInput, Prisma.FollowUncheckedUpdateWithoutOrganizerInput>;
};
export type FollowUpdateManyWithWhereWithoutOrganizerInput = {
    where: Prisma.FollowScalarWhereInput;
    data: Prisma.XOR<Prisma.FollowUpdateManyMutationInput, Prisma.FollowUncheckedUpdateManyWithoutOrganizerInput>;
};
export type FollowScalarWhereInput = {
    AND?: Prisma.FollowScalarWhereInput | Prisma.FollowScalarWhereInput[];
    OR?: Prisma.FollowScalarWhereInput[];
    NOT?: Prisma.FollowScalarWhereInput | Prisma.FollowScalarWhereInput[];
    id?: Prisma.UuidFilter<"Follow"> | string;
    userId?: Prisma.UuidFilter<"Follow"> | string;
    targetType?: Prisma.EnumFollowTargetFilter<"Follow"> | $Enums.FollowTarget;
    organizerId?: Prisma.UuidNullableFilter<"Follow"> | string | null;
    eventId?: Prisma.UuidNullableFilter<"Follow"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Follow"> | Date | string;
};
export type FollowCreateWithoutEventInput = {
    id?: string;
    targetType: $Enums.FollowTarget;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutFollowsInput;
    organizer?: Prisma.OrganizerCreateNestedOneWithoutFollowsInput;
};
export type FollowUncheckedCreateWithoutEventInput = {
    id?: string;
    userId: string;
    targetType: $Enums.FollowTarget;
    organizerId?: string | null;
    createdAt?: Date | string;
};
export type FollowCreateOrConnectWithoutEventInput = {
    where: Prisma.FollowWhereUniqueInput;
    create: Prisma.XOR<Prisma.FollowCreateWithoutEventInput, Prisma.FollowUncheckedCreateWithoutEventInput>;
};
export type FollowCreateManyEventInputEnvelope = {
    data: Prisma.FollowCreateManyEventInput | Prisma.FollowCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type FollowUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.FollowWhereUniqueInput;
    update: Prisma.XOR<Prisma.FollowUpdateWithoutEventInput, Prisma.FollowUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.FollowCreateWithoutEventInput, Prisma.FollowUncheckedCreateWithoutEventInput>;
};
export type FollowUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.FollowWhereUniqueInput;
    data: Prisma.XOR<Prisma.FollowUpdateWithoutEventInput, Prisma.FollowUncheckedUpdateWithoutEventInput>;
};
export type FollowUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.FollowScalarWhereInput;
    data: Prisma.XOR<Prisma.FollowUpdateManyMutationInput, Prisma.FollowUncheckedUpdateManyWithoutEventInput>;
};
export type FollowCreateWithoutProfileInput = {
    id?: string;
    targetType: $Enums.FollowTarget;
    createdAt?: Date | string;
    organizer?: Prisma.OrganizerCreateNestedOneWithoutFollowsInput;
    event?: Prisma.EventCreateNestedOneWithoutFollowsInput;
};
export type FollowUncheckedCreateWithoutProfileInput = {
    id?: string;
    targetType: $Enums.FollowTarget;
    organizerId?: string | null;
    eventId?: string | null;
    createdAt?: Date | string;
};
export type FollowCreateOrConnectWithoutProfileInput = {
    where: Prisma.FollowWhereUniqueInput;
    create: Prisma.XOR<Prisma.FollowCreateWithoutProfileInput, Prisma.FollowUncheckedCreateWithoutProfileInput>;
};
export type FollowCreateManyProfileInputEnvelope = {
    data: Prisma.FollowCreateManyProfileInput | Prisma.FollowCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type FollowUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.FollowWhereUniqueInput;
    update: Prisma.XOR<Prisma.FollowUpdateWithoutProfileInput, Prisma.FollowUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.FollowCreateWithoutProfileInput, Prisma.FollowUncheckedCreateWithoutProfileInput>;
};
export type FollowUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.FollowWhereUniqueInput;
    data: Prisma.XOR<Prisma.FollowUpdateWithoutProfileInput, Prisma.FollowUncheckedUpdateWithoutProfileInput>;
};
export type FollowUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.FollowScalarWhereInput;
    data: Prisma.XOR<Prisma.FollowUpdateManyMutationInput, Prisma.FollowUncheckedUpdateManyWithoutProfileInput>;
};
export type FollowCreateManyOrganizerInput = {
    id?: string;
    userId: string;
    targetType: $Enums.FollowTarget;
    eventId?: string | null;
    createdAt?: Date | string;
};
export type FollowUpdateWithoutOrganizerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutFollowsNestedInput;
    event?: Prisma.EventUpdateOneWithoutFollowsNestedInput;
};
export type FollowUncheckedUpdateWithoutOrganizerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    eventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowUncheckedUpdateManyWithoutOrganizerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    eventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowCreateManyEventInput = {
    id?: string;
    userId: string;
    targetType: $Enums.FollowTarget;
    organizerId?: string | null;
    createdAt?: Date | string;
};
export type FollowUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutFollowsNestedInput;
    organizer?: Prisma.OrganizerUpdateOneWithoutFollowsNestedInput;
};
export type FollowUncheckedUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    organizerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowUncheckedUpdateManyWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    organizerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowCreateManyProfileInput = {
    id?: string;
    targetType: $Enums.FollowTarget;
    organizerId?: string | null;
    eventId?: string | null;
    createdAt?: Date | string;
};
export type FollowUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizer?: Prisma.OrganizerUpdateOneWithoutFollowsNestedInput;
    event?: Prisma.EventUpdateOneWithoutFollowsNestedInput;
};
export type FollowUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    organizerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    eventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    targetType?: Prisma.EnumFollowTargetFieldUpdateOperationsInput | $Enums.FollowTarget;
    organizerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    eventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FollowSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    targetType?: boolean;
    organizerId?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    organizer?: boolean | Prisma.Follow$organizerArgs<ExtArgs>;
    event?: boolean | Prisma.Follow$eventArgs<ExtArgs>;
}, ExtArgs["result"]["follow"]>;
export type FollowSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    targetType?: boolean;
    organizerId?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    organizer?: boolean | Prisma.Follow$organizerArgs<ExtArgs>;
    event?: boolean | Prisma.Follow$eventArgs<ExtArgs>;
}, ExtArgs["result"]["follow"]>;
export type FollowSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    targetType?: boolean;
    organizerId?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    organizer?: boolean | Prisma.Follow$organizerArgs<ExtArgs>;
    event?: boolean | Prisma.Follow$eventArgs<ExtArgs>;
}, ExtArgs["result"]["follow"]>;
export type FollowSelectScalar = {
    id?: boolean;
    userId?: boolean;
    targetType?: boolean;
    organizerId?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
};
export type FollowOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "targetType" | "organizerId" | "eventId" | "createdAt", ExtArgs["result"]["follow"]>;
export type FollowInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    organizer?: boolean | Prisma.Follow$organizerArgs<ExtArgs>;
    event?: boolean | Prisma.Follow$eventArgs<ExtArgs>;
};
export type FollowIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    organizer?: boolean | Prisma.Follow$organizerArgs<ExtArgs>;
    event?: boolean | Prisma.Follow$eventArgs<ExtArgs>;
};
export type FollowIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    organizer?: boolean | Prisma.Follow$organizerArgs<ExtArgs>;
    event?: boolean | Prisma.Follow$eventArgs<ExtArgs>;
};
export type $FollowPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Follow";
    objects: {
        profile: Prisma.$ProfilePayload<ExtArgs>;
        organizer: Prisma.$OrganizerPayload<ExtArgs> | null;
        event: Prisma.$EventPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        targetType: $Enums.FollowTarget;
        organizerId: string | null;
        eventId: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["follow"]>;
    composites: {};
};
export type FollowGetPayload<S extends boolean | null | undefined | FollowDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FollowPayload, S>;
export type FollowCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FollowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FollowCountAggregateInputType | true;
};
export interface FollowDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Follow'];
        meta: {
            name: 'Follow';
        };
    };
    findUnique<T extends FollowFindUniqueArgs>(args: Prisma.SelectSubset<T, FollowFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FollowClient<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FollowFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FollowFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FollowClient<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FollowFindFirstArgs>(args?: Prisma.SelectSubset<T, FollowFindFirstArgs<ExtArgs>>): Prisma.Prisma__FollowClient<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FollowFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FollowFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FollowClient<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FollowFindManyArgs>(args?: Prisma.SelectSubset<T, FollowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FollowCreateArgs>(args: Prisma.SelectSubset<T, FollowCreateArgs<ExtArgs>>): Prisma.Prisma__FollowClient<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FollowCreateManyArgs>(args?: Prisma.SelectSubset<T, FollowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FollowCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FollowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FollowDeleteArgs>(args: Prisma.SelectSubset<T, FollowDeleteArgs<ExtArgs>>): Prisma.Prisma__FollowClient<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FollowUpdateArgs>(args: Prisma.SelectSubset<T, FollowUpdateArgs<ExtArgs>>): Prisma.Prisma__FollowClient<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FollowDeleteManyArgs>(args?: Prisma.SelectSubset<T, FollowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FollowUpdateManyArgs>(args: Prisma.SelectSubset<T, FollowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FollowUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FollowUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FollowUpsertArgs>(args: Prisma.SelectSubset<T, FollowUpsertArgs<ExtArgs>>): Prisma.Prisma__FollowClient<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FollowCountArgs>(args?: Prisma.Subset<T, FollowCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FollowCountAggregateOutputType> : number>;
    aggregate<T extends FollowAggregateArgs>(args: Prisma.Subset<T, FollowAggregateArgs>): Prisma.PrismaPromise<GetFollowAggregateType<T>>;
    groupBy<T extends FollowGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FollowGroupByArgs['orderBy'];
    } : {
        orderBy?: FollowGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FollowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFollowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FollowFieldRefs;
}
export interface Prisma__FollowClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    profile<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    organizer<T extends Prisma.Follow$organizerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Follow$organizerArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    event<T extends Prisma.Follow$eventArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Follow$eventArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FollowFieldRefs {
    readonly id: Prisma.FieldRef<"Follow", 'String'>;
    readonly userId: Prisma.FieldRef<"Follow", 'String'>;
    readonly targetType: Prisma.FieldRef<"Follow", 'FollowTarget'>;
    readonly organizerId: Prisma.FieldRef<"Follow", 'String'>;
    readonly eventId: Prisma.FieldRef<"Follow", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Follow", 'DateTime'>;
}
export type FollowFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelect<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    include?: Prisma.FollowInclude<ExtArgs> | null;
    where: Prisma.FollowWhereUniqueInput;
};
export type FollowFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelect<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    include?: Prisma.FollowInclude<ExtArgs> | null;
    where: Prisma.FollowWhereUniqueInput;
};
export type FollowFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type FollowFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type FollowFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type FollowCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelect<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    include?: Prisma.FollowInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FollowCreateInput, Prisma.FollowUncheckedCreateInput>;
};
export type FollowCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FollowCreateManyInput | Prisma.FollowCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FollowCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    data: Prisma.FollowCreateManyInput | Prisma.FollowCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.FollowIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type FollowUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelect<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    include?: Prisma.FollowInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FollowUpdateInput, Prisma.FollowUncheckedUpdateInput>;
    where: Prisma.FollowWhereUniqueInput;
};
export type FollowUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FollowUpdateManyMutationInput, Prisma.FollowUncheckedUpdateManyInput>;
    where?: Prisma.FollowWhereInput;
    limit?: number;
};
export type FollowUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FollowUpdateManyMutationInput, Prisma.FollowUncheckedUpdateManyInput>;
    where?: Prisma.FollowWhereInput;
    limit?: number;
    include?: Prisma.FollowIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type FollowUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelect<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    include?: Prisma.FollowInclude<ExtArgs> | null;
    where: Prisma.FollowWhereUniqueInput;
    create: Prisma.XOR<Prisma.FollowCreateInput, Prisma.FollowUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FollowUpdateInput, Prisma.FollowUncheckedUpdateInput>;
};
export type FollowDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelect<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    include?: Prisma.FollowInclude<ExtArgs> | null;
    where: Prisma.FollowWhereUniqueInput;
};
export type FollowDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FollowWhereInput;
    limit?: number;
};
export type Follow$organizerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    where?: Prisma.OrganizerWhereInput;
};
export type Follow$eventArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
};
export type FollowDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FollowSelect<ExtArgs> | null;
    omit?: Prisma.FollowOmit<ExtArgs> | null;
    include?: Prisma.FollowInclude<ExtArgs> | null;
};
