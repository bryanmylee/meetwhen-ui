export interface ReactiveClass<ComponentState> {
	(state: ComponentState): string;
}
