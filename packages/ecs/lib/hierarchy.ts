export class Hierarchy {
  indexToEntity: number[] = [];
  parentToChild: number[] = [];
  childToParent: number[] = [];
  addChild(parent: number, child: number) {}
  move(from: number, newParent: number) {}
  removeChild(parent: number, child: number, deep = true) {}
}
