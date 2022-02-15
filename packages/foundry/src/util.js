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

export function* map(cb, ...iterators) {
  for (const value of concat(iterators)) {
    yield cb(value)
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

export function addEventListeners(target, handlers) {
  const entries = Object.entries(handlers)
  for (const [event, fn] of entries) {
    target.addEventListener(event, fn)
  }
  return () => {
    for (const [event, fn] of entries) {
      target.removeEventListener(event, fn)
    }
  }
}

function snakeToCamel(key) {
  let newKey = ""
  let i = 0
  for (part of keykey.split("_")) {
    if (i++ === 0) {
      newKey += part
    } else {
      newKey += capitalize(part)
    }
  }
  return newKey
}

function camelToSnake(key) {
  let newKey = ""
  let splits = []
  let i = 0
  for (const character of key) {
    if (character === character.toUpperCase()) {
      splits.push(i)
    }
    i++
  }
}

function mapSnakeToCamel([key, value], i, entries) {
  return [snakeToCamel(key), value]
}

function mapCamelToSnake([key, value], i, entries) {
  return [camelToSnake(key), value]
}

export function keyMap(obj, cb) {
  return Object.fromEntries(Object.entries(obj).map(cb))
}

export function get(object, path) {
  if (typeof path === "string") path = path.split(".")
  let out = object
  for (const key of path) {
    if (key in out) {
      out = out[key]
    } else {
      return undefined
    }
  }
  return out
}

export function set(object, path, value) {
  if (typeof path === "string") path = path.split(".")
  const toSet = get(path.slice(0, -1))
  const key = path[path.length - 1]
  toSet[key] = value
}

export function array(...values) {
  const arr = []
  for (const value of values) {
  }
  return arr
}

export function bind() {
  return function () {}
}
