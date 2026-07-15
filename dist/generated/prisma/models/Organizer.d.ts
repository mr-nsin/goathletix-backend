import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type OrganizerModel = runtime.Types.Result.DefaultSelection<Prisma.$OrganizerPayload>;
export type AggregateOrganizer = {
    _count: OrganizerCountAggregateOutputType | null;
    _min: OrganizerMinAggregateOutputType | null;
    _max: OrganizerMaxAggregateOutputType | null;
};
export type OrganizerMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    isVerified: boolean | null;
    createdAt: Date | null;
};
export type OrganizerMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    isVerified: boolean | null;
    createdAt: Date | null;
};
export type OrganizerCountAggregateOutputType = {
    id: number;
    name: number;
    websiteUrl: number;
    logoUrl: number;
    isVerified: number;
    createdAt: number;
    _all: number;
};
export type OrganizerMinAggregateInputType = {
    id?: true;
    name?: true;
    websiteUrl?: true;
    logoUrl?: true;
    isVerified?: true;
    createdAt?: true;
};
export type OrganizerMaxAggregateInputType = {
    id?: true;
    name?: true;
    websiteUrl?: true;
    logoUrl?: true;
    isVerified?: true;
    createdAt?: true;
};
export type OrganizerCountAggregateInputType = {
    id?: true;
    name?: true;
    websiteUrl?: true;
    logoUrl?: true;
    isVerified?: true;
    createdAt?: true;
    _all?: true;
};
export type OrganizerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizerWhereInput;
    orderBy?: Prisma.OrganizerOrderByWithRelationInput | Prisma.OrganizerOrderByWithRelationInput[];
    cursor?: Prisma.OrganizerWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrganizerCountAggregateInputType;
    _min?: OrganizerMinAggregateInputType;
    _max?: OrganizerMaxAggregateInputType;
};
export type GetOrganizerAggregateType<T extends OrganizerAggregateArgs> = {
    [P in keyof T & keyof AggregateOrganizer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrganizer[P]> : Prisma.GetScalarType<T[P], AggregateOrganizer[P]>;
};
export type OrganizerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizerWhereInput;
    orderBy?: Prisma.OrganizerOrderByWithAggregationInput | Prisma.OrganizerOrderByWithAggregationInput[];
    by: Prisma.OrganizerScalarFieldEnum[] | Prisma.OrganizerScalarFieldEnum;
    having?: Prisma.OrganizerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrganizerCountAggregateInputType | true;
    _min?: OrganizerMinAggregateInputType;
    _max?: OrganizerMaxAggregateInputType;
};
export type OrganizerGroupByOutputType = {
    id: string;
    name: string;
    websiteUrl: string | null;
    logoUrl: string | null;
    isVerified: boolean;
    createdAt: Date;
    _count: OrganizerCountAggregateOutputType | null;
    _min: OrganizerMinAggregateOutputType | null;
    _max: OrganizerMaxAggregateOutputType | null;
};
export type GetOrganizerGroupByPayload<T extends OrganizerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrganizerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrganizerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrganizerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrganizerGroupByOutputType[P]>;
}>>;
export type OrganizerWhereInput = {
    AND?: Prisma.OrganizerWhereInput | Prisma.OrganizerWhereInput[];
    OR?: Prisma.OrganizerWhereInput[];
    NOT?: Prisma.OrganizerWhereInput | Prisma.OrganizerWhereInput[];
    id?: Prisma.UuidFilter<"Organizer"> | string;
    name?: Prisma.StringFilter<"Organizer"> | string;
    websiteUrl?: Prisma.StringNullableFilter<"Organizer"> | string | null;
    logoUrl?: Prisma.StringNullableFilter<"Organizer"> | string | null;
    isVerified?: Prisma.BoolFilter<"Organizer"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Organizer"> | Date | string;
    events?: Prisma.EventListRelationFilter;
    follows?: Prisma.FollowListRelationFilter;
};
export type OrganizerOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    websiteUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    events?: Prisma.EventOrderByRelationAggregateInput;
    follows?: Prisma.FollowOrderByRelationAggregateInput;
};
export type OrganizerWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name?: string;
    AND?: Prisma.OrganizerWhereInput | Prisma.OrganizerWhereInput[];
    OR?: Prisma.OrganizerWhereInput[];
    NOT?: Prisma.OrganizerWhereInput | Prisma.OrganizerWhereInput[];
    websiteUrl?: Prisma.StringNullableFilter<"Organizer"> | string | null;
    logoUrl?: Prisma.StringNullableFilter<"Organizer"> | string | null;
    isVerified?: Prisma.BoolFilter<"Organizer"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Organizer"> | Date | string;
    events?: Prisma.EventListRelationFilter;
    follows?: Prisma.FollowListRelationFilter;
}, "id" | "name">;
export type OrganizerOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    websiteUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.OrganizerCountOrderByAggregateInput;
    _max?: Prisma.OrganizerMaxOrderByAggregateInput;
    _min?: Prisma.OrganizerMinOrderByAggregateInput;
};
export type OrganizerScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrganizerScalarWhereWithAggregatesInput | Prisma.OrganizerScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrganizerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrganizerScalarWhereWithAggregatesInput | Prisma.OrganizerScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Organizer"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Organizer"> | string;
    websiteUrl?: Prisma.StringNullableWithAggregatesFilter<"Organizer"> | string | null;
    logoUrl?: Prisma.StringNullableWithAggregatesFilter<"Organizer"> | string | null;
    isVerified?: Prisma.BoolWithAggregatesFilter<"Organizer"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Organizer"> | Date | string;
};
export type OrganizerCreateInput = {
    id?: string;
    name: string;
    websiteUrl?: string | null;
    logoUrl?: string | null;
    isVerified?: boolean;
    createdAt?: Date | string;
    events?: Prisma.EventCreateNestedManyWithoutOrganizerInput;
    follows?: Prisma.FollowCreateNestedManyWithoutOrganizerInput;
};
export type OrganizerUncheckedCreateInput = {
    id?: string;
    name: string;
    websiteUrl?: string | null;
    logoUrl?: string | null;
    isVerified?: boolean;
    createdAt?: Date | string;
    events?: Prisma.EventUncheckedCreateNestedManyWithoutOrganizerInput;
    follows?: Prisma.FollowUncheckedCreateNestedManyWithoutOrganizerInput;
};
export type OrganizerUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    websiteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    events?: Prisma.EventUpdateManyWithoutOrganizerNestedInput;
    follows?: Prisma.FollowUpdateManyWithoutOrganizerNestedInput;
};
export type OrganizerUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    websiteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    events?: Prisma.EventUncheckedUpdateManyWithoutOrganizerNestedInput;
    follows?: Prisma.FollowUncheckedUpdateManyWithoutOrganizerNestedInput;
};
export type OrganizerCreateManyInput = {
    id?: string;
    name: string;
    websiteUrl?: string | null;
    logoUrl?: string | null;
    isVerified?: boolean;
    createdAt?: Date | string;
};
export type OrganizerUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    websiteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizerUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    websiteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizerCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    websiteUrl?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OrganizerMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    websiteUrl?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OrganizerMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    websiteUrl?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OrganizerNullableScalarRelationFilter = {
    is?: Prisma.OrganizerWhereInput | null;
    isNot?: Prisma.OrganizerWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type OrganizerCreateNestedOneWithoutEventsInput = {
    create?: Prisma.XOR<Prisma.OrganizerCreateWithoutEventsInput, Prisma.OrganizerUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.OrganizerCreateOrConnectWithoutEventsInput;
    connect?: Prisma.OrganizerWhereUniqueInput;
};
export type OrganizerUpdateOneWithoutEventsNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizerCreateWithoutEventsInput, Prisma.OrganizerUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.OrganizerCreateOrConnectWithoutEventsInput;
    upsert?: Prisma.OrganizerUpsertWithoutEventsInput;
    disconnect?: Prisma.OrganizerWhereInput | boolean;
    delete?: Prisma.OrganizerWhereInput | boolean;
    connect?: Prisma.OrganizerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizerUpdateToOneWithWhereWithoutEventsInput, Prisma.OrganizerUpdateWithoutEventsInput>, Prisma.OrganizerUncheckedUpdateWithoutEventsInput>;
};
export type OrganizerCreateNestedOneWithoutFollowsInput = {
    create?: Prisma.XOR<Prisma.OrganizerCreateWithoutFollowsInput, Prisma.OrganizerUncheckedCreateWithoutFollowsInput>;
    connectOrCreate?: Prisma.OrganizerCreateOrConnectWithoutFollowsInput;
    connect?: Prisma.OrganizerWhereUniqueInput;
};
export type OrganizerUpdateOneWithoutFollowsNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizerCreateWithoutFollowsInput, Prisma.OrganizerUncheckedCreateWithoutFollowsInput>;
    connectOrCreate?: Prisma.OrganizerCreateOrConnectWithoutFollowsInput;
    upsert?: Prisma.OrganizerUpsertWithoutFollowsInput;
    disconnect?: Prisma.OrganizerWhereInput | boolean;
    delete?: Prisma.OrganizerWhereInput | boolean;
    connect?: Prisma.OrganizerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizerUpdateToOneWithWhereWithoutFollowsInput, Prisma.OrganizerUpdateWithoutFollowsInput>, Prisma.OrganizerUncheckedUpdateWithoutFollowsInput>;
};
export type OrganizerCreateWithoutEventsInput = {
    id?: string;
    name: string;
    websiteUrl?: string | null;
    logoUrl?: string | null;
    isVerified?: boolean;
    createdAt?: Date | string;
    follows?: Prisma.FollowCreateNestedManyWithoutOrganizerInput;
};
export type OrganizerUncheckedCreateWithoutEventsInput = {
    id?: string;
    name: string;
    websiteUrl?: string | null;
    logoUrl?: string | null;
    isVerified?: boolean;
    createdAt?: Date | string;
    follows?: Prisma.FollowUncheckedCreateNestedManyWithoutOrganizerInput;
};
export type OrganizerCreateOrConnectWithoutEventsInput = {
    where: Prisma.OrganizerWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizerCreateWithoutEventsInput, Prisma.OrganizerUncheckedCreateWithoutEventsInput>;
};
export type OrganizerUpsertWithoutEventsInput = {
    update: Prisma.XOR<Prisma.OrganizerUpdateWithoutEventsInput, Prisma.OrganizerUncheckedUpdateWithoutEventsInput>;
    create: Prisma.XOR<Prisma.OrganizerCreateWithoutEventsInput, Prisma.OrganizerUncheckedCreateWithoutEventsInput>;
    where?: Prisma.OrganizerWhereInput;
};
export type OrganizerUpdateToOneWithWhereWithoutEventsInput = {
    where?: Prisma.OrganizerWhereInput;
    data: Prisma.XOR<Prisma.OrganizerUpdateWithoutEventsInput, Prisma.OrganizerUncheckedUpdateWithoutEventsInput>;
};
export type OrganizerUpdateWithoutEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    websiteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUpdateManyWithoutOrganizerNestedInput;
};
export type OrganizerUncheckedUpdateWithoutEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    websiteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    follows?: Prisma.FollowUncheckedUpdateManyWithoutOrganizerNestedInput;
};
export type OrganizerCreateWithoutFollowsInput = {
    id?: string;
    name: string;
    websiteUrl?: string | null;
    logoUrl?: string | null;
    isVerified?: boolean;
    createdAt?: Date | string;
    events?: Prisma.EventCreateNestedManyWithoutOrganizerInput;
};
export type OrganizerUncheckedCreateWithoutFollowsInput = {
    id?: string;
    name: string;
    websiteUrl?: string | null;
    logoUrl?: string | null;
    isVerified?: boolean;
    createdAt?: Date | string;
    events?: Prisma.EventUncheckedCreateNestedManyWithoutOrganizerInput;
};
export type OrganizerCreateOrConnectWithoutFollowsInput = {
    where: Prisma.OrganizerWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizerCreateWithoutFollowsInput, Prisma.OrganizerUncheckedCreateWithoutFollowsInput>;
};
export type OrganizerUpsertWithoutFollowsInput = {
    update: Prisma.XOR<Prisma.OrganizerUpdateWithoutFollowsInput, Prisma.OrganizerUncheckedUpdateWithoutFollowsInput>;
    create: Prisma.XOR<Prisma.OrganizerCreateWithoutFollowsInput, Prisma.OrganizerUncheckedCreateWithoutFollowsInput>;
    where?: Prisma.OrganizerWhereInput;
};
export type OrganizerUpdateToOneWithWhereWithoutFollowsInput = {
    where?: Prisma.OrganizerWhereInput;
    data: Prisma.XOR<Prisma.OrganizerUpdateWithoutFollowsInput, Prisma.OrganizerUncheckedUpdateWithoutFollowsInput>;
};
export type OrganizerUpdateWithoutFollowsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    websiteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    events?: Prisma.EventUpdateManyWithoutOrganizerNestedInput;
};
export type OrganizerUncheckedUpdateWithoutFollowsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    websiteUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    events?: Prisma.EventUncheckedUpdateManyWithoutOrganizerNestedInput;
};
export type OrganizerCountOutputType = {
    events: number;
    follows: number;
};
export type OrganizerCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    events?: boolean | OrganizerCountOutputTypeCountEventsArgs;
    follows?: boolean | OrganizerCountOutputTypeCountFollowsArgs;
};
export type OrganizerCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerCountOutputTypeSelect<ExtArgs> | null;
};
export type OrganizerCountOutputTypeCountEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
};
export type OrganizerCountOutputTypeCountFollowsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FollowWhereInput;
};
export type OrganizerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    websiteUrl?: boolean;
    logoUrl?: boolean;
    isVerified?: boolean;
    createdAt?: boolean;
    events?: boolean | Prisma.Organizer$eventsArgs<ExtArgs>;
    follows?: boolean | Prisma.Organizer$followsArgs<ExtArgs>;
    _count?: boolean | Prisma.OrganizerCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["organizer"]>;
