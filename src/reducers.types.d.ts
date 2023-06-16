import { Action, AnyAction, Reducer } from "@rbxts/rodux";
import { NoInfer } from "./types";
import { Draft } from "@rbxts/immut/src/types-external";

export declare type Actions<TKey extends keyof any = string> = Record<TKey, Action>;

export declare interface ActionMatcher<TAction extends AnyAction> {
	(action: AnyAction): action is TAction;
}

export declare type ActionMatcherDescription<TState, TAction extends AnyAction> = {
	matcher: ActionMatcher<TAction>;
	reducer: CaseReducer<TState, NoInfer<TAction>>;
};

export declare type ReadonlyActionMatcherDescriptionCollection<S> = ReadonlyArray<ActionMatcherDescription<S, any>>;

export declare type ActionMatcherDescriptionCollection<S> = Array<ActionMatcherDescription<S, any>>;

export declare type CaseReducer<TState = any, TAction extends Action = AnyAction> = (
	state: Draft<TState>,
	action: TAction,
) => NoInfer<TState> | void | Draft<NoInfer<TState>>;

export declare type CaseReducers<TState, TActions extends Actions> = {
	[K in keyof TActions]: TActions[K] extends Action ? CaseReducer<TState, TActions[K]> : void;
};

export declare type NotFunction<TMaybeFunction> = TMaybeFunction extends Callback ? never : TMaybeFunction;

export declare type ReducerWithInitialState<TState extends NotFunction<any>> = Reducer<TState>;
