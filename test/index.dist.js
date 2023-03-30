(() => {
  // test/hmr.js
  function enableHMR() {
    new EventSource("http://localhost:8002/esbuild").addEventListener(
      "change",
      () => {
        location.reload();
      }
    );
  }
  enableHMR();
  var _log = console.log;
  var _error = console.error;
  console.log = (msg) => {
    _log(msg);
    const p = document.createElement("p");
    p.innerText = msg;
    document.body.append(p);
  };
  console.error = (msg) => {
    _error(msg);
    const p = document.createElement("p");
    p.innerText = msg;
    p.style.cssText = "color: red;";
    document.body.append(p);
  };

  // lib/index.js
  var doc = document;
  var createElement = doc.createElement.bind(doc);
  var setStyle = (element, values, overwrite) => {
    const style = element.style;
    if (typeof values === "string") {
      style.cssText = overwrite ? values : style.cssText + ";" + values;
      return;
    }
    if (overwrite) {
      style.cssText = "";
    }
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        style[key] = values[key].replace("!important", "");
      }
    }
  };
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) => Object.prototype.hasOwnProperty.call(instance, prop);
  }

  // test/test-helper.ts
  var failures = [];
  function assertEquals(value1, value2) {
    if (value1 !== value2) {
      failures.push(
        new Error(`Assert failed: ${String(value1)} with ${String(value2)}`)
      );
    }
  }
  function assertTrue(value) {
    if (!value) {
      failures.push(
        new Error(`Assert failed`)
      );
    }
  }
  async function runTest(name, func) {
    console.log("Start test", name);
    await func();
    if (failures.length === 0) {
      console.log("All test passed");
    } else {
      for (const failure of failures) {
        console.error(failure);
      }
    }
  }

  // test/index.js
  function styleIncludes(expected, input) {
    input.split(";").map((value) => value.trim()).forEach((value) => assertTrue(expected.includes(value)));
  }
  function styleEquals(expected, input) {
    styleIncludes(expected, input);
    styleIncludes(input, expected);
  }
  runTest("setStyle", () => {
    const div = createElement("div");
    div.innerHTML = "Hello World!";
    document.body.append(div);
    setStyle(div, "width: 100px; height: 100px; background-color:red !important");
    console.log(div.style.cssText);
    assertEquals(
      div.style.cssText,
      "width: 100px; height: 100px; background-color: red !important;"
    );
    setStyle(div, "width: 100px; height: 100px; color: yellow;");
    console.log(div.style.cssText);
    styleEquals(
      div.style.cssText,
      "width: 100px; height: 100px; color: yellow; background-color: red !important;"
    );
    setStyle(div, "width: 100px; height: 100px; color: yellow !important;", true);
    console.log(div.style.cssText);
    assertEquals(
      div.style.cssText,
      "width: 100px; height: 100px; color: yellow !important;"
    );
    setStyle(
      div,
      "width: 100px; height: 100px; background-color:red   !important",
      true
    );
    console.log(div.style.cssText);
    assertEquals(
      div.style.cssText,
      "width: 100px; height: 100px; background-color: red !important;"
    );
    setStyle(div, "background-color: blue;");
    console.log(div.style.cssText);
    assertEquals(
      div.style.cssText,
      "width: 100px; height: 100px; background-color: red !important;"
    );
    setStyle(div, "background-color: green !important;");
    console.log(div.style.cssText);
    assertEquals(
      div.style.cssText,
      "width: 100px; height: 100px; background-color: green !important;"
    );
    setStyle(
      div,
      "width: 100px; height: 100px; background-color: red !important; background-color: blue;",
      true
    );
    console.log(div.style.cssText);
    assertEquals(
      div.style.cssText,
      "width: 100px; height: 100px; background-color: red !important;"
    );
    setStyle(
      div,
      "width: 100px; height: 100px; background-color: red !important; background-color: blue !important;",
      true
    );
    console.log(div.style.cssText);
    assertEquals(
      div.style.cssText,
      "width: 100px; height: 100px; background-color: blue !important;"
    );
    setStyle(
      div,
      "width: 100px; height: 100px; background-color: red; background-color: blue;",
      true
    );
    console.log(div.style.cssText);
    assertEquals(
      div.style.cssText,
      "width: 100px; height: 100px; background-color: blue;"
    );
    setStyle(
      div,
      `
  -webkit-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);
  -moz-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);
  box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);`
    );
    console.log(div.style.cssText);
    styleIncludes(
      div.style.cssText,
      "width: 100px; height: 100px; background-color: blue; box-shadow: rgba(62, 66, 66, 0.22) 0px 10px 39px 10px;"
    );
  });
})();
