import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ActivityLogModel = runtime.Types.Result.DefaultSelection<Prisma.$ActivityLogPayload>;
export type AggregateActivityLog = {
    _count: ActivityLogCountAggregateOutputType | null;
    _min: ActivityLogMinAggregateOutputType | null;
    _max: ActivityLogMaxAggregateOutputType | null;
};
export type ActivityLogMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    userDisplayName: string | null;
    actionType: $Enums.ActivityAction | null;
    targetId: string | null;
    targetName: string | null;
    createdAt: Date | null;
};
export type ActivityLogMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    userDisplayName: string | null;
    actionType: $Enums.ActivityAction | null;
    targetId: string | null;
    targetName: string | null;
    createdAt: Date | null;
};
export type ActivityLogCountAggregateOutputType = {
    id: number;
    userId: number;
    userDisplayName: number;
    actionType: number;
    targetId: number;
    targetName: number;
    createdAt: number;
    _all: number;
};
export type ActivityLogMinAggregateInputType = {
    id?: true;
    userId?: true;
    userDisplayName?: true;
    actionType?: true;
    targetId?: true;
    targetName?: true;
    createdAt?: true;
};
export type ActivityLogMaxAggregateInputType = {
    id?: true;
    userId?: true;
    userDisplayName?: true;
    actionType?: true;
    targetId?: true;
    targetName?: true;
    createdAt?: true;
};
export type ActivityLogCountAggregateInputType = {
    id?: true;
    userId?: true;
    userDisplayName?: true;
    actionType?: true;
    targetId?: true;
    targetName?: true;
    createdAt?: true;
    _all?: true;
};
export type ActivityLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithRelationInput | Prisma.ActivityLogOrderByWithRelationInput[];
    cursor?: Prisma.ActivityLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ActivityLogCountAggregateInputType;
    _min?: ActivityLogMinAggregateInputType;
    _max?: ActivityLogMaxAggregateInputType;
};
export type GetActivityLogAggregateType<T extends ActivityLogAggregateArgs> = {
    [P in keyof T & keyof AggregateActivityLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateActivityLog[P]> : Prisma.GetScalarType<T[P], AggregateActivityLog[P]>;
};
export type ActivityLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithAggregationInput | Prisma.ActivityLogOrderByWithAggregationInput[];
    by: Prisma.ActivityLogScalarFieldEnum[] | Prisma.ActivityLogScalarFieldEnum;
    having?: Prisma.ActivityLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ActivityLogCountAggregateInputType | true;
    _min?: ActivityLogMinAggregateInputType;
    _max?: ActivityLogMaxAggregateInputType;
};
export type ActivityLogGroupByOutputType = {
    id: string;
    userId: string | null;
    userDisplayName: string | null;
    actionType: $Enums.ActivityAction;
    targetId: string;
    targetName: string;
    createdAt: Date;
    _count: ActivityLogCountAggregateOutputType | null;
    _min: ActivityLogMinAggregateOutputType | null;
    _max: ActivityLogMaxAggregateOutputType | null;
};
export type GetActivityLogGroupByPayload<T extends ActivityLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ActivityLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ActivityLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ActivityLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ActivityLogGroupByOutputType[P]>;
}>>;
export type ActivityLogWhereInput = {
    AND?: Prisma.ActivityLogWhereInput | Prisma.ActivityLogWhereInput[];
    OR?: Prisma.ActivityLogWhereInput[];
    NOT?: Prisma.ActivityLogWhereInput | Prisma.ActivityLogWhereInput[];
    id?: Prisma.UuidFilter<"ActivityLog"> | string;
    userId?: Prisma.UuidNullableFilter<"ActivityLog"> | string | null;
    userDisplayName?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    actionType?: Prisma.EnumActivityActionFilter<"ActivityLog"> | $Enums.ActivityAction;
    targetId?: Prisma.UuidFilter<"ActivityLog"> | string;
    targetName?: Prisma.StringFilter<"ActivityLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"ActivityLog"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileNullableScalarRelationFilter, Prisma.ProfileWhereInput> | null;
};
export type ActivityLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    userDisplayName?: Prisma.SortOrderInput | Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    targetName?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    profile?: Prisma.ProfileOrderByWithRelationInput;
};
export type ActivityLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ActivityLogWhereInput | Prisma.ActivityLogWhereInput[];
    OR?: Prisma.ActivityLogWhereInput[];
    NOT?: Prisma.ActivityLogWhereInput | Prisma.ActivityLogWhereInput[];
    userId?: Prisma.UuidNullableFilter<"ActivityLog"> | string | null;
    userDisplayName?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    actionType?: Prisma.EnumActivityActionFilter<"ActivityLog"> | $Enums.ActivityAction;
    targetId?: Prisma.UuidFilter<"ActivityLog"> | string;
    targetName?: Prisma.StringFilter<"ActivityLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"ActivityLog"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileNullableScalarRelationFilter, Prisma.ProfileWhereInput> | null;
}, "id">;
export type ActivityLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    userDisplayName?: Prisma.SortOrderInput | Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    targetName?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ActivityLogCountOrderByAggregateInput;
    _max?: Prisma.ActivityLogMaxOrderByAggregateInput;
    _min?: Prisma.ActivityLogMinOrderByAggregateInput;
};
export type ActivityLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.ActivityLogScalarWhereWithAggregatesInput | Prisma.ActivityLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.ActivityLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ActivityLogScalarWhereWithAggregatesInput | Prisma.ActivityLogScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"ActivityLog"> | string;
    userId?: Prisma.UuidNullableWithAggregatesFilter<"ActivityLog"> | string | null;
    userDisplayName?: Prisma.StringNullableWithAggregatesFilter<"ActivityLog"> | string | null;
    actionType?: Prisma.EnumActivityActionWithAggregatesFilter<"ActivityLog"> | $Enums.ActivityAction;
    targetId?: Prisma.UuidWithAggregatesFilter<"ActivityLog"> | string;
    targetName?: Prisma.StringWithAggregatesFilter<"ActivityLog"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ActivityLog"> | Date | string;
};
export type ActivityLogCreateInput = {
    id?: string;
    userDisplayName?: string | null;
    actionType: $Enums.ActivityAction;
    targetId: string;
    targetName: string;
    createdAt?: Date | string;
    profile?: Prisma.ProfileCreateNestedOneWithoutActivityLogsInput;
};
export type ActivityLogUncheckedCreateInput = {
    id?: string;
    userId?: string | null;
    userDisplayName?: string | null;
    actionType: $Enums.ActivityAction;
    targetId: string;
    targetName: string;
    createdAt?: Date | string;
};
export type ActivityLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userDisplayName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumActivityActionFieldUpdateOperationsInput | $Enums.ActivityAction;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetName?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneWithoutActivityLogsNestedInput;
};
export type ActivityLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userDisplayName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumActivityActionFieldUpdateOperationsInput | $Enums.ActivityAction;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetName?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogCreateManyInput = {
    id?: string;
    userId?: string | null;
    userDisplayName?: string | null;
    actionType: $Enums.ActivityAction;
    targetId: string;
    targetName: string;
    createdAt?: Date | string;
};
export type ActivityLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userDisplayName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumActivityActionFieldUpdateOperationsInput | $Enums.ActivityAction;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetName?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userDisplayName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumActivityActionFieldUpdateOperationsInput | $Enums.ActivityAction;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetName?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogListRelationFilter = {
    every?: Prisma.ActivityLogWhereInput;
    some?: Prisma.ActivityLogWhereInput;
    none?: Prisma.ActivityLogWhereInput;
};
export type ActivityLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ActivityLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    userDisplayName?: Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    targetName?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ActivityLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    userDisplayName?: Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    targetName?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ActivityLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    userDisplayName?: Prisma.SortOrder;
    actionType?: Prisma.SortOrder;
    targetId?: Prisma.SortOrder;
    targetName?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ActivityLogCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutProfileInput, Prisma.ActivityLogUncheckedCreateWithoutProfileInput> | Prisma.ActivityLogCreateWithoutProfileInput[] | Prisma.ActivityLogUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutProfileInput | Prisma.ActivityLogCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.ActivityLogCreateManyProfileInputEnvelope;
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
};
export type ActivityLogUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutProfileInput, Prisma.ActivityLogUncheckedCreateWithoutProfileInput> | Prisma.ActivityLogCreateWithoutProfileInput[] | Prisma.ActivityLogUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutProfileInput | Prisma.ActivityLogCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.ActivityLogCreateManyProfileInputEnvelope;
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
};
export type ActivityLogUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutProfileInput, Prisma.ActivityLogUncheckedCreateWithoutProfileInput> | Prisma.ActivityLogCreateWithoutProfileInput[] | Prisma.ActivityLogUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutProfileInput | Prisma.ActivityLogCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.ActivityLogUpsertWithWhereUniqueWithoutProfileInput | Prisma.ActivityLogUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.ActivityLogCreateManyProfileInputEnvelope;
    set?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    disconnect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    delete?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    update?: Prisma.ActivityLogUpdateWithWhereUniqueWithoutProfileInput | Prisma.ActivityLogUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.ActivityLogUpdateManyWithWhereWithoutProfileInput | Prisma.ActivityLogUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
};
export type ActivityLogUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutProfileInput, Prisma.ActivityLogUncheckedCreateWithoutProfileInput> | Prisma.ActivityLogCreateWithoutProfileInput[] | Prisma.ActivityLogUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutProfileInput | Prisma.ActivityLogCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.ActivityLogUpsertWithWhereUniqueWithoutProfileInput | Prisma.ActivityLogUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.ActivityLogCreateManyProfileInputEnvelope;
    set?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    disconnect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    delete?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    update?: Prisma.ActivityLogUpdateWithWhereUniqueWithoutProfileInput | Prisma.ActivityLogUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.ActivityLogUpdateManyWithWhereWithoutProfileInput | Prisma.ActivityLogUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
};
export type EnumActivityActionFieldUpdateOperationsInput = {
    set?: $Enums.ActivityAction;
};
export type ActivityLogCreateWithoutProfileInput = {
    id?: string;
    userDisplayName?: string | null;
    actionType: $Enums.ActivityAction;
    targetId: string;
    targetName: string;
    createdAt?: Date | string;
};
export type ActivityLogUncheckedCreateWithoutProfileInput = {
    id?: string;
    userDisplayName?: string | null;
    actionType: $Enums.ActivityAction;
    targetId: string;
    targetName: string;
    createdAt?: Date | string;
};
export type ActivityLogCreateOrConnectWithoutProfileInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.ActivityLogCreateWithoutProfileInput, Prisma.ActivityLogUncheckedCreateWithoutProfileInput>;
};
export type ActivityLogCreateManyProfileInputEnvelope = {
    data: Prisma.ActivityLogCreateManyProfileInput | Prisma.ActivityLogCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type ActivityLogUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.ActivityLogUpdateWithoutProfileInput, Prisma.ActivityLogUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.ActivityLogCreateWithoutProfileInput, Prisma.ActivityLogUncheckedCreateWithoutProfileInput>;
};
export type ActivityLogUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.ActivityLogUpdateWithoutProfileInput, Prisma.ActivityLogUncheckedUpdateWithoutProfileInput>;
};
export type ActivityLogUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.ActivityLogScalarWhereInput;
    data: Prisma.XOR<Prisma.ActivityLogUpdateManyMutationInput, Prisma.ActivityLogUncheckedUpdateManyWithoutProfileInput>;
};
export type ActivityLogScalarWhereInput = {
    AND?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
    OR?: Prisma.ActivityLogScalarWhereInput[];
    NOT?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
    id?: Prisma.UuidFilter<"ActivityLog"> | string;
    userId?: Prisma.UuidNullableFilter<"ActivityLog"> | string | null;
    userDisplayName?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    actionType?: Prisma.EnumActivityActionFilter<"ActivityLog"> | $Enums.ActivityAction;
    targetId?: Prisma.UuidFilter<"ActivityLog"> | string;
    targetName?: Prisma.StringFilter<"ActivityLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"ActivityLog"> | Date | string;
};
export type ActivityLogCreateManyProfileInput = {
    id?: string;
    userDisplayName?: string | null;
    actionType: $Enums.ActivityAction;
    targetId: string;
    targetName: string;
    createdAt?: Date | string;
};
export type ActivityLogUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userDisplayName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumActivityActionFieldUpdateOperationsInput | $Enums.ActivityAction;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetName?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userDisplayName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumActivityActionFieldUpdateOperationsInput | $Enums.ActivityAction;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetName?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userDisplayName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actionType?: Prisma.EnumActivityActionFieldUpdateOperationsInput | $Enums.ActivityAction;
    targetId?: Prisma.StringFieldUpdateOperationsInput | string;
    targetName?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    userDisplayName?: boolean;
    actionType?: boolean;
    targetId?: boolean;
    targetName?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ActivityLog$profileArgs<ExtArgs>;
}, ExtArgs["result"]["activityLog"]>;
export type ActivityLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    userDisplayName?: boolean;
    actionType?: boolean;
    targetId?: boolean;
    targetName?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ActivityLog$profileArgs<ExtArgs>;
}, ExtArgs["result"]["activityLog"]>;
export type ActivityLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    userDisplayName?: boolean;
    actionType?: boolean;
    targetId?: boolean;
    targetName?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.ActivityLog$profileArgs<ExtArgs>;
}, ExtArgs["result"]["activityLog"]>;
export type ActivityLogSelectScalar = {
    id?: boolean;
    userId?: boolean;
    userDisplayName?: boolean;
    actionType?: boolean;
    targetId?: boolean;
    targetName?: boolean;
    createdAt?: boolean;
};
export type ActivityLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "userDisplayName" | "actionType" | "targetId" | "targetName" | "createdAt", ExtArgs["result"]["activityLog"]>;
export type ActivityLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ActivityLog$profileArgs<ExtArgs>;
};
export type ActivityLogIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ActivityLog$profileArgs<ExtArgs>;
};
export type ActivityLogIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ActivityLog$profileArgs<ExtArgs>;
};
export type $ActivityLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ActivityLog";
    objects: {
        profile: Prisma.$ProfilePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string | null;
        userDisplayName: string | null;
        actionType: $Enums.ActivityAction;
        targetId: string;
        targetName: string;
        createdAt: Date;
    }, ExtArgs["result"]["activityLog"]>;
    composites: {};
};
export type ActivityLogGetPayload<S extends boolean | null | undefined | ActivityLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload, S>;
export type ActivityLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ActivityLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ActivityLogCountAggregateInputType | true;
};
export interface ActivityLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ActivityLog'];
        meta: {
            name: 'ActivityLog';
        };
    };
    findUnique<T extends ActivityLogFindUniqueArgs>(args: Prisma.SelectSubset<T, ActivityLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ActivityLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ActivityLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ActivityLogFindFirstArgs>(args?: Prisma.SelectSubset<T, ActivityLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ActivityLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ActivityLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ActivityLogFindManyArgs>(args?: Prisma.SelectSubset<T, ActivityLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ActivityLogCreateArgs>(args: Prisma.SelectSubset<T, ActivityLogCreateArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ActivityLogCreateManyArgs>(args?: Prisma.SelectSubset<T, ActivityLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ActivityLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ActivityLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ActivityLogDeleteArgs>(args: Prisma.SelectSubset<T, ActivityLogDeleteArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ActivityLogUpdateArgs>(args: Prisma.SelectSubset<T, ActivityLogUpdateArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ActivityLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, ActivityLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ActivityLogUpdateManyArgs>(args: Prisma.SelectSubset<T, ActivityLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ActivityLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ActivityLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ActivityLogUpsertArgs>(args: Prisma.SelectSubset<T, ActivityLogUpsertArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ActivityLogCountArgs>(args?: Prisma.Subset<T, ActivityLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ActivityLogCountAggregateOutputType> : number>;
    aggregate<T extends ActivityLogAggregateArgs>(args: Prisma.Subset<T, ActivityLogAggregateArgs>): Prisma.PrismaPromise<GetActivityLogAggregateType<T>>;
    groupBy<T extends ActivityLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ActivityLogGroupByArgs['orderBy'];
    } : {
        orderBy?: ActivityLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ActivityLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivityLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ActivityLogFieldRefs;
}
export interface Prisma__ActivityLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    profile<T extends Prisma.ActivityLog$profileArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ActivityLog$profileArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ActivityLogFieldRefs {
    readonly id: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly userId: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly userDisplayName: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly actionType: Prisma.FieldRef<"ActivityLog", 'ActivityAction'>;
    readonly targetId: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly targetName: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ActivityLog", 'DateTime'>;
}
export type ActivityLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where: Prisma.ActivityLogWhereUniqueInput;
};
export type ActivityLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where: Prisma.ActivityLogWhereUniqueInput;
};
export type ActivityLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ActivityLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ActivityLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ActivityLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityLogCreateInput, Prisma.ActivityLogUncheckedCreateInput>;
};
export type ActivityLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ActivityLogCreateManyInput | Prisma.ActivityLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ActivityLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    data: Prisma.ActivityLogCreateManyInput | Prisma.ActivityLogCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ActivityLogIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ActivityLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityLogUpdateInput, Prisma.ActivityLogUncheckedUpdateInput>;
    where: Prisma.ActivityLogWhereUniqueInput;
};
export type ActivityLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ActivityLogUpdateManyMutationInput, Prisma.ActivityLogUncheckedUpdateManyInput>;
    where?: Prisma.ActivityLogWhereInput;
    limit?: number;
};
export type ActivityLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityLogUpdateManyMutationInput, Prisma.ActivityLogUncheckedUpdateManyInput>;
    where?: Prisma.ActivityLogWhereInput;
    limit?: number;
    include?: Prisma.ActivityLogIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ActivityLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where: Prisma.ActivityLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.ActivityLogCreateInput, Prisma.ActivityLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ActivityLogUpdateInput, Prisma.ActivityLogUncheckedUpdateInput>;
};
export type ActivityLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where: Prisma.ActivityLogWhereUniqueInput;
};
export type ActivityLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
    limit?: number;
};
export type ActivityLog$profileArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
};
export type ActivityLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
};
