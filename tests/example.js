import { RequestMock, Selector } from "testcafe";

let resolveFn = null;

const mock = RequestMock()
  .onRequestTo(/api\.json/)
  .respond(async (req, res) => {
    await new Promise((resolve) => (resolveFn = resolve));
    res.setBody({ ok: "👌" });
  });

fixture`example`.page`http://127.0.0.1:7772/index.html`.requestHooks(mock);

test("example", async (t) => {
  const btn = Selector("button"),
    input = Selector("input");

  await t
    // assert button enabled
    .expect(btn.hasAttribute("disabled"))
    .notOk()

    // add some text
    .typeText(input, "🤖")

    // assert button disabled
    .expect(btn.hasAttribute("disabled"))
    .ok();

  // stop waiting
  resolveFn();

  // now check that it is enabled again
  await t.expect(btn.hasAttribute("disabled")).notOk();
});
