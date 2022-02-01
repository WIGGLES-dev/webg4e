export function pdFoundryInstalled() {
  return "PDFoundry" in ui
}

export function openPDF(code, options) {
  if (!pdFoundryInstalled())
    ui.notifications.warn(
      "Please Install PDFoundry module in order to enable PDF support"
    )
  ui.PDFoundry.openPDFByCode(code, options)
}

export function openPDFHandler(code) {
  return function (e) {
    code = code || this.textContent
    openPDF(code)
  }
}
