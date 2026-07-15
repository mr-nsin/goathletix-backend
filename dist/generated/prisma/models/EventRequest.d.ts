import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EventRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$EventRequestPayload>;
export type AggregateEventRequest = {
    _count: EventRequestCountAggregateOutputType | null;
    _min: EventRequestMinAggregateOutputType | null;
    _max: EventRequestMaxAggregateOutputType | null;
};
export type EventRequestMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventName: string | null;
    sportType: $Enums.SportCategory | null;
    eventDate: Date | null;
    city: string | null;
    state: string | null;
    venue: string | null;
    registrationUrl: string | null;
    description: string | null;
    organizerName: string | null;
    status: $Enums.RequestStatus | null;
    createdAt: Date | null;
};
export type EventRequestMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    eventName: string | null;
    sportType: $Enums.SportCategory | null;
    eventDate: Date | null;
    city: string | null;
    state: string | null;
    venue: string | null;
    registrationUrl: string | null;
    description: string | null;
    organizerName: string | null;
    status: $Enums.RequestStatus | null;
    createdAt: Date | null;
};
export type EventRequestCountAggregateOutputType = {
    id: number;
    userId: number;
    eventName: number;
    sportType: number;
    eventDate: number;
    city: number;
    state: number;
    venue: number;
    registrationUrl: number;
    description: number;
    organizerName: number;
    status: number;
    createdAt: number;
    _all: number;
};
export type EventRequestMinAggregateInputType = {
    id?: true;
    userId?: true;
    eventName?: true;
    sportType?: true;
    eventDate?: true;
    city?: true;
    state?: true;
    venue?: true;
    registrationUrl?: true;
    description?: true;
    organizerName?: true;
    status?: true;
    createdAt?: true;
};
export type EventRequestMaxAggregateInputType = {
    id?: true;
    userId?: true;
    eventName?: true;
    sportType?: true;
    eventDate?: true;
    city?: true;
    state?: true;
    venue?: true;
    registrationUrl?: true;
    description?: true;
    organizerName?: true;
    status?: true;
    createdAt?: true;
};
export type EventRequestCountAggregateInputType = {
    id?: true;
    userId?: true;
    eventName?: true;
    sportType?: true;
    eventDate?: true;
    city?: true;
    state?: true;
    venue?: true;
    registrationUrl?: true;
    description?: true;
    organizerName?: true;
    status?: true;
    createdAt?: true;
    _all?: true;
};
export type EventRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventRequestWhereInput;
    orderBy?: Prisma.EventRequestOrderByWithRelationInput | Prisma.EventRequestOrderByWithRelationInput[];
    cursor?: Prisma.EventRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EventRequestCountAggregateInputType;
    _min?: EventRequestMinAggregateInputType;
    _max?: EventRequestMaxAggregateInputType;
};
export type GetEventRequestAggregateType<T extends EventRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateEventRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEventRequest[P]> : Prisma.GetScalarType<T[P], AggregateEventRequest[P]>;
};
export type EventRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventRequestWhereInput;
    orderBy?: Prisma.EventRequestOrderByWithAggregationInput | Prisma.EventRequestOrderByWithAggregationInput[];
    by: Prisma.EventRequestScalarFieldEnum[] | Prisma.EventRequestScalarFieldEnum;
    having?: Prisma.EventRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventRequestCountAggregateInputType | true;
    _min?: EventRequestMinAggregateInputType;
    _max?: EventRequestMaxAggregateInputType;
};
export type EventRequestGroupByOutputType = {
    id: string;
    userId: string | null;
    eventName: string;
    sportType: $Enums.SportCategory;
    eventDate: Date;
    city: string;
    state: string;
    venue: string;
    registrationUrl: string;
    description: string | null;
    organizerName: string;
    status: $Enums.RequestStatus;
    createdAt: Date;
    _count: EventRequestCountAggregateOutputType | null;
    _min: EventRequestMinAggregateOutputType | null;
    _max: EventRequestMaxAggregateOutputType | null;
};
export type GetEventRequestGroupByPayload<T extends EventRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EventRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EventRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EventRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EventRequestGroupByOutputType[P]>;
}>>;
export type EventRequestWhereInput = {
    AND?: Prisma.EventRequestWhereInput | Prisma.EventRequestWhereInput[];
    OR?: Prisma.EventRequestWhereInput[];
    NOT?: Prisma.EventRequestWhereInput | Prisma.EventRequestWhereInput[];
    id?: Prisma.UuidFilter<"EventRequest"> | string;
    userId?: Prisma.UuidNullableFilter<"EventRequest"> | string | null;
    eventName?: Prisma.StringFilter<"EventRequest"> | string;
    sportType?: Prisma.EnumSportCategoryFilter<"EventRequest"> | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFilter<"EventRequest"> | Date | string;
    city?: Prisma.StringFilter<"EventRequest"> | string;
    state?: Prisma.StringFilter<"EventRequest"> | string;
    venue?: Prisma.StringFilter<"EventRequest"> | string;
    registrationUrl?: Prisma.StringFilter<"EventRequest"> | string;
    description?: Prisma.StringNullableFilter<"EventRequest"> | string | null;
    organizerName?: Prisma.StringFilter<"EventRequest"> | string;
    status?: Prisma.EnumRequestStatusFilter<"EventRequest"> | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFilter<"EventRequest"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileNullableScalarRelationFilter, Prisma.ProfileWhereInput> | null;
};
export type EventRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    eventName?: Prisma.SortOrder;
    sportType?: Prisma.SortOrder;
    eventDate?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    state?: Prisma.SortOrder;
    venue?: Prisma.SortOrder;
    registrationUrl?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    organizerName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    profile?: Prisma.ProfileOrderByWithRelationInput;
};
export type EventRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EventRequestWhereInput | Prisma.EventRequestWhereInput[];
    OR?: Prisma.EventRequestWhereInput[];
    NOT?: Prisma.EventRequestWhereInput | Prisma.EventRequestWhereInput[];
    userId?: Prisma.UuidNullableFilter<"EventRequest"> | string | null;
    eventName?: Prisma.StringFilter<"EventRequest"> | string;
    sportType?: Prisma.EnumSportCategoryFilter<"EventRequest"> | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFilter<"EventRequest"> | Date | string;
    city?: Prisma.StringFilter<"EventRequest"> | string;
    state?: Prisma.StringFilter<"EventRequest"> | string;
    venue?: Prisma.StringFilter<"EventRequest"> | string;
    registrationUrl?: Prisma.StringFilter<"EventRequest"> | string;
    description?: Prisma.StringNullableFilter<"EventRequest"> | string | null;
    organizerName?: Prisma.StringFilter<"EventRequest"> | string;
    status?: Prisma.EnumRequestStatusFilter<"EventRequest"> | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFilter<"EventRequest"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileNullableScalarRelationFilter, Prisma.ProfileWhereInput> | null;
}, "id">;
export type EventRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    eventName?: Prisma.SortOrder;
    sportType?: Prisma.SortOrder;
    eventDate?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    state?: Prisma.SortOrder;
    venue?: Prisma.SortOrder;
    registrationUrl?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    organizerName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.EventRequestCountOrderByAggregateInput;
    _max?: Prisma.EventRequestMaxOrderByAggregateInput;
    _min?: Prisma.EventRequestMinOrderByAggregateInput;
};
export type EventRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.EventRequestScalarWhereWithAggregatesInput | Prisma.EventRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.EventRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EventRequestScalarWhereWithAggregatesInput | Prisma.EventRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"EventRequest"> | string;
    userId?: Prisma.UuidNullableWithAggregatesFilter<"EventRequest"> | string | null;
    eventName?: Prisma.StringWithAggregatesFilter<"EventRequest"> | string;
    sportType?: Prisma.EnumSportCategoryWithAggregatesFilter<"EventRequest"> | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeWithAggregatesFilter<"EventRequest"> | Date | string;
    city?: Prisma.StringWithAggregatesFilter<"EventRequest"> | string;
    state?: Prisma.StringWithAggregatesFilter<"EventRequest"> | string;
    venue?: Prisma.StringWithAggregatesFilter<"EventRequest"> | string;
    registrationUrl?: Prisma.StringWithAggregatesFilter<"EventRequest"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"EventRequest"> | string | null;
    organizerName?: Prisma.StringWithAggregatesFilter<"EventRequest"> | string;
    status?: Prisma.EnumRequestStatusWithAggregatesFilter<"EventRequest"> | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"EventRequest"> | Date | string;
};
export type EventRequestCreateInput = {
    id?: string;
    eventName: string;
    sportType: $Enums.SportCategory;
    eventDate: Date | string;
    city: string;
    state: string;
    venue: string;
    registrationUrl: string;
    description?: string | null;
    organizerName: string;
    status?: $Enums.RequestStatus;
    createdAt?: Date | string;
    profile?: Prisma.ProfileCreateNestedOneWithoutEventRequestsInput;
};
export type EventRequestUncheckedCreateInput = {
    id?: string;
    userId?: string | null;
    eventName: string;
    sportType: $Enums.SportCategory;
    eventDate: Date | string;
    city: string;
    state: string;
    venue: string;
    registrationUrl: string;
    description?: string | null;
    organizerName: string;
    status?: $Enums.RequestStatus;
    createdAt?: Date | string;
};
export type EventRequestUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventName?: Prisma.StringFieldUpdateOperationsInput | string;
    sportType?: Prisma.EnumSportCategoryFieldUpdateOperationsInput | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    state?: Prisma.StringFieldUpdateOperationsInput | string;
    venue?: Prisma.StringFieldUpdateOperationsInput | string;
    registrationUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    organizerName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneWithoutEventRequestsNestedInput;
};
export type EventRequestUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    eventName?: Prisma.StringFieldUpdateOperationsInput | string;
    sportType?: Prisma.EnumSportCategoryFieldUpdateOperationsInput | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    state?: Prisma.StringFieldUpdateOperationsInput | string;
    venue?: Prisma.StringFieldUpdateOperationsInput | string;
    registrationUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    organizerName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventRequestCreateManyInput = {
    id?: string;
    userId?: string | null;
    eventName: string;
    sportType: $Enums.SportCategory;
    eventDate: Date | string;
    city: string;
    state: string;
    venue: string;
    registrationUrl: string;
    description?: string | null;
    organizerName: string;
    status?: $Enums.RequestStatus;
    createdAt?: Date | string;
};
export type EventRequestUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventName?: Prisma.StringFieldUpdateOperationsInput | string;
    sportType?: Prisma.EnumSportCategoryFieldUpdateOperationsInput | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    state?: Prisma.StringFieldUpdateOperationsInput | string;
    venue?: Prisma.StringFieldUpdateOperationsInput | string;
    registrationUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    organizerName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventRequestUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    eventName?: Prisma.StringFieldUpdateOperationsInput | string;
    sportType?: Prisma.EnumSportCategoryFieldUpdateOperationsInput | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    state?: Prisma.StringFieldUpdateOperationsInput | string;
    venue?: Prisma.StringFieldUpdateOperationsInput | string;
    registrationUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    organizerName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventRequestListRelationFilter = {
    every?: Prisma.EventRequestWhereInput;
    some?: Prisma.EventRequestWhereInput;
    none?: Prisma.EventRequestWhereInput;
};
export type EventRequestOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EventRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventName?: Prisma.SortOrder;
    sportType?: Prisma.SortOrder;
    eventDate?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    state?: Prisma.SortOrder;
    venue?: Prisma.SortOrder;
    registrationUrl?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    organizerName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventName?: Prisma.SortOrder;
    sportType?: Prisma.SortOrder;
    eventDate?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    state?: Prisma.SortOrder;
    venue?: Prisma.SortOrder;
    registrationUrl?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    organizerName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    eventName?: Prisma.SortOrder;
    sportType?: Prisma.SortOrder;
    eventDate?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    state?: Prisma.SortOrder;
    venue?: Prisma.SortOrder;
    registrationUrl?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    organizerName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventRequestCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.EventRequestCreateWithoutProfileInput, Prisma.EventRequestUncheckedCreateWithoutProfileInput> | Prisma.EventRequestCreateWithoutProfileInput[] | Prisma.EventRequestUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.EventRequestCreateOrConnectWithoutProfileInput | Prisma.EventRequestCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.EventRequestCreateManyProfileInputEnvelope;
    connect?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
};
export type EventRequestUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.EventRequestCreateWithoutProfileInput, Prisma.EventRequestUncheckedCreateWithoutProfileInput> | Prisma.EventRequestCreateWithoutProfileInput[] | Prisma.EventRequestUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.EventRequestCreateOrConnectWithoutProfileInput | Prisma.EventRequestCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.EventRequestCreateManyProfileInputEnvelope;
    connect?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
};
export type EventRequestUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.EventRequestCreateWithoutProfileInput, Prisma.EventRequestUncheckedCreateWithoutProfileInput> | Prisma.EventRequestCreateWithoutProfileInput[] | Prisma.EventRequestUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.EventRequestCreateOrConnectWithoutProfileInput | Prisma.EventRequestCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.EventRequestUpsertWithWhereUniqueWithoutProfileInput | Prisma.EventRequestUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.EventRequestCreateManyProfileInputEnvelope;
    set?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
    disconnect?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
    delete?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
    connect?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
    update?: Prisma.EventRequestUpdateWithWhereUniqueWithoutProfileInput | Prisma.EventRequestUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.EventRequestUpdateManyWithWhereWithoutProfileInput | Prisma.EventRequestUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.EventRequestScalarWhereInput | Prisma.EventRequestScalarWhereInput[];
};
export type EventRequestUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.EventRequestCreateWithoutProfileInput, Prisma.EventRequestUncheckedCreateWithoutProfileInput> | Prisma.EventRequestCreateWithoutProfileInput[] | Prisma.EventRequestUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.EventRequestCreateOrConnectWithoutProfileInput | Prisma.EventRequestCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.EventRequestUpsertWithWhereUniqueWithoutProfileInput | Prisma.EventRequestUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.EventRequestCreateManyProfileInputEnvelope;
    set?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
    disconnect?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
    delete?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
    connect?: Prisma.EventRequestWhereUniqueInput | Prisma.EventRequestWhereUniqueInput[];
    update?: Prisma.EventRequestUpdateWithWhereUniqueWithoutProfileInput | Prisma.EventRequestUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.EventRequestUpdateManyWithWhereWithoutProfileInput | Prisma.EventRequestUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.EventRequestScalarWhereInput | Prisma.EventRequestScalarWhereInput[];
};
export type EnumRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.RequestStatus;
};
export type EventRequestCreateWithoutProfileInput = {
    id?: string;
    eventName: string;
    sportType: $Enums.SportCategory;
    eventDate: Date | string;
    city: string;
    state: string;
    venue: string;
    registrationUrl: string;
    description?: string | null;
    organizerName: string;
    status?: $Enums.RequestStatus;
    createdAt?: Date | string;
};
export type EventRequestUncheckedCreateWithoutProfileInput = {
    id?: string;
    eventName: string;
    sportType: $Enums.SportCategory;
    eventDate: Date | string;
    city: string;
    state: string;
    venue: string;
    registrationUrl: string;
    description?: string | null;
    organizerName: string;
    status?: $Enums.RequestStatus;
    createdAt?: Date | string;
};
export type EventRequestCreateOrConnectWithoutProfileInput = {
    where: Prisma.EventRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventRequestCreateWithoutProfileInput, Prisma.EventRequestUncheckedCreateWithoutProfileInput>;
};
export type EventRequestCreateManyProfileInputEnvelope = {
    data: Prisma.EventRequestCreateManyProfileInput | Prisma.EventRequestCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type EventRequestUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.EventRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.EventRequestUpdateWithoutProfileInput, Prisma.EventRequestUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.EventRequestCreateWithoutProfileInput, Prisma.EventRequestUncheckedCreateWithoutProfileInput>;
};
export type EventRequestUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.EventRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.EventRequestUpdateWithoutProfileInput, Prisma.EventRequestUncheckedUpdateWithoutProfileInput>;
};
export type EventRequestUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.EventRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.EventRequestUpdateManyMutationInput, Prisma.EventRequestUncheckedUpdateManyWithoutProfileInput>;
};
export type EventRequestScalarWhereInput = {
    AND?: Prisma.EventRequestScalarWhereInput | Prisma.EventRequestScalarWhereInput[];
    OR?: Prisma.EventRequestScalarWhereInput[];
    NOT?: Prisma.EventRequestScalarWhereInput | Prisma.EventRequestScalarWhereInput[];
    id?: Prisma.UuidFilter<"EventRequest"> | string;
    userId?: Prisma.UuidNullableFilter<"EventRequest"> | string | null;
    eventName?: Prisma.StringFilter<"EventRequest"> | string;
    sportType?: Prisma.EnumSportCategoryFilter<"EventRequest"> | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFilter<"EventRequest"> | Date | string;
    city?: Prisma.StringFilter<"EventRequest"> | string;
    state?: Prisma.StringFilter<"EventRequest"> | string;
    venue?: Prisma.StringFilter<"EventRequest"> | string;
    registrationUrl?: Prisma.StringFilter<"EventRequest"> | string;
    description?: Prisma.StringNullableFilter<"EventRequest"> | string | null;
    organizerName?: Prisma.StringFilter<"EventRequest"> | string;
    status?: Prisma.EnumRequestStatusFilter<"EventRequest"> | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFilter<"EventRequest"> | Date | string;
};
export type EventRequestCreateManyProfileInput = {
    id?: string;
    eventName: string;
    sportType: $Enums.SportCategory;
    eventDate: Date | string;
    city: string;
    state: string;
    venue: string;
    registrationUrl: string;
    description?: string | null;
    organizerName: string;
    status?: $Enums.RequestStatus;
    createdAt?: Date | string;
};
export type EventRequestUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventName?: Prisma.StringFieldUpdateOperationsInput | string;
    sportType?: Prisma.EnumSportCategoryFieldUpdateOperationsInput | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    state?: Prisma.StringFieldUpdateOperationsInput | string;
    venue?: Prisma.StringFieldUpdateOperationsInput | string;
    registrationUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    organizerName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventRequestUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventName?: Prisma.StringFieldUpdateOperationsInput | string;
    sportType?: Prisma.EnumSportCategoryFieldUpdateOperationsInput | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    state?: Prisma.StringFieldUpdateOperationsInput | string;
    venue?: Prisma.StringFieldUpdateOperationsInput | string;
    registrationUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    organizerName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventRequestUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventName?: Prisma.StringFieldUpdateOperationsInput | string;
    sportType?: Prisma.EnumSportCategoryFieldUpdateOperationsInput | $Enums.SportCategory;
    eventDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    state?: Prisma.StringFieldUpdateOperationsInput | string;
    venue?: Prisma.StringFieldUpdateOperationsInput | string;
    registrationUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    organizerName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventName?: boolean;
    sportType?: boolean;
    eventDate?: boolean;
    city?: boolean;
    state?: boolean;
    venue?: boolean;
    registrationUrl?: boolean;
    description?: boolean;
    organizerName?: boolean;
    status?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.EventRequest$profileArgs<ExtArgs>;
}, ExtArgs["result"]["eventRequest"]>;
export type EventRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventName?: boolean;
    sportType?: boolean;
    eventDate?: boolean;
    city?: boolean;
    state?: boolean;
    venue?: boolean;
    registrationUrl?: boolean;
    description?: boolean;
    organizerName?: boolean;
    status?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.EventRequest$profileArgs<ExtArgs>;
}, ExtArgs["result"]["eventRequest"]>;
export type EventRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    eventName?: boolean;
    sportType?: boolean;
    eventDate?: boolean;
    city?: boolean;
    state?: boolean;
    venue?: boolean;
    registrationUrl?: boolean;
    description?: boolean;
    organizerName?: boolean;
    status?: boolean;
    createdAt?: boolean;
    profile?: boolean | Prisma.EventRequest$profileArgs<ExtArgs>;
}, ExtArgs["result"]["eventRequest"]>;
export type EventRequestSelectScalar = {
    id?: boolean;
    userId?: boolean;
    eventName?: boolean;
    sportType?: boolean;
    eventDate?: boolean;
    city?: boolean;
    state?: boolean;
    venue?: boolean;
    registrationUrl?: boolean;
    description?: boolean;
    organizerName?: boolean;
    status?: boolean;
    createdAt?: boolean;
};
export type EventRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "eventName" | "sportType" | "eventDate" | "city" | "state" | "venue" | "registrationUrl" | "description" | "organizerName" | "status" | "createdAt", ExtArgs["result"]["eventRequest"]>;
export type EventRequestInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.EventRequest$profileArgs<ExtArgs>;
};
export type EventRequestIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.EventRequest$profileArgs<ExtArgs>;
};
export type EventRequestIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.EventRequest$profileArgs<ExtArgs>;
};
export type $EventRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EventRequest";
    objects: {
        profile: Prisma.$ProfilePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string | null;
        eventName: string;
        sportType: $Enums.SportCategory;
        eventDate: Date;
        city: string;
        state: string;
        venue: string;
        registrationUrl: string;
        description: string | null;
        organizerName: string;
        status: $Enums.RequestStatus;
        createdAt: Date;
    }, ExtArgs["result"]["eventRequest"]>;
    composites: {};
};
export type EventRequestGetPayload<S extends boolean | null | undefined | EventRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventRequestPayload, S>;
export type EventRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EventRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventRequestCountAggregateInputType | true;
};
export interface EventRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EventRequest'];
        meta: {
            name: 'EventRequest';
        };
    };
    findUnique<T extends EventRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, EventRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventRequestClient<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EventRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventRequestClient<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EventRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, EventRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventRequestClient<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EventRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventRequestClient<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EventRequestFindManyArgs>(args?: Prisma.SelectSubset<T, EventRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EventRequestCreateArgs>(args: Prisma.SelectSubset<T, EventRequestCreateArgs<ExtArgs>>): Prisma.Prisma__EventRequestClient<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EventRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, EventRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EventRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EventRequestDeleteArgs>(args: Prisma.SelectSubset<T, EventRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__EventRequestClient<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EventRequestUpdateArgs>(args: Prisma.SelectSubset<T, EventRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__EventRequestClient<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EventRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EventRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, EventRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EventRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EventRequestUpsertArgs>(args: Prisma.SelectSubset<T, EventRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__EventRequestClient<runtime.Types.Result.GetResult<Prisma.$EventRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EventRequestCountArgs>(args?: Prisma.Subset<T, EventRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EventRequestCountAggregateOutputType> : number>;
    aggregate<T extends EventRequestAggregateArgs>(args: Prisma.Subset<T, EventRequestAggregateArgs>): Prisma.PrismaPromise<GetEventRequestAggregateType<T>>;
    groupBy<T extends EventRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EventRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: EventRequestGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EventRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EventRequestFieldRefs;
}
export interface Prisma__EventRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    profile<T extends Prisma.EventRequest$profileArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventRequest$profileArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EventRequestFieldRefs {
    readonly id: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly userId: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly eventName: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly sportType: Prisma.FieldRef<"EventRequest", 'SportCategory'>;
    readonly eventDate: Prisma.FieldRef<"EventRequest", 'DateTime'>;
    readonly city: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly state: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly venue: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly registrationUrl: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly description: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly organizerName: Prisma.FieldRef<"EventRequest", 'String'>;
    readonly status: Prisma.FieldRef<"EventRequest", 'RequestStatus'>;
    readonly createdAt: Prisma.FieldRef<"EventRequest", 'DateTime'>;
}
export type EventRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelect<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    include?: Prisma.EventRequestInclude<ExtArgs> | null;
    where: Prisma.EventRequestWhereUniqueInput;
};
export type EventRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelect<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    include?: Prisma.EventRequestInclude<ExtArgs> | null;
    where: Prisma.EventRequestWhereUniqueInput;
};
export type EventRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EventRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EventRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EventRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelect<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    include?: Prisma.EventRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventRequestCreateInput, Prisma.EventRequestUncheckedCreateInput>;
};
export type EventRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EventRequestCreateManyInput | Prisma.EventRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    data: Prisma.EventRequestCreateManyInput | Prisma.EventRequestCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EventRequestIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EventRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelect<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    include?: Prisma.EventRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventRequestUpdateInput, Prisma.EventRequestUncheckedUpdateInput>;
    where: Prisma.EventRequestWhereUniqueInput;
};
export type EventRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EventRequestUpdateManyMutationInput, Prisma.EventRequestUncheckedUpdateManyInput>;
    where?: Prisma.EventRequestWhereInput;
    limit?: number;
};
export type EventRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventRequestUpdateManyMutationInput, Prisma.EventRequestUncheckedUpdateManyInput>;
    where?: Prisma.EventRequestWhereInput;
    limit?: number;
    include?: Prisma.EventRequestIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EventRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelect<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    include?: Prisma.EventRequestInclude<ExtArgs> | null;
    where: Prisma.EventRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventRequestCreateInput, Prisma.EventRequestUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EventRequestUpdateInput, Prisma.EventRequestUncheckedUpdateInput>;
};
export type EventRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelect<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    include?: Prisma.EventRequestInclude<ExtArgs> | null;
    where: Prisma.EventRequestWhereUniqueInput;
};
export type EventRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventRequestWhereInput;
    limit?: number;
};
export type EventRequest$profileArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfileWhereInput;
};
export type EventRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventRequestSelect<ExtArgs> | null;
    omit?: Prisma.EventRequestOmit<ExtArgs> | null;
    include?: Prisma.EventRequestInclude<ExtArgs> | null;
};
