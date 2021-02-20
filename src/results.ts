/**
 * Represents an expected failure case.
 *
 * Not intended for replacing all `try/catch` uses, just ones
 * where failures can be expected.
 */
export type Failure<Reason> = {
  type: "failure";
  reason: Reason;
};

/**
 * Represents a success case.
 */
export type Success<Value> = {
  type: "success";
  value: Value;
};

/**
 * Represents either an expected failure case or a success case.
 */
export type Result<Reason, Value> = Failure<Reason> | Success<Value>;

/**
 * Constructs a {@link Success} instance wrapping the given value.
 * @param value value to wrap
 */
export const success = <Value>(value: Value): Success<Value> => ({
  type: "success",
  value,
});

/**
 * Constructs a {@link Failure} instance with the given reason for failure.
 * @param reason reason for the failure
 */
export const failure = <Reason>(reason: Reason): Failure<Reason> => ({
  type: "failure",
  reason,
});

/**
 * Type Guard to determine if the given result is a {@link Success}.
 * @param result potential success or failure
 */
export const isSuccess = <Reason, Value>(
  result: Result<Reason, Value>
): result is Success<Value> => {
  return result.type === "success";
};

/**
 * Type Guard to determine if the given result is a {@link Failure}.
 * @param result potential success or failure
 */
export const isFailure = <Reason, Value>(
  result: Result<Reason, Value>
): result is Failure<Reason> => {
  return result.type === "failure";
};
