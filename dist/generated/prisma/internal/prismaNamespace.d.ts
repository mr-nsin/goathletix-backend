import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Organizer: "Organizer";
    readonly Event: "Event";
    readonly Profile: "Profile";
    readonly Follow: "Follow";
    readonly UserCalendar: "UserCalendar";
    readonly Reminder: "Reminder";
    readonly EventRequest: "EventRequest";
    readonly UserFeedback: "UserFeedback";
    readonly ActivityLog: "ActivityLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "organizer" | "event" | "profile" | "follow" | "userCalendar" | "reminder" | "eventRequest" | "userFeedback" | "activityLog";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Organizer: {
            payload: Prisma.$OrganizerPayload<ExtArgs>;
            fields: Prisma.OrganizerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrganizerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrganizerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>;
                };
                findFirst: {
                    args: Prisma.OrganizerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrganizerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>;
                };
                findMany: {
                    args: Prisma.OrganizerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>[];
                };
                create: {
                    args: Prisma.OrganizerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>;
                };
                createMany: {
                    args: Prisma.OrganizerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OrganizerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>[];
                };
                delete: {
                    args: Prisma.OrganizerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>;
                };
                update: {
                    args: Prisma.OrganizerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>;
                };
                deleteMany: {
                    args: Prisma.OrganizerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrganizerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OrganizerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>[];
                };
                upsert: {
                    args: Prisma.OrganizerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrganizerPayload>;
                };
                aggregate: {
                    args: Prisma.OrganizerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrganizer>;
                };
                groupBy: {
                    args: Prisma.OrganizerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrganizerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrganizerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrganizerCountAggregateOutputType> | number;
                };
            };
        };
        Event: {
            payload: Prisma.$EventPayload<ExtArgs>;
            fields: Prisma.EventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>;
                };
                findFirst: {
                    args: Prisma.EventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>;
                };
                findMany: {
                    args: Prisma.EventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>[];
                };
                create: {
                    args: Prisma.EventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>;
                };
                createMany: {
                    args: Prisma.EventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>[];
                };
                delete: {
                    args: Prisma.EventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>;
                };
                update: {
                    args: Prisma.EventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>;
                };
                deleteMany: {
                    args: Prisma.EventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>[];
                };
                upsert: {
                    args: Prisma.EventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventPayload>;
                };
                aggregate: {
                    args: Prisma.EventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEvent>;
                };
                groupBy: {
                    args: Prisma.EventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EventCountAggregateOutputType> | number;
                };
            };
        };
        Profile: {
            payload: Prisma.$ProfilePayload<ExtArgs>;
            fields: Prisma.ProfileFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProfileFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                findFirst: {
                    args: Prisma.ProfileFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                findMany: {
                    args: Prisma.ProfileFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>[];
                };
                create: {
                    args: Prisma.ProfileCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                createMany: {
                    args: Prisma.ProfileCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>[];
                };
                delete: {
                    args: Prisma.ProfileDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                update: {
                    args: Prisma.ProfileUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                deleteMany: {
                    args: Prisma.ProfileDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProfileUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>[];
                };
                upsert: {
                    args: Prisma.ProfileUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                aggregate: {
                    args: Prisma.ProfileAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProfile>;
                };
                groupBy: {
                    args: Prisma.ProfileGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProfileGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProfileCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProfileCountAggregateOutputType> | number;
                };
            };
        };
        Follow: {
            payload: Prisma.$FollowPayload<ExtArgs>;
            fields: Prisma.FollowFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FollowFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FollowFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                findFirst: {
                    args: Prisma.FollowFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FollowFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                findMany: {
                    args: Prisma.FollowFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>[];
                };
                create: {
                    args: Prisma.FollowCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                createMany: {
                    args: Prisma.FollowCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FollowCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>[];
                };
                delete: {
                    args: Prisma.FollowDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                update: {
                    args: Prisma.FollowUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                deleteMany: {
                    args: Prisma.FollowDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FollowUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FollowUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>[];
                };
                upsert: {
                    args: Prisma.FollowUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FollowPayload>;
                };
                aggregate: {
                    args: Prisma.FollowAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFollow>;
                };
                groupBy: {
                    args: Prisma.FollowGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FollowGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FollowCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FollowCountAggregateOutputType> | number;
                };
            };
        };
        UserCalendar: {
            payload: Prisma.$UserCalendarPayload<ExtArgs>;
            fields: Prisma.UserCalendarFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserCalendarFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserCalendarFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>;
                };
                findFirst: {
                    args: Prisma.UserCalendarFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserCalendarFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>;
                };
                findMany: {
                    args: Prisma.UserCalendarFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>[];
                };
                create: {
                    args: Prisma.UserCalendarCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>;
                };
                createMany: {
                    args: Prisma.UserCalendarCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCalendarCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>[];
                };
                delete: {
                    args: Prisma.UserCalendarDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>;
                };
                update: {
                    args: Prisma.UserCalendarUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>;
                };
                deleteMany: {
                    args: Prisma.UserCalendarDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserCalendarUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserCalendarUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>[];
                };
                upsert: {
                    args: Prisma.UserCalendarUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCalendarPayload>;
                };
                aggregate: {
                    args: Prisma.UserCalendarAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserCalendar>;
                };
                groupBy: {
                    args: Prisma.UserCalendarGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCalendarGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCalendarCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCalendarCountAggregateOutputType> | number;
                };
            };
        };
        Reminder: {
            payload: Prisma.$ReminderPayload<ExtArgs>;
            fields: Prisma.ReminderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ReminderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ReminderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>;
                };
                findFirst: {
                    args: Prisma.ReminderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ReminderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>;
                };
                findMany: {
                    args: Prisma.ReminderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>[];
                };
                create: {
                    args: Prisma.ReminderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>;
                };
                createMany: {
                    args: Prisma.ReminderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ReminderCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>[];
                };
                delete: {
                    args: Prisma.ReminderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>;
                };
                update: {
                    args: Prisma.ReminderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>;
                };
                deleteMany: {
                    args: Prisma.ReminderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ReminderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ReminderUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>[];
                };
                upsert: {
                    args: Prisma.ReminderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReminderPayload>;
                };
                aggregate: {
                    args: Prisma.ReminderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReminder>;
                };
                groupBy: {
                    args: Prisma.ReminderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReminderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ReminderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReminderCountAggregateOutputType> | number;
                };
            };
        };
        EventRequest: {
            payload: Prisma.$EventRequestPayload<ExtArgs>;
            fields: Prisma.EventRequestFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EventRequestFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EventRequestFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>;
                };
                findFirst: {
                    args: Prisma.EventRequestFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EventRequestFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>;
                };
                findMany: {
                    args: Prisma.EventRequestFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>[];
                };
                create: {
                    args: Prisma.EventRequestCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>;
                };
                createMany: {
                    args: Prisma.EventRequestCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EventRequestCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>[];
                };
                delete: {
                    args: Prisma.EventRequestDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>;
                };
                update: {
                    args: Prisma.EventRequestUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>;
                };
                deleteMany: {
                    args: Prisma.EventRequestDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EventRequestUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EventRequestUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>[];
                };
                upsert: {
                    args: Prisma.EventRequestUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EventRequestPayload>;
                };
                aggregate: {
                    args: Prisma.EventRequestAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEventRequest>;
                };
                groupBy: {
                    args: Prisma.EventRequestGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EventRequestGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EventRequestCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EventRequestCountAggregateOutputType> | number;
                };
            };
        };
        UserFeedback: {
            payload: Prisma.$UserFeedbackPayload<ExtArgs>;
            fields: Prisma.UserFeedbackFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFeedbackFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFeedbackFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>;
                };
                findFirst: {
                    args: Prisma.UserFeedbackFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFeedbackFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>;
                };
                findMany: {
                    args: Prisma.UserFeedbackFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>[];
                };
                create: {
                    args: Prisma.UserFeedbackCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>;
                };
                createMany: {
                    args: Prisma.UserFeedbackCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserFeedbackCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>[];
                };
                delete: {
                    args: Prisma.UserFeedbackDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>;
                };
                update: {
                    args: Prisma.UserFeedbackUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>;
                };
                deleteMany: {
                    args: Prisma.UserFeedbackDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserFeedbackUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserFeedbackUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>[];
                };
                upsert: {
                    args: Prisma.UserFeedbackUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserFeedbackPayload>;
                };
                aggregate: {
                    args: Prisma.UserFeedbackAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserFeedback>;
                };
                groupBy: {
                    args: Prisma.UserFeedbackGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserFeedbackGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserFeedbackCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserFeedbackCountAggregateOutputType> | number;
                };
            };
        };
        ActivityLog: {
            payload: Prisma.$ActivityLogPayload<ExtArgs>;
            fields: Prisma.ActivityLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ActivityLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ActivityLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                findFirst: {
                    args: Prisma.ActivityLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ActivityLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                findMany: {
                    args: Prisma.ActivityLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>[];
                };
                create: {
                    args: Prisma.ActivityLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                createMany: {
                    args: Prisma.ActivityLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ActivityLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>[];
                };
                delete: {
                    args: Prisma.ActivityLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                update: {
                    args: Prisma.ActivityLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                deleteMany: {
                    args: Prisma.ActivityLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ActivityLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ActivityLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>[];
                };
                upsert: {
                    args: Prisma.ActivityLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                aggregate: {
                    args: Prisma.ActivityLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateActivityLog>;
                };
                groupBy: {
                    args: Prisma.ActivityLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ActivityLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ActivityLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ActivityLogCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const OrganizerScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly websiteUrl: "websiteUrl";
    readonly logoUrl: "logoUrl";
    readonly isVerified: "isVerified";
    readonly createdAt: "createdAt";
};
export type OrganizerScalarFieldEnum = (typeof OrganizerScalarFieldEnum)[keyof typeof OrganizerScalarFieldEnum];
export declare const EventScalarFieldEnum: {
    readonly id: "id";
    readonly sourceId: "sourceId";
    readonly eventName: "eventName";
    readonly sportType: "sportType";
    readonly eventDate: "eventDate";
    readonly city: "city";
    readonly state: "state";
    readonly venue: "venue";
    readonly distanceOptions: "distanceOptions";
    readonly elevationGain: "elevationGain";
    readonly difficulty: "difficulty";
    readonly priceRange: "priceRange";
    readonly registrationUrl: "registrationUrl";
    readonly organizerId: "organizerId";
    readonly terrain: "terrain";
    readonly isVirtual: "isVirtual";
    readonly status: "status";
    readonly md5PayloadHash: "md5PayloadHash";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];
export declare const ProfileScalarFieldEnum: {
    readonly id: "id";
    readonly fullName: "fullName";
    readonly preferredLocation: "preferredLocation";
    readonly sportsInterest: "sportsInterest";
    readonly onboardingCompleted: "onboardingCompleted";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum];
export declare const FollowScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly targetType: "targetType";
    readonly organizerId: "organizerId";
    readonly eventId: "eventId";
    readonly createdAt: "createdAt";
};
export type FollowScalarFieldEnum = (typeof FollowScalarFieldEnum)[keyof typeof FollowScalarFieldEnum];
export declare const UserCalendarScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly eventId: "eventId";
    readonly createdAt: "createdAt";
};
export type UserCalendarScalarFieldEnum = (typeof UserCalendarScalarFieldEnum)[keyof typeof UserCalendarScalarFieldEnum];
export declare const ReminderScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly eventId: "eventId";
    readonly triggerType: "triggerType";
    readonly isTriggered: "isTriggered";
    readonly createdAt: "createdAt";
};
export type ReminderScalarFieldEnum = (typeof ReminderScalarFieldEnum)[keyof typeof ReminderScalarFieldEnum];
export declare const EventRequestScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly eventName: "eventName";
    readonly sportType: "sportType";
    readonly eventDate: "eventDate";
    readonly city: "city";
    readonly state: "state";
    readonly venue: "venue";
    readonly registrationUrl: "registrationUrl";
    readonly description: "description";
    readonly organizerName: "organizerName";
    readonly status: "status";
    readonly createdAt: "createdAt";
};
export type EventRequestScalarFieldEnum = (typeof EventRequestScalarFieldEnum)[keyof typeof EventRequestScalarFieldEnum];
export declare const UserFeedbackScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly feedbackType: "feedbackType";
    readonly message: "message";
    readonly createdAt: "createdAt";
};
export type UserFeedbackScalarFieldEnum = (typeof UserFeedbackScalarFieldEnum)[keyof typeof UserFeedbackScalarFieldEnum];
export declare const ActivityLogScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly userDisplayName: "userDisplayName";
    readonly actionType: "actionType";
    readonly targetId: "targetId";
    readonly targetName: "targetName";
    readonly createdAt: "createdAt";
};
export type ActivityLogScalarFieldEnum = (typeof ActivityLogScalarFieldEnum)[keyof typeof ActivityLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumSportCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SportCategory'>;
export type ListEnumSportCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SportCategory[]'>;
export type EnumDifficultyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DifficultyLevel'>;
export type ListEnumDifficultyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DifficultyLevel[]'>;
export type EnumEventStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EventStatus'>;
export type ListEnumEventStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EventStatus[]'>;
export type EnumFollowTargetFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FollowTarget'>;
export type ListEnumFollowTargetFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FollowTarget[]'>;
export type EnumReminderTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReminderType'>;
export type ListEnumReminderTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReminderType[]'>;
export type EnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus'>;
export type ListEnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus[]'>;
export type EnumFeedbackTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeedbackType'>;
export type ListEnumFeedbackTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeedbackType[]'>;
export type EnumActivityActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActivityAction'>;
export type ListEnumActivityActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActivityAction[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    organizer?: Prisma.OrganizerOmit;
    event?: Prisma.EventOmit;
    profile?: Prisma.ProfileOmit;
    follow?: Prisma.FollowOmit;
    userCalendar?: Prisma.UserCalendarOmit;
    reminder?: Prisma.ReminderOmit;
    eventRequest?: Prisma.EventRequestOmit;
    userFeedback?: Prisma.UserFeedbackOmit;
    activityLog?: Prisma.ActivityLogOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
