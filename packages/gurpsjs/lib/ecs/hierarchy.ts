export interface Parent {
    children: number
    firstChild: string
}
export interface Child {
    parent: string
    prev: string
    next: string
}
export class Hierarchy {
    parents: Record<string, Parent> = {};
    children: Record<string, Child> = {};
    deleteParent(id: string) {
        delete this.parents[id];
    }
    deleteChild(id: string) {
        delete this.children[id];
    }
    attach(id: string, parent: string) {
        const p = this.parents[parent];
        if (p) {
            p.children++;
            let prev = this.children[p.firstChild].prev;
            let next = p.firstChild;
            const nextSibling = this.children[next];
            nextSibling.next = id;
            nextSibling.prev = id;
            this.children[id] = {
                parent,
                prev,
                next
            }
        } else {
            this.children[id] = {
                parent,
                prev: id,
                next: id
            }
            this.parents[parent] = {
                children: 1,
                firstChild: id
            }
        }
    }
    detach(id: string) {
        const c = this.children[id];
        if (c) {
            const p = this.parents[c.parent];
            p.children--;
            if (p.children == 0) {
                this.deleteParent(c.parent);
            } else {
                if (p.firstChild == id) {
                    p.firstChild = c.next;
                }
                this.children[c.prev].next = c.next;
                this.children[c.next].prev = c.prev;
            }
        }
    }
    remove(id: string) {
        this.detach(id);
        for (const child of this.getChildren(id)) {
            this.detach(child);
        }
        this.deleteChild(id);
    }
    getChildren(id: string): string[] {
        const p = this.parents[id];
        if (!p) return [];
        let cursor = p.firstChild;
        let c = this.children[p.firstChild];
        return new Array(p.children).reduce((acc, cur, i) => {
            const rv = [...acc, cursor];
            cursor = c.next;
            c = this.children[cursor];
            return rv;
        }, [] as string[])
    }
    ancestors(id: string): string[] {
        let ancestors: string[] = [];
        const c = this.children[id];
        if (c) {
            const p = this.parents[c.parent];
            if (p) {
                ancestors = [...ancestors, c.parent, ...this.ancestors(c.parent)]
            }
        }
        return ancestors;
    }
    descendants(id: string): string[] {
        let descendants: string[] = [];
        for (const child of this.getChildren(id)) {
            descendants = [...descendants, child, ...this.descendants(child)]
        }
        return descendants
    }
}