export type OrganizerSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    websiteUrl?: boolean;
    logoUrl?: boolean;
    isVerified?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["organizer"]>;
export type OrganizerSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    websiteUrl?: boolean;
    logoUrl?: boolean;
    isVerified?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["organizer"]>;
export type OrganizerSelectScalar = {
    id?: boolean;
    name?: boolean;
    websiteUrl?: boolean;
    logoUrl?: boolean;
    isVerified?: boolean;
    createdAt?: boolean;
};
export type OrganizerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "websiteUrl" | "logoUrl" | "isVerified" | "createdAt", ExtArgs["result"]["organizer"]>;
export type OrganizerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    events?: boolean | Prisma.Organizer$eventsArgs<ExtArgs>;
    follows?: boolean | Prisma.Organizer$followsArgs<ExtArgs>;
    _count?: boolean | Prisma.OrganizerCountOutputTypeDefaultArgs<ExtArgs>;
};
export type OrganizerIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type OrganizerIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $OrganizerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Organizer";
    objects: {
        events: Prisma.$EventPayload<ExtArgs>[];
        follows: Prisma.$FollowPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        websiteUrl: string | null;
        logoUrl: string | null;
        isVerified: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["organizer"]>;
    composites: {};
};
export type OrganizerGetPayload<S extends boolean | null | undefined | OrganizerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrganizerPayload, S>;
export type OrganizerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrganizerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrganizerCountAggregateInputType | true;
};
export interface OrganizerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Organizer'];
        meta: {
            name: 'Organizer';
        };
    };
    findUnique<T extends OrganizerFindUniqueArgs>(args: Prisma.SelectSubset<T, OrganizerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrganizerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrganizerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrganizerFindFirstArgs>(args?: Prisma.SelectSubset<T, OrganizerFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrganizerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrganizerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrganizerFindManyArgs>(args?: Prisma.SelectSubset<T, OrganizerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrganizerCreateArgs>(args: Prisma.SelectSubset<T, OrganizerCreateArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrganizerCreateManyArgs>(args?: Prisma.SelectSubset<T, OrganizerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrganizerCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrganizerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrganizerDeleteArgs>(args: Prisma.SelectSubset<T, OrganizerDeleteArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrganizerUpdateArgs>(args: Prisma.SelectSubset<T, OrganizerUpdateArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrganizerDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrganizerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrganizerUpdateManyArgs>(args: Prisma.SelectSubset<T, OrganizerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrganizerUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrganizerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrganizerUpsertArgs>(args: Prisma.SelectSubset<T, OrganizerUpsertArgs<ExtArgs>>): Prisma.Prisma__OrganizerClient<runtime.Types.Result.GetResult<Prisma.$OrganizerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrganizerCountArgs>(args?: Prisma.Subset<T, OrganizerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrganizerCountAggregateOutputType> : number>;
    aggregate<T extends OrganizerAggregateArgs>(args: Prisma.Subset<T, OrganizerAggregateArgs>): Prisma.PrismaPromise<GetOrganizerAggregateType<T>>;
    groupBy<T extends OrganizerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrganizerGroupByArgs['orderBy'];
    } : {
        orderBy?: OrganizerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrganizerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrganizerFieldRefs;
}
export interface Prisma__OrganizerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    events<T extends Prisma.Organizer$eventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organizer$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    follows<T extends Prisma.Organizer$followsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organizer$followsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FollowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrganizerFieldRefs {
    readonly id: Prisma.FieldRef<"Organizer", 'String'>;
    readonly name: Prisma.FieldRef<"Organizer", 'String'>;
    readonly websiteUrl: Prisma.FieldRef<"Organizer", 'String'>;
    readonly logoUrl: Prisma.FieldRef<"Organizer", 'String'>;
    readonly isVerified: Prisma.FieldRef<"Organizer", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Organizer", 'DateTime'>;
}
export type OrganizerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    where: Prisma.OrganizerWhereUniqueInput;
};
export type OrganizerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    where: Prisma.OrganizerWhereUniqueInput;
};
export type OrganizerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    where?: Prisma.OrganizerWhereInput;
    orderBy?: Prisma.OrganizerOrderByWithRelationInput | Prisma.OrganizerOrderByWithRelationInput[];
    cursor?: Prisma.OrganizerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizerScalarFieldEnum | Prisma.OrganizerScalarFieldEnum[];
};
export type OrganizerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    where?: Prisma.OrganizerWhereInput;
    orderBy?: Prisma.OrganizerOrderByWithRelationInput | Prisma.OrganizerOrderByWithRelationInput[];
    cursor?: Prisma.OrganizerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizerScalarFieldEnum | Prisma.OrganizerScalarFieldEnum[];
};
export type OrganizerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    where?: Prisma.OrganizerWhereInput;
    orderBy?: Prisma.OrganizerOrderByWithRelationInput | Prisma.OrganizerOrderByWithRelationInput[];
    cursor?: Prisma.OrganizerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizerScalarFieldEnum | Prisma.OrganizerScalarFieldEnum[];
};
export type OrganizerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizerCreateInput, Prisma.OrganizerUncheckedCreateInput>;
};
export type OrganizerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrganizerCreateManyInput | Prisma.OrganizerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrganizerCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    data: Prisma.OrganizerCreateManyInput | Prisma.OrganizerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrganizerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizerUpdateInput, Prisma.OrganizerUncheckedUpdateInput>;
    where: Prisma.OrganizerWhereUniqueInput;
};
export type OrganizerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrganizerUpdateManyMutationInput, Prisma.OrganizerUncheckedUpdateManyInput>;
    where?: Prisma.OrganizerWhereInput;
    limit?: number;
};
export type OrganizerUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizerUpdateManyMutationInput, Prisma.OrganizerUncheckedUpdateManyInput>;
    where?: Prisma.OrganizerWhereInput;
    limit?: number;
};
export type OrganizerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    where: Prisma.OrganizerWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizerCreateInput, Prisma.OrganizerUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrganizerUpdateInput, Prisma.OrganizerUncheckedUpdateInput>;
};
export type OrganizerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
    where: Prisma.OrganizerWhereUniqueInput;
};
export type OrganizerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizerWhereInput;
    limit?: number;
};
export type Organizer$eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type Organizer$followsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrganizerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizerSelect<ExtArgs> | null;
    omit?: Prisma.OrganizerOmit<ExtArgs> | null;
    include?: Prisma.OrganizerInclude<ExtArgs> | null;
};
