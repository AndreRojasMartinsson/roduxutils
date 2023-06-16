import { AnyAction } from "@rbxts/rodux";
import { Action, Reducer } from "@rbxts/rodux";
import { Omit, TypedActionCreator } from "./types";
import {
	ActionMatcherDescriptionCollection,
	CaseReducer,
	CaseReducers,
	NotFunction,
	ReadonlyActionMatcherDescriptionCollection,
	ReducerWithInitialState,
} from "./reducers.types";
import { PayloadActionCreator, PrepareAction } from "./actions.types";
import { Slice, SliceCaseReducers, SliceOptions } from "./slices.types";

declare type BuilderCallback<TState> = (builder: ReducerBuilder<TState>) => void;

/**
 * A builder for an action reducer map.
 * @class ReducerBuilder
 * @template TState - State that should be passed in
 */
export declare class ReducerBuilder<TState> {
	private cases: Cases;
	private matchers: Matchers;
	private initialState?: TState;
	private defaultCase: Reducer<any, AnyAction>;

	/**
	 * Build a reducer builder from map notation.
	 * @static
	 * @param {TState} [initialState]
	 * @param {Cases} [cases]
	 * @param {Matchers} [matchers]
	 * @param {Reducer<any, AnyAction>} [defaultCase]
	 * @returns {*}  {ReducerBuilder<TState>}
	 */
	static fromMap<TState>(
		initialState?: TState,
		cases?: Cases,
		matchers?: Matchers,
		defaultCase?: Reducer<any, AnyAction>,
	): ReducerBuilder<TState>;

	/**
	 * Creates an instance of ReducerBuilder.
	 * @param {TState} [initialState]
	 */
	constructor(initialState?: TState);

	/**
	 * Adds a case reducer to handle a  single exact action type.
	 * All calls to `builder.addCase` must come before any calls to `.addMatcher` or `.addDefaultCase`.
	 * @param {TActionCreator} actionCreator
	 * @param {CaseReducer<TState, ReturnType<TActionCreator>>} reducer
	 * @returns {*}  {ReducerBuilder<TState>}
	 */
	addCase<TActionCreator extends TypedActionCreator<string>>(
		actionCreator: TActionCreator,
		reducer: CaseReducer<TState, ReturnType<TActionCreator>>,
	): ReducerBuilder<TState>;

	/**
	 * Enables you to match incoming actions against your own predicate function instead
	 * of only the `action.type` property.
	 * @param {(((value: Action<string>) => value is TAction extends Action<string> ? TAction : never)
	 * 			| ((action: Action<string>) => boolean))} matcher
	 * @param {(CaseReducer<TState, TAction extends AnyAction ? TAction : TAction & AnyAction>)} reducer
	 * @returns {*}  {Omit<ReducerBuilder<TState>, "addCase">}
	 */
	addMatcher<TAction>(
		matcher:
			| ((value: Action<string>) => value is TAction extends Action<string> ? TAction : never)
			| ((action: Action<string>) => boolean),
		reducer: CaseReducer<TState, TAction extends AnyAction ? TAction : TAction & AnyAction>,
	): Omit<ReducerBuilder<TState>, "addCase">;

	/**
	 * Adds a "default case" reducer that is executed if no case reducer and
	 * no matcher reducer was executed for the action.
	 * @param {CaseReducer<TState, AnyAction>} reducer
	 * @returns {*}  {{}}
	 * @memberof ReducerBuilder
	 */
	addDefaultCase(reducer: CaseReducer<TState, AnyAction>): {};
}

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types.
 * @param {TState} initialState
 * @param {BuilderCallback<TState>} builderCallback
 * @returns {*}  {ReducerWithInitialState<TState>}
 */
