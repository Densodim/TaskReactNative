import validateField from "../validateField";

describe("validation function that takes a `fields` object as input", () => {
  it("validate input title, return null if value validated", () => {
    const input = { title: "title" };
    const result = validateField(input);
    expect(result).toBeNull();
  });
  it("returns an error if the field is required and empty", () => {
    const input = { title: "" };
    const result = validateField(input);
    expect(result).toMatch(/title/);
  });

  it("returns an error if the field exceeds the maximum length", () => {
    const input = { title: "This title is too long" };
    const result = validateField(input);
    expect(result).toBe("Only letters are allowed.");
  });

  it("returns an error if the field does not match the pattern", () => {
    const input = { title: "title123" };
    const result = validateField(input);
    expect(result).toBe("Only letters are allowed.");
  });
});
