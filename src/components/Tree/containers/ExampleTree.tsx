"use client"

import {
  createFileTree,
  isDir,
  isFile,
  Node,
  useDnd,
  useHotkeys,
  useObserver,
  useRovingFocus,
  useSelections,
  useTraits,
  useVirtualize
} from "exploration";
import { createStyles } from "@dash-ui/styles";
import reset from "@dash-ui/reset";
import { VscFolder, VscFolderOpened, VscFile } from "react-icons/vsc";
import * as colors from "@radix-ui/colors";
import React from "react";
import { mockFs } from "./mock-fs";

const tree = createFileTree((parent, { createFile, createDir }) =>
  Promise.resolve(
    mockFs[parent.data.name].map(
      (stat: { name: string; type: "file" | "dir" }) => {
        if (stat.type === "file") {
          return createFile({ name: stat.name });
        }

        return createDir({ name: stat.name });
      }
    )
  )
);

export default function ExampleTree() {
  const windowRef = React.useRef<HTMLDivElement | null>(null);
  const rovingFocus = useRovingFocus(tree);
  const selections = useSelections(tree);
  const traits = useTraits(tree, ["selected", "focused", "drop-target"]);
  const dnd = useDnd(tree, { windowRef });
  const virtualize = useVirtualize(tree, { windowRef, nodeHeight: 24 });
  useHotkeys(tree, { windowRef, rovingFocus, selections });

  useObserver(selections.didChange, (value) => {
    const selected = [...value];
    traits.set("selected", selected);

    if (selected.length === 1) {
      const node = tree.getById(selected[0]);

      if (node && isFile(node)) {
        console.log("Opening file:", node.data.name);
      }
    }
  });

  useObserver(rovingFocus.didChange, (value) => {
    traits.set("focused", [value]);
  });

  useObserver(dnd.didChange, (event) => {
    if (!event) return;

    if (event.type === "enter" || event.type === "expanded") {
      if (event.node.parentId === event.dir.id) {
        return traits.clear("drop-target");
      }

      const nodes = event.dir.nodes ? [...event.dir.nodes] : [];
      const nodeIds: number[] = [event.dir.id, ...nodes];
      let nodeId: number | undefined;

      while ((nodeId = nodes.pop())) {
        const node = tree.getById(nodeId);

        if (node) {
          if (isDir(node) && node.nodes) {
            nodeIds.push(...node.nodes);
            nodes.push(...node.nodes);
          }
        }
      }

      traits.set("drop-target", nodeIds);
    } else if (event.type === "drop") {
      traits.clear("drop-target");
      const selected = new Set(selections.narrow());

      if (
        event.node === event.dir ||
        (selected.has(event.node.id) && selected.has(event.dir.id))
      ) {
        return;
      }

      if (selected.has(event.node.id)) {
        const moveSelections = async () => {
          if (!tree.isVisible(event.dir)) {
            await tree.expand(event.dir);
          }

          const promises: Promise<void>[] = [];

          for (const id of selected) {
            const node = tree.getById(id);

            if (node) {
              promises.push(tree.move(node, event.dir));
            }
          }

          await Promise.all(promises);
        };

        moveSelections();
        selections.clear();
      } else {
        tree.move(event.node, event.dir);
      }
    } else if (event.type === "end") {
      traits.clear("drop-target");
    }
  });

  const plugins = [traits, rovingFocus, selections, dnd];

  return (
    <main className={styles.theme("dark")}>
      <div ref={windowRef} className={explorerStyles()}>
        <div {...virtualize.props}>
          {virtualize.map((props) => {
            return (
              <Node plugins={plugins} {...props}>
                {isDir(props.node) ? (
                  props.node.expanded ? (
                    <VscFolderOpened />
                  ) : (
                    <VscFolder />
                  )
                ) : (
                  <VscFile />
                )}

                <span>{props.node.basename}</span>
              </Node>
            );
          })}
        </div>
      </div>
    </main>
  );
}

const styles = createStyles({
  themes: {
    light: {
      colors: {
        ...colors,
        textColor: colors.slate.slate12,
        bgColor: colors.blue.blue1,

        selected: {
          textColor: colors.blue.blue11
        },

        focused: {
          bgColor: colors.blue.blue3,
          borderColor: colors.blue.blue11
        },

        dropTarget: {
          bgColor: colors.blue.blue4
        }
      }
    },
    dark: {
      colors: {
        ...colors,
        textColor: colors.slate.slate2,
        bgColor: colors.slate.slate12,

        selected: {
          textColor: colors.blue.blue9
        },

        focused: {
          bgColor: colors.blackA.blackA10,
          borderColor: colors.blue.blue9
        },

        dropTarget: {
          bgColor: colors.whiteA.whiteA5
        }
      }
    }
  }
});

const explorerStyles = styles.one((t) => ({
  background: t.colors.bgColor,
  color: t.colors.textColor,
  height: "100vh",
  width: "100%",
  overflow: "auto",

  ...[...Array(20).keys()].reduce((acc, depth) => {
    acc[`[data-exploration-depth="${depth}"]`] = {
      display: "flex",
      gap: "0.3333em",
      alignItems: "center",
      width: "100%",
      paddingLeft: `${depth}rem`,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "transparent",
      "*:last-child": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    };

    return acc;
  }, {} as Style),

  svg: {
    opacity: 0.5
  },

  '[data-exploration-type="dir"] svg': {
    opacity: 1,
    color: t.colors.amberDark.amber9
  },

  ".selected": {
    color: t.colors.selected.textColor
  },

  ".focused": {
    borderColor: t.colors.focused.borderColor,
    backgroundColor: t.colors.focused.bgColor,
    outline: "none"
  },

  ".drop-target": {
    backgroundColor: t.colors.dropTarget.bgColor
  }
}));

styles.insertGlobal(reset);
styles.insertGlobal({
  "html,body": {
    height: "100vh"
  },

  body: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 13 / 16 + "rem"
  }
});

type Style = { [key: string]: React.CSSProperties | Style };
