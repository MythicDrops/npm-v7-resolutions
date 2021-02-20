import {
  Failure,
  failure,
  isFailure,
  isSuccess,
  Success,
  success,
} from "../results";

test("success creates Success", () => {
  const result = success("test");
  expect(result.type).toEqual("success");
  expect(result.value).toEqual("test");
});

test("failure creates Failure", () => {
  const result = failure("test");
  expect(result.type).toEqual("failure");
  expect(result.reason).toEqual("test");
});

test("isSuccess returns true for Success", () => {
  const result: Success<String> = { type: "success", value: "test" };
  expect(isSuccess(result)).toBeTruthy();
});

test("isSuccess returns false for Failure", () => {
  const result: Failure<string> = { type: "failure", reason: "test" };
  expect(isSuccess(result)).toBeFalsy();
});

test("isFailure returns true for Failure", () => {
  const result: Failure<string> = { type: "failure", reason: "test" };
  expect(isFailure(result)).toBeTruthy();
});

test("isFailure returns false for Success", () => {
  const result: Success<String> = { type: "success", value: "test" };
  expect(isFailure(result)).toBeFalsy();
});
