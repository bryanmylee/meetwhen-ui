export type ValidatorReturn = {
	error: string;
};

export type Validator<T> = (value: T) => ValidatorReturn;

export type GetValidator<T, Props> = (
	props: Props,
) => (value: T) => ValidatorReturn;
