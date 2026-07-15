import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserCalendarModel = runtime.Types.Result.DefaultSelection<Prisma.$UserCalendarPayload>;
export type AggregateUserCalendar = {
    _count: UserCalendarCountAggregateOutputType | null;
    _min: UserCalendarMinAggregateOutputType | null;
    _max: UserCalendarMaxAggregateOutputType | null;
};
export type UserCalendarMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventId: string | null;
    createdAt: Date | null;
};
export type UserCalendarMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventId: string | null;
    createdAt: Date | null;
};
export type UserCalendarCountAggregateOutputType = {
    id: number;
    userId: number;
    eventId: number;
    createdAt: number;
    _all: number;
};
export type UserCalendarMinAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    createdAt?: true;
};
export type UserCalendarMaxAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    createdAt?: true;
};
export type UserCalendarCountAggregateInputType = {
    id?: true;
    userId?: true;
    eventId?: true;
    createdAt?: true;
    _all?: true;
};
export type UserCalendarAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCalendarWhereInput;
    orderBy?: Prisma.UserCalendarOrderByWithRelationInput | Prisma.UserCalendarOrderByWithRelationInput[];
    cursor?: Prisma.UserCalendarWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCalendarCountAggregateInputType;
    _min?: UserCalendarMinAggregateInputType;
    _max?: UserCalendarMaxAggregateInputType;
};
export type GetUserCalendarAggregateType<T extends UserCalendarAggregateArgs> = {
    [P in keyof T & keyof AggregateUserCalendar]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserCalendar[P]> : Prisma.GetScalarType<T[P], AggregateUserCalendar[P]>;
};
export type UserCalendarGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCalendarWhereInput;
    orderBy?: Prisma.UserCalendarOrderByWithAggregationInput | Prisma.UserCalendarOrderByWithAggregationInput[];
    by: Prisma.UserCalendarScalarFieldEnum[] | Prisma.UserCalendarScalarFieldEnum;
    having?: Prisma.UserCalendarScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCalendarCountAggregateInputType | true;
    _min?: UserCalendarMinAggregateInputType;
    _max?: UserCalendarMaxAggregateInputType;
};
export type UserCalendarGroupByOutputType = {
    id: string;
    userId: string;
    eventId: string;
    createdAt: Date;
    _count: UserCalendarCountAggregateOutputType | null;
    _min: UserCalendarMinAggregateOutputType | null;
    _max: UserCalendarMaxAggregateOutputType | null;
};
export type GetUserCalendarGroupByPayload<T extends UserCalendarGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserCalendarGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserCalendarGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserCalendarGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserCalendarGroupByOutputType[P]>;
}>>;
export type UserCalendarWhereInput = {
    AND?: Prisma.UserCalendarWhereInput | Prisma.UserCalendarWhereInput[];
    OR?: Prisma.UserCalendarWhereInput[];
    NOT?: Prisma.UserCalendarWhereInput | Prisma.UserCalendarWhereInput[];
    id?: Prisma.UuidFilter<"UserCalendar"> | string;
    userId?: Prisma.UuidFilter<"UserCalendar"> | string;
    eventId?: Prisma.UuidFilter<"UserCalendar"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserCalendar"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
};
export type UserCalendarOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    profile?: Prisma.ProfileOrderByWithRelationInput;
    event?: Prisma.EventOrderByWithRelationInput;
};
export type UserCalendarWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    unique_user_event_calendar?: Prisma.UserCalendarUnique_user_event_calendarCompoundUniqueInput;
    AND?: Prisma.UserCalendarWhereInput | Prisma.UserCalendarWhereInput[];
    OR?: Prisma.UserCalendarWhereInput[];
    NOT?: Prisma.UserCalendarWhereInput | Prisma.UserCalendarWhereInput[];
    userId?: Prisma.UuidFilter<"UserCalendar"> | string;
    eventId?: Prisma.UuidFilter<"UserCalendar"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserCalendar"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
}, "id" | "unique_user_event_calendar">;
export type UserCalendarOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.UserCalendarCountOrderByAggregateInput;
    _max?: Prisma.UserCalendarMaxOrderByAggregateInput;
    _min?: Prisma.UserCalendarMinOrderByAggregateInput;
};
export type UserCalendarScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserCalendarScalarWhereWithAggregatesInput | Prisma.UserCalendarScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserCalendarScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserCalendarScalarWhereWithAggregatesInput | Prisma.UserCalendarScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"UserCalendar"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"UserCalendar"> | string;
    eventId?: Prisma.UuidWithAggregatesFilter<"UserCalendar"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserCalendar"> | Date | string;
};
export type UserCalendarCreateInput = {
    id?: string;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutUserCalendarsInput;
    event: Prisma.EventCreateNestedOneWithoutUserCalendarsInput;
};
export type UserCalendarUncheckedCreateInput = {
    id?: string;
    userId: string;
    eventId: string;
    createdAt?: Date | string;
};
export type UserCalendarUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutUserCalendarsNestedInput;
    event?: Prisma.EventUpdateOneRequiredWithoutUserCalendarsNestedInput;
};
export type UserCalendarUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCalendarCreateManyInput = {
    id?: string;
    userId: string;
    eventId: string;
    createdAt?: Date | string;
};
export type UserCalendarUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCalendarUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCalendarListRelationFilter = {
    every?: Prisma.UserCalendarWhereInput;
    some?: Prisma.UserCalendarWhereInput;
    none?: Prisma.UserCalendarWhereInput;
};
export type UserCalendarOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserCalendarUnique_user_event_calendarCompoundUniqueInput = {
    userId: string;
    eventId: string;
};
export type UserCalendarCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserCalendarMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserCalendarMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserCalendarCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.UserCalendarCreateWithoutEventInput, Prisma.UserCalendarUncheckedCreateWithoutEventInput> | Prisma.UserCalendarCreateWithoutEventInput[] | Prisma.UserCalendarUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.UserCalendarCreateOrConnectWithoutEventInput | Prisma.UserCalendarCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.UserCalendarCreateManyEventInputEnvelope;
    connect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
};
export type UserCalendarUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.UserCalendarCreateWithoutEventInput, Prisma.UserCalendarUncheckedCreateWithoutEventInput> | Prisma.UserCalendarCreateWithoutEventInput[] | Prisma.UserCalendarUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.UserCalendarCreateOrConnectWithoutEventInput | Prisma.UserCalendarCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.UserCalendarCreateManyEventInputEnvelope;
    connect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
};
export type UserCalendarUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.UserCalendarCreateWithoutEventInput, Prisma.UserCalendarUncheckedCreateWithoutEventInput> | Prisma.UserCalendarCreateWithoutEventInput[] | Prisma.UserCalendarUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.UserCalendarCreateOrConnectWithoutEventInput | Prisma.UserCalendarCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.UserCalendarUpsertWithWhereUniqueWithoutEventInput | Prisma.UserCalendarUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.UserCalendarCreateManyEventInputEnvelope;
    set?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    disconnect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    delete?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    connect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    update?: Prisma.UserCalendarUpdateWithWhereUniqueWithoutEventInput | Prisma.UserCalendarUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.UserCalendarUpdateManyWithWhereWithoutEventInput | Prisma.UserCalendarUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.UserCalendarScalarWhereInput | Prisma.UserCalendarScalarWhereInput[];
};
export type UserCalendarUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.UserCalendarCreateWithoutEventInput, Prisma.UserCalendarUncheckedCreateWithoutEventInput> | Prisma.UserCalendarCreateWithoutEventInput[] | Prisma.UserCalendarUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.UserCalendarCreateOrConnectWithoutEventInput | Prisma.UserCalendarCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.UserCalendarUpsertWithWhereUniqueWithoutEventInput | Prisma.UserCalendarUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.UserCalendarCreateManyEventInputEnvelope;
    set?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    disconnect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    delete?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    connect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    update?: Prisma.UserCalendarUpdateWithWhereUniqueWithoutEventInput | Prisma.UserCalendarUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.UserCalendarUpdateManyWithWhereWithoutEventInput | Prisma.UserCalendarUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.UserCalendarScalarWhereInput | Prisma.UserCalendarScalarWhereInput[];
};
export type UserCalendarCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.UserCalendarCreateWithoutProfileInput, Prisma.UserCalendarUncheckedCreateWithoutProfileInput> | Prisma.UserCalendarCreateWithoutProfileInput[] | Prisma.UserCalendarUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.UserCalendarCreateOrConnectWithoutProfileInput | Prisma.UserCalendarCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.UserCalendarCreateManyProfileInputEnvelope;
    connect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
};
export type UserCalendarUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.UserCalendarCreateWithoutProfileInput, Prisma.UserCalendarUncheckedCreateWithoutProfileInput> | Prisma.UserCalendarCreateWithoutProfileInput[] | Prisma.UserCalendarUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.UserCalendarCreateOrConnectWithoutProfileInput | Prisma.UserCalendarCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.UserCalendarCreateManyProfileInputEnvelope;
    connect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
};
export type UserCalendarUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.UserCalendarCreateWithoutProfileInput, Prisma.UserCalendarUncheckedCreateWithoutProfileInput> | Prisma.UserCalendarCreateWithoutProfileInput[] | Prisma.UserCalendarUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.UserCalendarCreateOrConnectWithoutProfileInput | Prisma.UserCalendarCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.UserCalendarUpsertWithWhereUniqueWithoutProfileInput | Prisma.UserCalendarUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.UserCalendarCreateManyProfileInputEnvelope;
    set?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    disconnect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    delete?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    connect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    update?: Prisma.UserCalendarUpdateWithWhereUniqueWithoutProfileInput | Prisma.UserCalendarUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.UserCalendarUpdateManyWithWhereWithoutProfileInput | Prisma.UserCalendarUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.UserCalendarScalarWhereInput | Prisma.UserCalendarScalarWhereInput[];
};
export type UserCalendarUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.UserCalendarCreateWithoutProfileInput, Prisma.UserCalendarUncheckedCreateWithoutProfileInput> | Prisma.UserCalendarCreateWithoutProfileInput[] | Prisma.UserCalendarUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.UserCalendarCreateOrConnectWithoutProfileInput | Prisma.UserCalendarCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.UserCalendarUpsertWithWhereUniqueWithoutProfileInput | Prisma.UserCalendarUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.UserCalendarCreateManyProfileInputEnvelope;
    set?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    disconnect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    delete?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    connect?: Prisma.UserCalendarWhereUniqueInput | Prisma.UserCalendarWhereUniqueInput[];
    update?: Prisma.UserCalendarUpdateWithWhereUniqueWithoutProfileInput | Prisma.UserCalendarUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.UserCalendarUpdateManyWithWhereWithoutProfileInput | Prisma.UserCalendarUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.UserCalendarScalarWhereInput | Prisma.UserCalendarScalarWhereInput[];
};
export type UserCalendarCreateWithoutEventInput = {
    id?: string;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutUserCalendarsInput;
};
export type UserCalendarUncheckedCreateWithoutEventInput = {
    id?: string;
    userId: string;
    createdAt?: Date | string;
};
export type UserCalendarCreateOrConnectWithoutEventInput = {
    where: Prisma.UserCalendarWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCalendarCreateWithoutEventInput, Prisma.UserCalendarUncheckedCreateWithoutEventInput>;
};
export type UserCalendarCreateManyEventInputEnvelope = {
    data: Prisma.UserCalendarCreateManyEventInput | Prisma.UserCalendarCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type UserCalendarUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.UserCalendarWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserCalendarUpdateWithoutEventInput, Prisma.UserCalendarUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.UserCalendarCreateWithoutEventInput, Prisma.UserCalendarUncheckedCreateWithoutEventInput>;
};
export type UserCalendarUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.UserCalendarWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserCalendarUpdateWithoutEventInput, Prisma.UserCalendarUncheckedUpdateWithoutEventInput>;
};
export type UserCalendarUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.UserCalendarScalarWhereInput;
    data: Prisma.XOR<Prisma.UserCalendarUpdateManyMutationInput, Prisma.UserCalendarUncheckedUpdateManyWithoutEventInput>;
};
export type UserCalendarScalarWhereInput = {
    AND?: Prisma.UserCalendarScalarWhereInput | Prisma.UserCalendarScalarWhereInput[];
    OR?: Prisma.UserCalendarScalarWhereInput[];
    NOT?: Prisma.UserCalendarScalarWhereInput | Prisma.UserCalendarScalarWhereInput[];
    id?: Prisma.UuidFilter<"UserCalendar"> | string;
    userId?: Prisma.UuidFilter<"UserCalendar"> | string;
    eventId?: Prisma.UuidFilter<"UserCalendar"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserCalendar"> | Date | string;
};
export type UserCalendarCreateWithoutProfileInput = {
    id?: string;
    createdAt?: Date | string;
    event: Prisma.EventCreateNestedOneWithoutUserCalendarsInput;
};
export type UserCalendarUncheckedCreateWithoutProfileInput = {
    id?: string;
    eventId: string;
    createdAt?: Date | string;
};
export type UserCalendarCreateOrConnectWithoutProfileInput = {
    where: Prisma.UserCalendarWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCalendarCreateWithoutProfileInput, Prisma.UserCalendarUncheckedCreateWithoutProfileInput>;
};
export type UserCalendarCreateManyProfileInputEnvelope = {
    data: Prisma.UserCalendarCreateManyProfileInput | Prisma.UserCalendarCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type UserCalendarUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.UserCalendarWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserCalendarUpdateWithoutProfileInput, Prisma.UserCalendarUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.UserCalendarCreateWithoutProfileInput, Prisma.UserCalendarUncheckedCreateWithoutProfileInput>;
};
export type UserCalendarUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.UserCalendarWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserCalendarUpdateWithoutProfileInput, Prisma.UserCalendarUncheckedUpdateWithoutProfileInput>;
};
export type UserCalendarUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.UserCalendarScalarWhereInput;
    data: Prisma.XOR<Prisma.UserCalendarUpdateManyMutationInput, Prisma.UserCalendarUncheckedUpdateManyWithoutProfileInput>;
};
export type UserCalendarCreateManyEventInput = {
    id?: string;
    userId: string;
    createdAt?: Date | string;
};
export type UserCalendarUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutUserCalendarsNestedInput;
};
export type UserCalendarUncheckedUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCalendarUncheckedUpdateManyWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCalendarCreateManyProfileInput = {
    id?: string;
    eventId: string;
    createdAt?: Date | string;
};
export type UserCalendarUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    event?: Prisma.EventUpdateOneRequiredWithoutUserCalendarsNestedInput;
};
export type UserCalendarUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCalendarUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCalendarSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userCalendar"]>;
export type UserCalendarSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userCalendar"]>;
export type UserCalendarSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userCalendar"]>;
export type UserCalendarSelectScalar = {
    id?: boolean;
    userId?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
};
export type UserCalendarOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "eventId" | "createdAt", ExtArgs["result"]["userCalendar"]>;
export type UserCalendarInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type UserCalendarIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type UserCalendarIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type $UserCalendarPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserCalendar";
    objects: {
        profile: Prisma.$ProfilePayload<ExtArgs>;
        event: Prisma.$EventPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        eventId: string;
        createdAt: Date;
    }, ExtArgs["result"]["userCalendar"]>;
    composites: {};
};
export type UserCalendarGetPayload<S extends boolean | null | undefined | UserCalendarDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload, S>;
export type UserCalendarCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserCalendarFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCalendarCountAggregateInputType | true;
};
export interface UserCalendarDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserCalendar'];
        meta: {
            name: 'UserCalendar';
        };
    };
    findUnique<T extends UserCalendarFindUniqueArgs>(args: Prisma.SelectSubset<T, UserCalendarFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserCalendarClient<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserCalendarFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserCalendarFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserCalendarClient<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserCalendarFindFirstArgs>(args?: Prisma.SelectSubset<T, UserCalendarFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserCalendarClient<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserCalendarFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserCalendarFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserCalendarClient<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserCalendarFindManyArgs>(args?: Prisma.SelectSubset<T, UserCalendarFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCalendarCreateArgs>(args: Prisma.SelectSubset<T, UserCalendarCreateArgs<ExtArgs>>): Prisma.Prisma__UserCalendarClient<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCalendarCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCalendarCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCalendarCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCalendarCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserCalendarDeleteArgs>(args: Prisma.SelectSubset<T, UserCalendarDeleteArgs<ExtArgs>>): Prisma.Prisma__UserCalendarClient<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserCalendarUpdateArgs>(args: Prisma.SelectSubset<T, UserCalendarUpdateArgs<ExtArgs>>): Prisma.Prisma__UserCalendarClient<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserCalendarDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserCalendarDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserCalendarUpdateManyArgs>(args: Prisma.SelectSubset<T, UserCalendarUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserCalendarUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserCalendarUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserCalendarUpsertArgs>(args: Prisma.SelectSubset<T, UserCalendarUpsertArgs<ExtArgs>>): Prisma.Prisma__UserCalendarClient<runtime.Types.Result.GetResult<Prisma.$UserCalendarPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCalendarCountArgs>(args?: Prisma.Subset<T, UserCalendarCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCalendarCountAggregateOutputType> : number>;
    aggregate<T extends UserCalendarAggregateArgs>(args: Prisma.Subset<T, UserCalendarAggregateArgs>): Prisma.PrismaPromise<GetUserCalendarAggregateType<T>>;
    groupBy<T extends UserCalendarGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserCalendarGroupByArgs['orderBy'];
    } : {
        orderBy?: UserCalendarGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserCalendarGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCalendarGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserCalendarFieldRefs;
}
export interface Prisma__UserCalendarClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    profile<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserCalendarFieldRefs {
    readonly id: Prisma.FieldRef<"UserCalendar", 'String'>;
    readonly userId: Prisma.FieldRef<"UserCalendar", 'String'>;
    readonly eventId: Prisma.FieldRef<"UserCalendar", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserCalendar", 'DateTime'>;
}
export type UserCalendarFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelect<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    include?: Prisma.UserCalendarInclude<ExtArgs> | null;
    where: Prisma.UserCalendarWhereUniqueInput;
};
export type UserCalendarFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelect<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    include?: Prisma.UserCalendarInclude<ExtArgs> | null;
    where: Prisma.UserCalendarWhereUniqueInput;
};
export type UserCalendarFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserCalendarFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserCalendarFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserCalendarCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelect<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    include?: Prisma.UserCalendarInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCalendarCreateInput, Prisma.UserCalendarUncheckedCreateInput>;
};
export type UserCalendarCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCalendarCreateManyInput | Prisma.UserCalendarCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCalendarCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    data: Prisma.UserCalendarCreateManyInput | Prisma.UserCalendarCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserCalendarIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserCalendarUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelect<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    include?: Prisma.UserCalendarInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCalendarUpdateInput, Prisma.UserCalendarUncheckedUpdateInput>;
    where: Prisma.UserCalendarWhereUniqueInput;
};
export type UserCalendarUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserCalendarUpdateManyMutationInput, Prisma.UserCalendarUncheckedUpdateManyInput>;
    where?: Prisma.UserCalendarWhereInput;
    limit?: number;
};
export type UserCalendarUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCalendarUpdateManyMutationInput, Prisma.UserCalendarUncheckedUpdateManyInput>;
    where?: Prisma.UserCalendarWhereInput;
    limit?: number;
    include?: Prisma.UserCalendarIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserCalendarUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelect<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    include?: Prisma.UserCalendarInclude<ExtArgs> | null;
    where: Prisma.UserCalendarWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCalendarCreateInput, Prisma.UserCalendarUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserCalendarUpdateInput, Prisma.UserCalendarUncheckedUpdateInput>;
};
export type UserCalendarDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelect<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    include?: Prisma.UserCalendarInclude<ExtArgs> | null;
    where: Prisma.UserCalendarWhereUniqueInput;
};
export type UserCalendarDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCalendarWhereInput;
    limit?: number;
};
export type UserCalendarDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCalendarSelect<ExtArgs> | null;
    omit?: Prisma.UserCalendarOmit<ExtArgs> | null;
    include?: Prisma.UserCalendarInclude<ExtArgs> | null;
};
