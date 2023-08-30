import { Reducer } from "@rbxts/rodux";
import {
	ActionCreatorWithoutPayload,
	PayloadAction,
	PayloadActionCreator,
	PrepareAction,
	_ActionCreatorWithPreparedPayload,
} from "./actions.types";
import { CaseReducer, CaseReducers } from "./reducers.types";
import { NoInfer, Omit } from "./types";
import { BuilderCallback } from "./rodux-utils";

export declare type SliceActionCreator<TPayload> = PayloadActionCreator<TPayload>;

export declare type CaseReducerWithPrepare<TState, TAction extends PayloadAction> = {
	reducer: CaseReducer<TState, TAction>;
	prepare: PrepareAction<TAction["payload"]>;
};

export declare type SliceCaseReducers<TState> = {
	[K: string]: CaseReducer<TState, PayloadAction<any>> | CaseReducerWithPrepare<TState, PayloadAction<any, string>>;
};

declare type ActionCreatorForCaseReducerWithPrepare<
	TCaseReducer extends { prepare: any },
	TName extends string,
> = _ActionCreatorWithPreparedPayload<TCaseReducer["prepare"], TName>;

declare type ActionCreatorForCaseReducer<TCaseReducer, Type extends string> = TCaseReducer extends (
	state: any,
	action: infer TAction,
) => any
	? TAction extends { payload: infer TPayload }
		? PayloadActionCreator<TPayload, Type>
		: ActionCreatorWithoutPayload<Type>
	: ActionCreatorWithoutPayload<Type>;

declare type SliceActionType<TSliceName extends string, TActionName extends keyof any> = TActionName extends
	| string
	| number
	? `${TSliceName}/${TActionName}`
	: string;

export declare type CaseReducerActions<TCaseReducers extends SliceCaseReducers<any>, TSliceName extends string> = {
	[Type in keyof TCaseReducers]: TCaseReducers[Type] extends { prepare: any }
		? ActionCreatorForCaseReducerWithPrepare<TCaseReducers[Type], SliceActionType<TSliceName, Type>>
		: ActionCreatorForCaseReducer<TCaseReducers[Type], SliceActionType<TSliceName, Type>>;
};

declare type SliceDefinedCaseReducers<TCaseReducers extends SliceCaseReducers<any>> = {
	[Type in keyof TCaseReducers]: TCaseReducers[Type] extends {
		reducer: infer Reducer;
	}
		? Reducer
		: TCaseReducers[Type];
};

export declare interface Slice<
	TState = any,
	TCaseReducers extends SliceCaseReducers<TState> = SliceCaseReducers<TState>,
	TName extends string = string,
> {
	name: TName;
	reducer: Reducer<TState>;
	actions: CaseReducerActions<TCaseReducers, TName>;
	caseReducers: SliceDefinedCaseReducers<TCaseReducers>;
}

export type ValidateSliceCaseReducers<TState, TCaseReducers extends SliceCaseReducers<TState>> = TCaseReducers & {
	[T in keyof TCaseReducers]: TCaseReducers[T] extends {
		reducer(s: TState, action?: infer TAction): any;
	}
		? {
				prepare: (...a: never[]) => Omit<TAction, "type">;
		  }
		: {};
};

export declare interface SliceOptions<
	TState = any,
	TCaseReducers extends SliceCaseReducers<TState> = SliceCaseReducers<TState>,
	TName extends string = string,
> {
	name: TName;
	initialState: TState;
	reducers: ValidateSliceCaseReducers<TState, TCaseReducers>;
	extraReducers?: CaseReducers<NoInfer<TState>, any> | BuilderCallback<TState>;
}
