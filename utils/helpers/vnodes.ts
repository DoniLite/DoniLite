import { type VNode, Comment, Fragment, Text } from 'vue'

/**
 * Checks if a VNode is considered empty/non-visible.
 * A VNode is empty if it's a Comment, an empty Text node, or a Fragment.
 * For Fragment nodes, the behavior depends on the `recursiveFragmentCheck` parameter.
 * @param vnode The VNode to check.
 * @param recursiveFragmentCheck If true (defaults to false), for a Fragment node,
 * this function will recursively check if all its children are also empty.
 * If false, a Fragment node with any children is considered non-empty by this check,
 * without inspecting the children further with this function.
 * @returns True if the VNode is empty, false otherwise.
 */
export function isVNodeEmpty(vnode: VNode, recursiveFragmentCheck: boolean = false): boolean {
  if (!vnode) {
    return true
  }
  if (vnode.type === Comment) {
    return true
  }
  if (vnode.type === Text) {
    return (vnode.children as string)?.trim() === ''
  }
  if (vnode.type === Fragment) {
    const children = vnode.children as VNode[] | undefined
    if (!children || children.length === 0) {
      return true
    }
    if (recursiveFragmentCheck) {
      return children.every((child) => isVNodeEmpty(child, true))
    } else {
      return false
    }
  }
  return false
}
