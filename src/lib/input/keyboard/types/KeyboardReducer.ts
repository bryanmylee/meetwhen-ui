export type KeyboardReducer<State> = (
	event: KeyboardEvent,
	current: State,
) => State;
