import { Action, AnyAction } from "@rbxts/rodux";

// Local Types
declare type IfMaybe<T, TPayload, True, False> = [T] extends [TPayload] ? True : False;
declare type AtLeastTS35<True, False> = [True, False][IsUnknown<ReturnType<<T>() => T>, 0, 1>];

// Exported Types
export declare type IsAny<T, True, False = never> = true | false extends (T extends never ? true : false)
	? True
	: False;

export declare type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False;

export declare type IsEmptyObject<T, True, False = never> = T extends any
	? keyof T extends never
		? IsUnknown<T, False, IfMaybe<undefined, T, False, IfMaybe<void, T, False, True>>>
		: False
	: never;

export declare type IsUnknownOrNonInferrable<T, True, False> = AtLeastTS35<
	IsUnknown<T, True, False>,
	IsEmptyObject<T, True, IsUnknown<T, True, False>>
>;

/**
 * Passes T out again, but boxes it in a way that it cannot "widen" the type by accident if it is
 * a generic that should be infered from elsewhere.
 */
export declare type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * Custom Omit to be less narrow.
 */
export declare type Omit<T, TKey extends keyof any> = Pick<T, Exclude<keyof T, TKey>>;

export declare interface TypeGuard<T> {
	(value: any): value is T;
}

export declare interface HasMatchFunction<T> {
	match: TypeGuard<T>;
}

export declare type Matcher<T> = HasMatchFunction<T> | TypeGuard<T>;

export declare type Id<T> = { [K in keyof T]: T[K] } & {};

export declare interface TypedActionCreator<TName extends string> {
	(...args: any[]): Action<TName>;
	type: TName;
}
