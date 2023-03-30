import { createElement, setStyle } from "../lib/index"
import { runTest, assertEquals, assertTrue } from "./test-helper"

function styleIncludes(expected, input) {
  input
    .split(";")
    .map((value) => value.trim())
    .forEach((value) => assertTrue(expected.includes(value)))
}

function styleEquals(expected, input) {
  styleIncludes(expected, input)
  styleIncludes(input, expected)
}

runTest("setStyle", () => {
  const div = createElement("div")
  div.innerHTML = "Hello World!"
  document.body.append(div)

  setStyle(div, "width: 100px; height: 100px; background-color:red !important")
  console.log(div.style.cssText)
  assertEquals(
    div.style.cssText,
    "width: 100px; height: 100px; background-color: red !important;"
  )

  setStyle(div, "width: 100px; height: 100px; color: yellow;")
  console.log(div.style.cssText)
  styleEquals(
    div.style.cssText,
    "width: 100px; height: 100px; color: yellow; background-color: red !important;"
  )

  setStyle(div, "width: 100px; height: 100px; color: yellow !important;", true)
  console.log(div.style.cssText)
  assertEquals(
    div.style.cssText,
    "width: 100px; height: 100px; color: yellow !important;"
  )

  setStyle(
    div,
    "width: 100px; height: 100px; background-color:red   !important",
    true
  )
  console.log(div.style.cssText)
  assertEquals(
    div.style.cssText,
    "width: 100px; height: 100px; background-color: red !important;"
  )

  setStyle(div, "background-color: blue;")
  console.log(div.style.cssText)
  assertEquals(
    div.style.cssText,
    "width: 100px; height: 100px; background-color: red !important;"
  )

  setStyle(div, "background-color: green !important;")
  console.log(div.style.cssText)
  assertEquals(
    div.style.cssText,
    "width: 100px; height: 100px; background-color: green !important;"
  )

  setStyle(
    div,
    "width: 100px; height: 100px; background-color: red !important; background-color: blue;",
    true
  )
  console.log(div.style.cssText)
  assertEquals(
    div.style.cssText,
    "width: 100px; height: 100px; background-color: red !important;"
  )

  setStyle(
    div,
    "width: 100px; height: 100px; background-color: red !important; background-color: blue !important;",
    true
  )
  console.log(div.style.cssText)
  assertEquals(
    div.style.cssText,
    "width: 100px; height: 100px; background-color: blue !important;"
  )

  setStyle(
    div,
    "width: 100px; height: 100px; background-color: red; background-color: blue;",
    true
  )
  console.log(div.style.cssText)
  assertEquals(
    div.style.cssText,
    "width: 100px; height: 100px; background-color: blue;"
  )

  setStyle(
    div,
    `
  -webkit-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);
  -moz-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);
  box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);`
  )
  console.log(div.style.cssText)
  styleIncludes(
    div.style.cssText,
    "width: 100px; height: 100px; background-color: blue; box-shadow: rgba(62, 66, 66, 0.22) 0px 10px 39px 10px;"
  )
})
