import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReminderModel = runtime.Types.Result.DefaultSelection<Prisma.$ReminderPayload>;
export type AggregateReminder = {
    _count: ReminderCountAggregateOutputType | null;
    _min: ReminderMinAggregateOutputType | null;
    _max: ReminderMaxAggregateOutputType | null;
};
export type ReminderMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventId: string | null;
    triggerType: $Enums.ReminderType | null;
    isTriggered: boolean | null;
    createdAt: Date | null;
};
export type ReminderMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventId: string | null;
    triggerType: $Enums.ReminderType | null;
    isTriggered: boolean | null;
    createdAt: Date | null;
};
export type ReminderCountAggregateOutputType = {
    id: number;
    userId: number;
    eventId: number;
    triggerType: number;
    isTriggered: number;
    createdAt: number;
    _all: number;
};
export type ReminderMinAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    triggerType?: true;
    isTriggered?: true;
    createdAt?: true;
};
export type ReminderMaxAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    triggerType?: true;
    isTriggered?: true;
    createdAt?: true;
};
export type ReminderCountAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    triggerType?: true;
    isTriggered?: true;
    createdAt?: true;
    _all?: true;
};
export type ReminderAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReminderWhereInput;
    orderBy?: Prisma.ReminderOrderByWithRelationInput | Prisma.ReminderOrderByWithRelationInput[];
    cursor?: Prisma.ReminderWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReminderCountAggregateInputType;
    _min?: ReminderMinAggregateInputType;
    _max?: ReminderMaxAggregateInputType;
};
export type GetReminderAggregateType<T extends ReminderAggregateArgs> = {
    [P in keyof T & keyof AggregateReminder]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReminder[P]> : Prisma.GetScalarType<T[P], AggregateReminder[P]>;
};
export type ReminderGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReminderWhereInput;
    orderBy?: Prisma.ReminderOrderByWithAggregationInput | Prisma.ReminderOrderByWithAggregationInput[];
    by: Prisma.ReminderScalarFieldEnum[] | Prisma.ReminderScalarFieldEnum;
    having?: Prisma.ReminderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReminderCountAggregateInputType | true;
    _min?: ReminderMinAggregateInputType;
    _max?: ReminderMaxAggregateInputType;
};
export type ReminderGroupByOutputType = {
    id: string;
    userId: string;
    eventId: string;
    triggerType: $Enums.ReminderType;
    isTriggered: boolean;
    createdAt: Date;
    _count: ReminderCountAggregateOutputType | null;
    _min: ReminderMinAggregateOutputType | null;
    _max: ReminderMaxAggregateOutputType | null;
};
export type GetReminderGroupByPayload<T extends ReminderGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReminderGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReminderGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReminderGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReminderGroupByOutputType[P]>;
}>>;
export type ReminderWhereInput = {
    AND?: Prisma.ReminderWhereInput | Prisma.ReminderWhereInput[];
    OR?: Prisma.ReminderWhereInput[];
    NOT?: Prisma.ReminderWhereInput | Prisma.ReminderWhereInput[];
    id?: Prisma.UuidFilter<"Reminder"> | string;
    userId?: Prisma.UuidFilter<"Reminder"> | string;
    eventId?: Prisma.UuidFilter<"Reminder"> | string;
    triggerType?: Prisma.EnumReminderTypeFilter<"Reminder"> | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFilter<"Reminder"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Reminder"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
};
export type ReminderOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    triggerType?: Prisma.SortOrder;
    isTriggered?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    profile?: Prisma.ProfileOrderByWithRelationInput;
    event?: Prisma.EventOrderByWithRelationInput;
};
export type ReminderWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    unique_user_event_reminder?: Prisma.ReminderUnique_user_event_reminderCompoundUniqueInput;
    AND?: Prisma.ReminderWhereInput | Prisma.ReminderWhereInput[];
    OR?: Prisma.ReminderWhereInput[];
    NOT?: Prisma.ReminderWhereInput | Prisma.ReminderWhereInput[];
    userId?: Prisma.UuidFilter<"Reminder"> | string;
    eventId?: Prisma.UuidFilter<"Reminder"> | string;
    triggerType?: Prisma.EnumReminderTypeFilter<"Reminder"> | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFilter<"Reminder"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Reminder"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
}, "id" | "unique_user_event_reminder">;
export type ReminderOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    triggerType?: Prisma.SortOrder;
    isTriggered?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ReminderCountOrderByAggregateInput;
    _max?: Prisma.ReminderMaxOrderByAggregateInput;
    _min?: Prisma.ReminderMinOrderByAggregateInput;
};
export type ReminderScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReminderScalarWhereWithAggregatesInput | Prisma.ReminderScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReminderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReminderScalarWhereWithAggregatesInput | Prisma.ReminderScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Reminder"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"Reminder"> | string;
    eventId?: Prisma.UuidWithAggregatesFilter<"Reminder"> | string;
    triggerType?: Prisma.EnumReminderTypeWithAggregatesFilter<"Reminder"> | $Enums.ReminderType;
    isTriggered?: Prisma.BoolWithAggregatesFilter<"Reminder"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Reminder"> | Date | string;
};
export type ReminderCreateInput = {
    id?: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutRemindersInput;
    event: Prisma.EventCreateNestedOneWithoutRemindersInput;
};
export type ReminderUncheckedCreateInput = {
    id?: string;
    userId: string;
    eventId: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
};
export type ReminderUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutRemindersNestedInput;
    event?: Prisma.EventUpdateOneRequiredWithoutRemindersNestedInput;
};
export type ReminderUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReminderCreateManyInput = {
    id?: string;
    userId: string;
    eventId: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
};
export type ReminderUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReminderUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReminderListRelationFilter = {
    every?: Prisma.ReminderWhereInput;
    some?: Prisma.ReminderWhereInput;
    none?: Prisma.ReminderWhereInput;
};
export type ReminderOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReminderUnique_user_event_reminderCompoundUniqueInput = {
    userId: string;
    eventId: string;
    triggerType: $Enums.ReminderType;
};
export type ReminderCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    triggerType?: Prisma.SortOrder;
    isTriggered?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReminderMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    triggerType?: Prisma.SortOrder;
    isTriggered?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReminderMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    triggerType?: Prisma.SortOrder;
    isTriggered?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReminderCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.ReminderCreateWithoutEventInput, Prisma.ReminderUncheckedCreateWithoutEventInput> | Prisma.ReminderCreateWithoutEventInput[] | Prisma.ReminderUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.ReminderCreateOrConnectWithoutEventInput | Prisma.ReminderCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.ReminderCreateManyEventInputEnvelope;
    connect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
};
export type ReminderUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.ReminderCreateWithoutEventInput, Prisma.ReminderUncheckedCreateWithoutEventInput> | Prisma.ReminderCreateWithoutEventInput[] | Prisma.ReminderUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.ReminderCreateOrConnectWithoutEventInput | Prisma.ReminderCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.ReminderCreateManyEventInputEnvelope;
    connect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
};
export type ReminderUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.ReminderCreateWithoutEventInput, Prisma.ReminderUncheckedCreateWithoutEventInput> | Prisma.ReminderCreateWithoutEventInput[] | Prisma.ReminderUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.ReminderCreateOrConnectWithoutEventInput | Prisma.ReminderCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.ReminderUpsertWithWhereUniqueWithoutEventInput | Prisma.ReminderUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.ReminderCreateManyEventInputEnvelope;
    set?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    disconnect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    delete?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    connect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    update?: Prisma.ReminderUpdateWithWhereUniqueWithoutEventInput | Prisma.ReminderUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.ReminderUpdateManyWithWhereWithoutEventInput | Prisma.ReminderUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.ReminderScalarWhereInput | Prisma.ReminderScalarWhereInput[];
};
export type ReminderUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.ReminderCreateWithoutEventInput, Prisma.ReminderUncheckedCreateWithoutEventInput> | Prisma.ReminderCreateWithoutEventInput[] | Prisma.ReminderUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.ReminderCreateOrConnectWithoutEventInput | Prisma.ReminderCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.ReminderUpsertWithWhereUniqueWithoutEventInput | Prisma.ReminderUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.ReminderCreateManyEventInputEnvelope;
    set?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    disconnect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    delete?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    connect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    update?: Prisma.ReminderUpdateWithWhereUniqueWithoutEventInput | Prisma.ReminderUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.ReminderUpdateManyWithWhereWithoutEventInput | Prisma.ReminderUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.ReminderScalarWhereInput | Prisma.ReminderScalarWhereInput[];
};
export type ReminderCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.ReminderCreateWithoutProfileInput, Prisma.ReminderUncheckedCreateWithoutProfileInput> | Prisma.ReminderCreateWithoutProfileInput[] | Prisma.ReminderUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.ReminderCreateOrConnectWithoutProfileInput | Prisma.ReminderCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.ReminderCreateManyProfileInputEnvelope;
    connect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
};
export type ReminderUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.ReminderCreateWithoutProfileInput, Prisma.ReminderUncheckedCreateWithoutProfileInput> | Prisma.ReminderCreateWithoutProfileInput[] | Prisma.ReminderUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.ReminderCreateOrConnectWithoutProfileInput | Prisma.ReminderCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.ReminderCreateManyProfileInputEnvelope;
    connect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
};
export type ReminderUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.ReminderCreateWithoutProfileInput, Prisma.ReminderUncheckedCreateWithoutProfileInput> | Prisma.ReminderCreateWithoutProfileInput[] | Prisma.ReminderUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.ReminderCreateOrConnectWithoutProfileInput | Prisma.ReminderCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.ReminderUpsertWithWhereUniqueWithoutProfileInput | Prisma.ReminderUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.ReminderCreateManyProfileInputEnvelope;
    set?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    disconnect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    delete?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    connect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    update?: Prisma.ReminderUpdateWithWhereUniqueWithoutProfileInput | Prisma.ReminderUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.ReminderUpdateManyWithWhereWithoutProfileInput | Prisma.ReminderUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.ReminderScalarWhereInput | Prisma.ReminderScalarWhereInput[];
};
export type ReminderUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.ReminderCreateWithoutProfileInput, Prisma.ReminderUncheckedCreateWithoutProfileInput> | Prisma.ReminderCreateWithoutProfileInput[] | Prisma.ReminderUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.ReminderCreateOrConnectWithoutProfileInput | Prisma.ReminderCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.ReminderUpsertWithWhereUniqueWithoutProfileInput | Prisma.ReminderUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.ReminderCreateManyProfileInputEnvelope;
    set?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    disconnect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    delete?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    connect?: Prisma.ReminderWhereUniqueInput | Prisma.ReminderWhereUniqueInput[];
    update?: Prisma.ReminderUpdateWithWhereUniqueWithoutProfileInput | Prisma.ReminderUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.ReminderUpdateManyWithWhereWithoutProfileInput | Prisma.ReminderUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.ReminderScalarWhereInput | Prisma.ReminderScalarWhereInput[];
};
export type EnumReminderTypeFieldUpdateOperationsInput = {
    set?: $Enums.ReminderType;
};
export type ReminderCreateWithoutEventInput = {
    id?: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutRemindersInput;
};
export type ReminderUncheckedCreateWithoutEventInput = {
    id?: string;
    userId: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
};
export type ReminderCreateOrConnectWithoutEventInput = {
    where: Prisma.ReminderWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReminderCreateWithoutEventInput, Prisma.ReminderUncheckedCreateWithoutEventInput>;
};
export type ReminderCreateManyEventInputEnvelope = {
    data: Prisma.ReminderCreateManyEventInput | Prisma.ReminderCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type ReminderUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.ReminderWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReminderUpdateWithoutEventInput, Prisma.ReminderUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.ReminderCreateWithoutEventInput, Prisma.ReminderUncheckedCreateWithoutEventInput>;
};
export type ReminderUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.ReminderWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReminderUpdateWithoutEventInput, Prisma.ReminderUncheckedUpdateWithoutEventInput>;
};
export type ReminderUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.ReminderScalarWhereInput;
    data: Prisma.XOR<Prisma.ReminderUpdateManyMutationInput, Prisma.ReminderUncheckedUpdateManyWithoutEventInput>;
};
export type ReminderScalarWhereInput = {
    AND?: Prisma.ReminderScalarWhereInput | Prisma.ReminderScalarWhereInput[];
    OR?: Prisma.ReminderScalarWhereInput[];
    NOT?: Prisma.ReminderScalarWhereInput | Prisma.ReminderScalarWhereInput[];
    id?: Prisma.UuidFilter<"Reminder"> | string;
    userId?: Prisma.UuidFilter<"Reminder"> | string;
    eventId?: Prisma.UuidFilter<"Reminder"> | string;
    triggerType?: Prisma.EnumReminderTypeFilter<"Reminder"> | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFilter<"Reminder"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Reminder"> | Date | string;
};
export type ReminderCreateWithoutProfileInput = {
    id?: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
    event: Prisma.EventCreateNestedOneWithoutRemindersInput;
};
export type ReminderUncheckedCreateWithoutProfileInput = {
    id?: string;
    eventId: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
};
export type ReminderCreateOrConnectWithoutProfileInput = {
    where: Prisma.ReminderWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReminderCreateWithoutProfileInput, Prisma.ReminderUncheckedCreateWithoutProfileInput>;
};
export type ReminderCreateManyProfileInputEnvelope = {
    data: Prisma.ReminderCreateManyProfileInput | Prisma.ReminderCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type ReminderUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.ReminderWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReminderUpdateWithoutProfileInput, Prisma.ReminderUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.ReminderCreateWithoutProfileInput, Prisma.ReminderUncheckedCreateWithoutProfileInput>;
};
export type ReminderUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.ReminderWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReminderUpdateWithoutProfileInput, Prisma.ReminderUncheckedUpdateWithoutProfileInput>;
};
export type ReminderUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.ReminderScalarWhereInput;
    data: Prisma.XOR<Prisma.ReminderUpdateManyMutationInput, Prisma.ReminderUncheckedUpdateManyWithoutProfileInput>;
};
export type ReminderCreateManyEventInput = {
    id?: string;
    userId: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
};
export type ReminderUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutRemindersNestedInput;
};
export type ReminderUncheckedUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReminderUncheckedUpdateManyWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReminderCreateManyProfileInput = {
    id?: string;
    eventId: string;
    triggerType: $Enums.ReminderType;
    isTriggered?: boolean;
    createdAt?: Date | string;
};
export type ReminderUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    event?: Prisma.EventUpdateOneRequiredWithoutRemindersNestedInput;
};
export type ReminderUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReminderUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    triggerType?: Prisma.EnumReminderTypeFieldUpdateOperationsInput | $Enums.ReminderType;
    isTriggered?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReminderSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    triggerType?: boolean;
    isTriggered?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reminder"]>;
