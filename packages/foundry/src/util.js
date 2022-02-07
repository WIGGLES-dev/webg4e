export function filepicker(options) {
  return new Promise((resolve, reject) => {
    const app = new FilePicker({
      ...options,
      callback: (...args) => {
        options?.callback(...args)
        resolve(app)
      },
    })
    app.render(true)
  })
}

export async function upload() {
  return new Promise((resolve, reject) => {
    Object.assign(document.createElement("input"), {
      type: "file",
      async onchange() {
        if (this.files) {
          resolve(this.files)
        }
      },
    }).click()
  })
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function pipe(...fns) {
  return (input) => {
    let output
    for (const fn of fns) {
      output = fn(input)
      input = output
    }
    return output
  }
}

export function* concat(...iterators) {
  for (const iterator of iterators) {
    yield* iterator
  }
}

export function recursiveFlat(key = "children") {
  return function (prev, cur) {
    return [...prev, cur, ...(cur[key]?.reduce(recursiveFlat(key)) ?? [])]
  }
}

export function findKey(obj, search) {
  for (const [key, value] of Object.entries(obj)) {
    if (value === search) {
      return key
    }
  }
}
