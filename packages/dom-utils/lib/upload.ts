export const upload = async () => {
    return new Promise<File>((resolve, reject) => {
        Object.assign(document.createElement("input"), {
            type: "file",
            async onchange(this: HTMLInputElement) {
                if (this.files) {
                    resolve(this.files[0])
                }
            },
        }).click();
    });
}