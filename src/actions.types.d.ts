import { IfMaybe, IsAny, IsUnknownOrNonInferrable } from "./types";

export declare type PayloadAction<TPayload = void, TName extends string = string> = {
	payload: TPayload;
	type: TName;
};

export declare type PrepareAction<TPayload> = (...args: Array<any>) => { payload: TPayload };

export declare type _ActionCreatorWithPreparedPayload<
	TPrepare extends PrepareAction<any> | void,
	TName extends string = string,
> = TPrepare extends PrepareAction<infer TPayload>
	? ActionCreatorWithPreparedPayload<Parameters<TPrepare>, TPayload, TName>
	: void;

export declare interface BaseActionCreator<TName extends string = string> {
	type: TName;
}

export declare interface ActionCreatorWithPreparedPayload<
	TArgs extends Array<unknown>,
	TPayload,
	TName extends string = string,
> extends BaseActionCreator<TName> {
	(...args: TArgs): PayloadAction<TPayload, TName>;
}

export declare interface ActionCreatorWithOptionalPayload<TPayload, TName extends string = string>
	extends BaseActionCreator<TName> {
	(payload?: TPayload): PayloadAction<TPayload, TName>;
}

export declare interface ActionCreatorWithoutPayload<TName extends string = string> extends BaseActionCreator<TName> {
	(noArgument: void): PayloadAction<undefined, TName>;
}

export declare interface ActionCreatorWithPayload<TPayload, TName extends string = string>
	extends BaseActionCreator<TName> {
	(payload: TPayload): PayloadAction<TPayload, TName>;
}

export declare interface ActionCreatorWithNonInferrablePayload<TName extends string = string>
	extends BaseActionCreator<TName> {
	<TPayload>(payload: TPayload extends unknown ? unknown : unknown): PayloadAction<TPayload, TName>;
}

export declare type PayloadActionCreator<
	TPayload = void,
	TName extends string = string,
	TPrepare extends PrepareAction<TPayload> | void = void,
> = IfPrepareActionMethodProvided<
	TPrepare,
	_ActionCreatorWithPreparedPayload<TPrepare, TName>,
	IsAny<
		TPayload,
		ActionCreatorWithPayload<any, TName>,
		IsUnknownOrNonInferrable<
			PayloadAction,
			ActionCreatorWithNonInferrablePayload<TName>,
			IfMaybe<
				void,
				TPayload,
				ActionCreatorWithoutPayload<TName>,
				IfMaybe<
					undefined,
					TPayload,
					ActionCreatorWithOptionalPayload<TPayload, TName>,
					ActionCreatorWithPayload<TPayload, TName>
				>
			>
		>
	>
>;

declare type IfPrepareActionMethodProvided<TPrepare extends PrepareAction<any> | void, True, False> = TPrepare extends (
	...args: Array<any>
) => any
	? True
	: False;