export type ReminderSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    triggerType?: boolean;
    isTriggered?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reminder"]>;
export type ReminderSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    triggerType?: boolean;
    isTriggered?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reminder"]>;
export type ReminderSelectScalar = {
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    triggerType?: boolean;
    isTriggered?: boolean;
    createdAt?: boolean;
};
export type ReminderOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "eventId" | "triggerType" | "isTriggered" | "createdAt", ExtArgs["result"]["reminder"]>;
export type ReminderInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type ReminderIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type ReminderIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type $ReminderPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Reminder";
    objects: {
        profile: Prisma.$ProfilePayload<ExtArgs>;
        event: Prisma.$EventPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        eventId: string;
        triggerType: $Enums.ReminderType;
        isTriggered: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["reminder"]>;
    composites: {};
};
export type ReminderGetPayload<S extends boolean | null | undefined | ReminderDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReminderPayload, S>;
export type ReminderCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReminderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReminderCountAggregateInputType | true;
};
export interface ReminderDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Reminder'];
        meta: {
            name: 'Reminder';
        };
    };
    findUnique<T extends ReminderFindUniqueArgs>(args: Prisma.SelectSubset<T, ReminderFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReminderClient<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReminderFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReminderFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReminderClient<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReminderFindFirstArgs>(args?: Prisma.SelectSubset<T, ReminderFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReminderClient<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReminderFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReminderFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReminderClient<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReminderFindManyArgs>(args?: Prisma.SelectSubset<T, ReminderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReminderCreateArgs>(args: Prisma.SelectSubset<T, ReminderCreateArgs<ExtArgs>>): Prisma.Prisma__ReminderClient<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReminderCreateManyArgs>(args?: Prisma.SelectSubset<T, ReminderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReminderCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReminderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReminderDeleteArgs>(args: Prisma.SelectSubset<T, ReminderDeleteArgs<ExtArgs>>): Prisma.Prisma__ReminderClient<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReminderUpdateArgs>(args: Prisma.SelectSubset<T, ReminderUpdateArgs<ExtArgs>>): Prisma.Prisma__ReminderClient<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReminderDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReminderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReminderUpdateManyArgs>(args: Prisma.SelectSubset<T, ReminderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReminderUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReminderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReminderUpsertArgs>(args: Prisma.SelectSubset<T, ReminderUpsertArgs<ExtArgs>>): Prisma.Prisma__ReminderClient<runtime.Types.Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReminderCountArgs>(args?: Prisma.Subset<T, ReminderCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReminderCountAggregateOutputType> : number>;
    aggregate<T extends ReminderAggregateArgs>(args: Prisma.Subset<T, ReminderAggregateArgs>): Prisma.PrismaPromise<GetReminderAggregateType<T>>;
    groupBy<T extends ReminderGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReminderGroupByArgs['orderBy'];
    } : {
        orderBy?: ReminderGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReminderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReminderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReminderFieldRefs;
}
export interface Prisma__ReminderClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    profile<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReminderFieldRefs {
    readonly id: Prisma.FieldRef<"Reminder", 'String'>;
    readonly userId: Prisma.FieldRef<"Reminder", 'String'>;
    readonly eventId: Prisma.FieldRef<"Reminder", 'String'>;
    readonly triggerType: Prisma.FieldRef<"Reminder", 'ReminderType'>;
    readonly isTriggered: Prisma.FieldRef<"Reminder", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Reminder", 'DateTime'>;
}
export type ReminderFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelect<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    include?: Prisma.ReminderInclude<ExtArgs> | null;
    where: Prisma.ReminderWhereUniqueInput;
};
export type ReminderFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelect<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    include?: Prisma.ReminderInclude<ExtArgs> | null;
    where: Prisma.ReminderWhereUniqueInput;
};
export type ReminderFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReminderFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReminderFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReminderCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelect<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    include?: Prisma.ReminderInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReminderCreateInput, Prisma.ReminderUncheckedCreateInput>;
};
export type ReminderCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReminderCreateManyInput | Prisma.ReminderCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReminderCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    data: Prisma.ReminderCreateManyInput | Prisma.ReminderCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReminderIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReminderUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelect<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    include?: Prisma.ReminderInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReminderUpdateInput, Prisma.ReminderUncheckedUpdateInput>;
    where: Prisma.ReminderWhereUniqueInput;
};
export type ReminderUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReminderUpdateManyMutationInput, Prisma.ReminderUncheckedUpdateManyInput>;
    where?: Prisma.ReminderWhereInput;
    limit?: number;
};
export type ReminderUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReminderUpdateManyMutationInput, Prisma.ReminderUncheckedUpdateManyInput>;
    where?: Prisma.ReminderWhereInput;
    limit?: number;
    include?: Prisma.ReminderIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReminderUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelect<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    include?: Prisma.ReminderInclude<ExtArgs> | null;
    where: Prisma.ReminderWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReminderCreateInput, Prisma.ReminderUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReminderUpdateInput, Prisma.ReminderUncheckedUpdateInput>;
};
export type ReminderDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelect<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    include?: Prisma.ReminderInclude<ExtArgs> | null;
    where: Prisma.ReminderWhereUniqueInput;
};
export type ReminderDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReminderWhereInput;
    limit?: number;
};
export type ReminderDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReminderSelect<ExtArgs> | null;
    omit?: Prisma.ReminderOmit<ExtArgs> | null;
    include?: Prisma.ReminderInclude<ExtArgs> | null;
};
