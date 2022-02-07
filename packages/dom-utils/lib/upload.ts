export const upload = async () => {
  return new Promise<FileList>((resolve, reject) => {
    Object.assign(document.createElement("input"), {
      type: "file",
      async onchange(this: HTMLInputElement) {
        if (this.files) {
          resolve(this.files)
        }
      },
    }).click()
  })
}
