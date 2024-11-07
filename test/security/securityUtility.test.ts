import SecurityUtility from "../../src/util/security/securityUtility";

const su = jest.requireActual<SecurityUtility>(
  "../../src/util/security/securityUtility"
);

const testCases = [
  {
    input: { plaintext: "testplaintext" },
    output: "testplaintext",
  },
];

describe("Test Encryption", () => {
  it.each(testCases)("", (input, output) => {
    const encryptedText = SecurityUtility.encrypt(input.input.plaintext);
    expect(encryptedText).not;
  });
});
