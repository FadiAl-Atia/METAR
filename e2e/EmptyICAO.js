describe("User entered an empty ICAO", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should show error if the ICAO is empty", async () => {
    await element(by.id("ICAOInput")).typeText("");
    await element(by.id("SubmitButton")).tap();
    await expect(element(by.id("ErrorText"))).toBeVisible();
  });
});
