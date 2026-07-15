import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserFeedbackModel = runtime.Types.Result.DefaultSelection<Prisma.$UserFeedbackPayload>;
export type AggregateUserFeedback = {
    _count: UserFeedbackCountAggregateOutputType | null;
    _min: UserFeedbackMinAggregateOutputType | null;
    _max: UserFeedbackMaxAggregateOutputType | null;
};
export type UserFeedbackMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    feedbackType: $Enums.FeedbackType | null;
    message: string | null;
    createdAt: Date | null;
};
export type UserFeedbackMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    feedbackType: $Enums.FeedbackType | null;
    message: string | null;
    createdAt: Date | null;
};
export type UserFeedbackCountAggregateOutputType = {
    id: number;
    userId: number;
    feedbackType: number;
    message: number;
    createdAt: number;
    _all: number;
};
export type UserFeedbackMinAggregateInputType = {
    id?: true;
    userId?: true;
    feedbackType?: true;
    message?: true;
    createdAt?: true;
};
export type UserFeedbackMaxAggregateInputType = {
    id?: true;
    userId?: true;
    feedbackType?: true;
    message?: true;
    createdAt?: true;
};
export type UserFeedbackCountAggregateInputType = {
    id?: true;
    userId?: true;
    feedbackType?: true;
    message?: true;
    createdAt?: true;
    _all?: true;
};
export type UserFeedbackAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserFeedbackWhereInput;
    orderBy?: Prisma.UserFeedbackOrderByWithRelationInput | Prisma.UserFeedbackOrderByWithRelationInput[];
    cursor?: Prisma.UserFeedbackWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserFeedbackCountAggregateInputType;
    _min?: UserFeedbackMinAggregateInputType;
    _max?: UserFeedbackMaxAggregateInputType;
};
export type GetUserFeedbackAggregateType<T extends UserFeedbackAggregateArgs> = {
    [P in keyof T & keyof AggregateUserFeedback]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserFeedback[P]> : Prisma.GetScalarType<T[P], AggregateUserFeedback[P]>;
};
export type UserFeedbackGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserFeedbackWhereInput;
    orderBy?: Prisma.UserFeedbackOrderByWithAggregationInput | Prisma.UserFeedbackOrderByWithAggregationInput[];
    by: Prisma.UserFeedbackScalarFieldEnum[] | Prisma.UserFeedbackScalarFieldEnum;
    having?: Prisma.UserFeedbackScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserFeedbackCountAggregateInputType | true;
    _min?: UserFeedbackMinAggregateInputType;
    _max?: UserFeedbackMaxAggregateInputType;
};
export type UserFeedbackGroupByOutputType = {
    id: string;
    userId: string | null;
    feedbackType: $Enums.FeedbackType;
    message: string;
    createdAt: Date;
    _count: UserFeedbackCountAggregateOutputType | null;
    _min: UserFeedbackMinAggregateOutputType | null;
    _max: UserFeedbackMaxAggregateOutputType | null;
};
export type GetUserFeedbackGroupByPayload<T extends UserFeedbackGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserFeedbackGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserFeedbackGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserFeedbackGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserFeedbackGroupByOutputType[P]>;
}>>;
export type UserFeedbackWhereInput = {
    AND?: Prisma.UserFeedbackWhereInput | Prisma.UserFeedbackWhereInput[];
    OR?: Prisma.UserFeedbackWhereInput[];
    NOT?: Prisma.UserFeedbackWhereInput | Prisma.UserFeedbackWhereInput[];
    id?: Prisma.UuidFilter<"UserFeedback"> | string;
    userId?: Prisma.UuidNullableFilter<"UserFeedback"> | string | null;
    feedbackType?: Prisma.EnumFeedbackTypeFilter<"UserFeedback"> | $Enums.FeedbackType;
    message?: Prisma.StringFilter<"UserFeedback"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserFeedback"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileNullableScalarRelationFilter, Prisma.ProfileWhereInput> | null;
};
export type UserFeedbackOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    feedbackType?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    profile?: Prisma.ProfileOrderByWithRelationInput;
};
export type UserFeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.UserFeedbackWhereInput | Prisma.UserFeedbackWhereInput[];
    OR?: Prisma.UserFeedbackWhereInput[];
    NOT?: Prisma.UserFeedbackWhereInput | Prisma.UserFeedbackWhereInput[];
    userId?: Prisma.UuidNullableFilter<"UserFeedback"> | string | null;
    feedbackType?: Prisma.EnumFeedbackTypeFilter<"UserFeedback"> | $Enums.FeedbackType;
    message?: Prisma.StringFilter<"UserFeedback"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserFeedback"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileNullableScalarRelationFilter, Prisma.ProfileWhereInput> | null;
}, "id">;
export type UserFeedbackOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    feedbackType?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.UserFeedbackCountOrderByAggregateInput;
    _max?: Prisma.UserFeedbackMaxOrderByAggregateInput;
    _min?: Prisma.UserFeedbackMinOrderByAggregateInput;
};
export type UserFeedbackScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserFeedbackScalarWhereWithAggregatesInput | Prisma.UserFeedbackScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserFeedbackScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserFeedbackScalarWhereWithAggregatesInput | Prisma.UserFeedbackScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"UserFeedback"> | string;
    userId?: Prisma.UuidNullableWithAggregatesFilter<"UserFeedback"> | string | null;
    feedbackType?: Prisma.EnumFeedbackTypeWithAggregatesFilter<"UserFeedback"> | $Enums.FeedbackType;
    message?: Prisma.StringWithAggregatesFilter<"UserFeedback"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserFeedback"> | Date | string;
};
export type UserFeedbackCreateInput = {
    id?: string;
    feedbackType: $Enums.FeedbackType;
    message: string;
    createdAt?: Date | string;
    profile?: Prisma.ProfileCreateNestedOneWithoutUserFeedbacksInput;
};
export type UserFeedbackUncheckedCreateInput = {
    id?: string;
    userId?: string | null;
    feedbackType: $Enums.FeedbackType;
    message: string;
    createdAt?: Date | string;
};
export type UserFeedbackUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    feedbackType?: Prisma.EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneWithoutUserFeedbacksNestedInput;
};
export type UserFeedbackUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    feedbackType?: Prisma.EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserFeedbackCreateManyInput = {
    id?: string;
    userId?: string | null;
    feedbackType: $Enums.FeedbackType;
    message: string;
    createdAt?: Date | string;
};
export type UserFeedbackUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    feedbackType?: Prisma.EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserFeedbackUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    feedbackType?: Prisma.EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserFeedbackListRelationFilter = {
    every?: Prisma.UserFeedbackWhereInput;
    some?: Prisma.UserFeedbackWhereInput;
    none?: Prisma.UserFeedbackWhereInput;
};
export type UserFeedbackOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserFeedbackCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    feedbackType?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserFeedbackMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    feedbackType?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserFeedbackMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    feedbackType?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserFeedbackCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.UserFeedbackCreateWithoutProfileInput, Prisma.UserFeedbackUncheckedCreateWithoutProfileInput> | Prisma.UserFeedbackCreateWithoutProfileInput[] | Prisma.UserFeedbackUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.UserFeedbackCreateOrConnectWithoutProfileInput | Prisma.UserFeedbackCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.UserFeedbackCreateManyProfileInputEnvelope;
    connect?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
};
export type UserFeedbackUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.UserFeedbackCreateWithoutProfileInput, Prisma.UserFeedbackUncheckedCreateWithoutProfileInput> | Prisma.UserFeedbackCreateWithoutProfileInput[] | Prisma.UserFeedbackUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.UserFeedbackCreateOrConnectWithoutProfileInput | Prisma.UserFeedbackCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.UserFeedbackCreateManyProfileInputEnvelope;
    connect?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
};
export type UserFeedbackUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.UserFeedbackCreateWithoutProfileInput, Prisma.UserFeedbackUncheckedCreateWithoutProfileInput> | Prisma.UserFeedbackCreateWithoutProfileInput[] | Prisma.UserFeedbackUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.UserFeedbackCreateOrConnectWithoutProfileInput | Prisma.UserFeedbackCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.UserFeedbackUpsertWithWhereUniqueWithoutProfileInput | Prisma.UserFeedbackUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.UserFeedbackCreateManyProfileInputEnvelope;
    set?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
    disconnect?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
    delete?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
    connect?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
    update?: Prisma.UserFeedbackUpdateWithWhereUniqueWithoutProfileInput | Prisma.UserFeedbackUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.UserFeedbackUpdateManyWithWhereWithoutProfileInput | Prisma.UserFeedbackUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.UserFeedbackScalarWhereInput | Prisma.UserFeedbackScalarWhereInput[];
};
export type UserFeedbackUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.UserFeedbackCreateWithoutProfileInput, Prisma.UserFeedbackUncheckedCreateWithoutProfileInput> | Prisma.UserFeedbackCreateWithoutProfileInput[] | Prisma.UserFeedbackUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.UserFeedbackCreateOrConnectWithoutProfileInput | Prisma.UserFeedbackCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.UserFeedbackUpsertWithWhereUniqueWithoutProfileInput | Prisma.UserFeedbackUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.UserFeedbackCreateManyProfileInputEnvelope;
    set?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
    disconnect?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
    delete?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
    connect?: Prisma.UserFeedbackWhereUniqueInput | Prisma.UserFeedbackWhereUniqueInput[];
    update?: Prisma.UserFeedbackUpdateWithWhereUniqueWithoutProfileInput | Prisma.UserFeedbackUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.UserFeedbackUpdateManyWithWhereWithoutProfileInput | Prisma.UserFeedbackUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.UserFeedbackScalarWhereInput | Prisma.UserFeedbackScalarWhereInput[];
};
export type EnumFeedbackTypeFieldUpdateOperationsInput = {
    set?: $Enums.FeedbackType;
};
export type UserFeedbackCreateWithoutProfileInput = {
    id?: string;
    feedbackType: $Enums.FeedbackType;
    message: string;
    createdAt?: Date | string;
};
export type UserFeedbackUncheckedCreateWithoutProfileInput = {
    id?: string;
    feedbackType: $Enums.FeedbackType;
    message: string;
    createdAt?: Date | string;
};
export type UserFeedbackCreateOrConnectWithoutProfileInput = {
    where: Prisma.UserFeedbackWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserFeedbackCreateWithoutProfileInput, Prisma.UserFeedbackUncheckedCreateWithoutProfileInput>;
};
export type UserFeedbackCreateManyProfileInputEnvelope = {
    data: Prisma.UserFeedbackCreateManyProfileInput | Prisma.UserFeedbackCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type UserFeedbackUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.UserFeedbackWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserFeedbackUpdateWithoutProfileInput, Prisma.UserFeedbackUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.UserFeedbackCreateWithoutProfileInput, Prisma.UserFeedbackUncheckedCreateWithoutProfileInput>;
};
export type UserFeedbackUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.UserFeedbackWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserFeedbackUpdateWithoutProfileInput, Prisma.UserFeedbackUncheckedUpdateWithoutProfileInput>;
};
export type UserFeedbackUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.UserFeedbackScalarWhereInput;
    data: Prisma.XOR<Prisma.UserFeedbackUpdateManyMutationInput, Prisma.UserFeedbackUncheckedUpdateManyWithoutProfileInput>;
};
export type UserFeedbackScalarWhereInput = {
    AND?: Prisma.UserFeedbackScalarWhereInput | Prisma.UserFeedbackScalarWhereInput[];
    OR?: Prisma.UserFeedbackScalarWhereInput[];
    NOT?: Prisma.UserFeedbackScalarWhereInput | Prisma.UserFeedbackScalarWhereInput[];
    id?: Prisma.UuidFilter<"UserFeedback"> | string;
    userId?: Prisma.UuidNullableFilter<"UserFeedback"> | string | null;
    feedbackType?: Prisma.EnumFeedbackTypeFilter<"UserFeedback"> | $Enums.FeedbackType;
    message?: Prisma.StringFilter<"UserFeedback"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserFeedback"> | Date | string;
};
export type UserFeedbackCreateManyProfileInput = {
    id?: string;
    feedbackType: $Enums.FeedbackType;
    message: string;
    createdAt?: Date | string;
};
export type UserFeedbackUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    feedbackType?: Prisma.EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserFeedbackUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    feedbackType?: Prisma.EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserFeedbackUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    feedbackType?: Prisma.EnumFeedbackTypeFieldUpdateOperationsInput | $Enums.FeedbackType;
    message?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserFeedbackSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    feedbackType?: boolean;
    message?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.UserFeedback$profileArgs<ExtArgs>;
}, ExtArgs["result"]["userFeedback"]>;
export type UserFeedbackSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    feedbackType?: boolean;
    message?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.UserFeedback$profileArgs<ExtArgs>;
}, ExtArgs["result"]["userFeedback"]>;
export type UserFeedbackSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    feedbackType?: boolean;
    message?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.UserFeedback$profileArgs<ExtArgs>;
}, ExtArgs["result"]["userFeedback"]>;
export type UserFeedbackSelectScalar = {
    id?: boolean;
    userId?: boolean;
    feedbackType?: boolean;
    message?: boolean;
    createdAt?: boolean;
};
export type UserFeedbackOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "feedbackType" | "message" | "createdAt", ExtArgs["result"]["userFeedback"]>;
export type UserFeedbackInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.UserFeedback$profileArgs<ExtArgs>;
};
export type UserFeedbackIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.UserFeedback$profileArgs<ExtArgs>;
};
export type UserFeedbackIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.UserFeedback$profileArgs<ExtArgs>;
};
export type $UserFeedbackPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserFeedback";
    objects: {
        profile: Prisma.$ProfilePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string | null;
        feedbackType: $Enums.FeedbackType;
        message: string;
        createdAt: Date;
    }, ExtArgs["result"]["userFeedback"]>;
    composites: {};
};
export type UserFeedbackGetPayload<S extends boolean | null | undefined | UserFeedbackDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload, S>;
export type UserFeedbackCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserFeedbackCountAggregateInputType | true;
};
export interface UserFeedbackDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserFeedback'];
        meta: {
            name: 'UserFeedback';
        };
    };
    findUnique<T extends UserFeedbackFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFeedbackFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserFeedbackClient<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFeedbackFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserFeedbackClient<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFeedbackFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFeedbackFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserFeedbackClient<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFeedbackFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserFeedbackClient<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFeedbackFindManyArgs>(args?: Prisma.SelectSubset<T, UserFeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserFeedbackCreateArgs>(args: Prisma.SelectSubset<T, UserFeedbackCreateArgs<ExtArgs>>): Prisma.Prisma__UserFeedbackClient<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserFeedbackCreateManyArgs>(args?: Prisma.SelectSubset<T, UserFeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserFeedbackCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserFeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserFeedbackDeleteArgs>(args: Prisma.SelectSubset<T, UserFeedbackDeleteArgs<ExtArgs>>): Prisma.Prisma__UserFeedbackClient<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserFeedbackUpdateArgs>(args: Prisma.SelectSubset<T, UserFeedbackUpdateArgs<ExtArgs>>): Prisma.Prisma__UserFeedbackClient<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserFeedbackDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserFeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserFeedbackUpdateManyArgs>(args: Prisma.SelectSubset<T, UserFeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserFeedbackUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserFeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserFeedbackUpsertArgs>(args: Prisma.SelectSubset<T, UserFeedbackUpsertArgs<ExtArgs>>): Prisma.Prisma__UserFeedbackClient<runtime.Types.Result.GetResult<Prisma.$UserFeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserFeedbackCountArgs>(args?: Prisma.Subset<T, UserFeedbackCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserFeedbackCountAggregateOutputType> : number>;
    aggregate<T extends UserFeedbackAggregateArgs>(args: Prisma.Subset<T, UserFeedbackAggregateArgs>): Prisma.PrismaPromise<GetUserFeedbackAggregateType<T>>;
    groupBy<T extends UserFeedbackGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserFeedbackGroupByArgs['orderBy'];
    } : {
        orderBy?: UserFeedbackGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserFeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFeedbackFieldRefs;
}
export interface Prisma__UserFeedbackClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    profile<T extends Prisma.UserFeedback$profileArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserFeedback$profileArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFeedbackFieldRefs {
    readonly id: Prisma.FieldRef<"UserFeedback", 'String'>;
    readonly userId: Prisma.FieldRef<"UserFeedback", 'String'>;
    readonly feedbackType: Prisma.FieldRef<"UserFeedback", 'FeedbackType'>;
    readonly message: Prisma.FieldRef<"UserFeedback", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserFeedback", 'DateTime'>;
}
export type UserFeedbackFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    include?: Prisma.UserFeedbackInclude<ExtArgs> | null;
    where: Prisma.UserFeedbackWhereUniqueInput;
};
export type UserFeedbackFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    include?: Prisma.UserFeedbackInclude<ExtArgs> | null;
    where: Prisma.UserFeedbackWhereUniqueInput;
};
export type UserFeedbackFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserFeedbackFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserFeedbackFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserFeedbackCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    include?: Prisma.UserFeedbackInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserFeedbackCreateInput, Prisma.UserFeedbackUncheckedCreateInput>;
};
export type UserFeedbackCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserFeedbackCreateManyInput | Prisma.UserFeedbackCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserFeedbackCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    data: Prisma.UserFeedbackCreateManyInput | Prisma.UserFeedbackCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserFeedbackIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserFeedbackUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    include?: Prisma.UserFeedbackInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserFeedbackUpdateInput, Prisma.UserFeedbackUncheckedUpdateInput>;
    where: Prisma.UserFeedbackWhereUniqueInput;
};
export type UserFeedbackUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserFeedbackUpdateManyMutationInput, Prisma.UserFeedbackUncheckedUpdateManyInput>;
    where?: Prisma.UserFeedbackWhereInput;
    limit?: number;
};
export type UserFeedbackUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserFeedbackUpdateManyMutationInput, Prisma.UserFeedbackUncheckedUpdateManyInput>;
    where?: Prisma.UserFeedbackWhereInput;
    limit?: number;
    include?: Prisma.UserFeedbackIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserFeedbackUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    include?: Prisma.UserFeedbackInclude<ExtArgs> | null;
    where: Prisma.UserFeedbackWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserFeedbackCreateInput, Prisma.UserFeedbackUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserFeedbackUpdateInput, Prisma.UserFeedbackUncheckedUpdateInput>;
};
export type UserFeedbackDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    include?: Prisma.UserFeedbackInclude<ExtArgs> | null;
    where: Prisma.UserFeedbackWhereUniqueInput;
};
export type UserFeedbackDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserFeedbackWhereInput;
    limit?: number;
};
export type UserFeedback$profileArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
};
export type UserFeedbackDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserFeedbackSelect<ExtArgs> | null;
    omit?: Prisma.UserFeedbackOmit<ExtArgs> | null;
    include?: Prisma.UserFeedbackInclude<ExtArgs> | null;
};