export declare function createReducer<TState extends NotFunction<any>>(
	initialState: TState,
	builderCallback: BuilderCallback<TState>,
): ReducerWithInitialState<TState>;

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 * @param {TState} initialState
 * @param {TCaseReducers} actionsMap
 * @param {ActionMatcherDescriptionCollection<TState>} [matchers]
 * @param {CaseReducer<TState>} [defaultCaseReducer]
 * @returns {*}  {ReducerWithInitialState<TState>}
 */
export declare function createReducer<
	TState extends NotFunction<any>,
	TCaseReducers extends CaseReducers<TState, any> = CaseReducers<TState, any>,
>(
	initialState: TState,
	actionsMap: TCaseReducers,
	matchers?: ActionMatcherDescriptionCollection<TState>,
	defaultCaseReducer?: CaseReducer<TState>,
): ReducerWithInitialState<TState>;

export declare function createReducer<TState extends NotFunction<any>>(
	initialState: TState,
	callbackOrHandlers: CaseReducers<TState, any> | BuilderCallback<TState>,
	matchers: ReadonlyActionMatcherDescriptionCollection<TState>,
	defaultCaseReducer?: CaseReducer<TState>,
): ReducerWithInitialState<TState>;

// Actions

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload.
 * @param {TName} name
 * @returns {*}  {PayloadActionCreator<TPayload, TName>}
 */
export declare function createAction<TPayload = void, TName extends string = string>(
	name: TName,
): PayloadActionCreator<TPayload, TName>;

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload.
 * @param {TName} name
 * @param {TPrepare} prepare
 * @returns {*}  {PayloadActionCreator<ReturnType<TPrepare>["payload"], TName, TPrepare>}
 */
export declare function createAction<TPrepare extends PrepareAction<any>, TName extends string = string>(
	name: TName,
	prepare: TPrepare,
): PayloadActionCreator<ReturnType<TPrepare>["payload"], TName, TPrepare>;

export declare function createAction(name: string, prepare?: Callback): any;

interface Cases {
	[key: string]: Reducer<any, AnyAction>;
}

type Matchers = { matcher: (action: Action) => boolean; reducer: Reducer<any, AnyAction> }[];

// Slices
/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "slice name", and automatically generates
 * action creators and action types that correspond to the
 * reducers and state.
 * @param {SliceOptions<TState, TCaseReducers, TName>} options
 * @returns {*}  {Slice<TState, TCaseReducers, TName>}
 */
export declare function createSlice<
	TState,
	TCaseReducers extends SliceCaseReducers<TState>,
	TName extends string = string,
>(options: SliceOptions<TState, TCaseReducers, TName>): Slice<TState, TCaseReducers, TName>;

// Selectors
declare type Selector<TState = any> = (state: TState, ...args: Array<any>) => any | undefined;
declare type ResultFunction = (...args: Array<any>) => any | undefined;
declare type MemoizeFunction<TFunction = ResultFunction> = (fn: TFunction, ...args: Array<any>) => TFunction;
declare type EqualityFunction = (a?: any, b?: any) => boolean;
declare interface MemoizeOptions {
	equalityCheck?: EqualityFunction;
	resultEqualityCheck: EqualityFunction;
	maxSize?: number;
}

/**
 * Utility function to create a memoized selector.
 * @param {Selector<TState>[]} inputSelectors
 * @param {ResultFunction} resultFunction
 * @param {MemoizeOptions} memoizeOptions
 * @param {...Array<any>} args
 * @returns {*}  {Selector}
 */
export declare function createSelector<TState = any>(
	inputSelectors: Selector<TState>[],
	resultFunction: ResultFunction,
	memoizeOptions: MemoizeOptions,
	...args: Array<any>
): Selector;

/**
 * Used to create a custom version of createSelector
 * @param {MemoizeFunction} memoizeFunction
 * @param {...Array<any>} args
 * @returns {*}  {typeof createSelector}
 */
export declare function createSelectorCreator(
	memoizeFunction: MemoizeFunction,
	...args: Array<any>
): typeof createSelector;
