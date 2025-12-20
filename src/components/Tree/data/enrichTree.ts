import { IdObj, Node } from "../types";
import { isFunction, access } from "../utils";

export function enrichTree<T extends IdObj>(
  data: T,
  hideRoot: boolean | undefined,
  getChildren: string | ((d: T) => T[]) | undefined,
  isOpen: string | ((d: T) => boolean) | undefined,
  disableDrag: string | boolean | ((d: T) => boolean) | undefined,
  disableDrop: string | boolean | ((d: T) => boolean) | undefined,
  openByDefault: boolean | undefined
): Node<T> {
  const children = getChildren
    ? isFunction(getChildren)
      ? getChildren(data)
      : access(data, getChildren)
    : null;

  const checkIsOpen = (d: T): boolean => {
    if (isOpen === undefined) return openByDefault || false;
    return isFunction(isOpen) ? isOpen(d) : access(d, isOpen);
  };

  const checkDraggable = (d: T): boolean => {
    if (disableDrag === undefined) return true;
    if (typeof disableDrag === "boolean") return !disableDrag;
    return isFunction(disableDrag) ? !disableDrag(d) : !access(d, disableDrag);
  };

  const checkDroppable = (d: T): boolean => {
    if (disableDrop === undefined) return true;
    if (typeof disableDrop === "boolean") return !disableDrop;
    return isFunction(disableDrop) ? !disableDrop(d) : !access(d, disableDrop);
  };

  function build(
    model: T,
    parent: Node<T> | null,
    level: number,
    rowIndex: number
  ): { node: Node<T>; nextIndex: number } {
    const childrenData = getChildren
      ? isFunction(getChildren)
        ? getChildren(model)
        : access(model, getChildren)
      : null;

    const node: Node<T> = {
      id: model.id,
      model,
      level,
      parent,
      children: null,
      isOpen: checkIsOpen(model),
      isDraggable: checkDraggable(model),
      isDroppable: checkDroppable(model),
      rowIndex: hideRoot && level === 0 ? null : rowIndex
    };

    let currentIndex = rowIndex;

    if (childrenData && Array.isArray(childrenData)) {
      const childNodes: Node<T>[] = [];
      const isNodeOpen = node.isOpen;

      for (const childModel of childrenData) {
        if (isNodeOpen) {
          currentIndex++;
        }
        const result = build(childModel, node, level + 1, currentIndex);
        childNodes.push(result.node);
        currentIndex = result.nextIndex;
      }

      node.children = childNodes;
    }

    return { node, nextIndex: currentIndex };
  }

  const { node } = build(data, null, 0, 0);
  return node;
}
