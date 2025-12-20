import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface SearchAndReplaceOptions {
  searchResultClass: string;
  caseSensitive: boolean;
  disableRegex: boolean;
}

export interface SearchAndReplaceStorage {
  searchTerm: string;
  replaceTerm: string;
  results: Array<{ from: number; to: number }>;
  currentIndex: number;
  caseSensitive: boolean;
  disableRegex: boolean;
}

export const SearchAndReplace = Extension.create<SearchAndReplaceOptions, SearchAndReplaceStorage>({
  name: 'searchAndReplace',

  addOptions() {
    return {
      searchResultClass: 'search-result',
      caseSensitive: false,
      disableRegex: true,
    };
  },

  addStorage() {
    return {
      searchTerm: '',
      replaceTerm: '',
      results: [],
      currentIndex: -1,
      caseSensitive: this.options.caseSensitive,
      disableRegex: this.options.disableRegex,
    };
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.searchTerm = searchTerm;
          editor.storage.searchAndReplace.currentIndex = -1;
          return true;
        },
      setReplaceTerm:
        (replaceTerm: string) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.replaceTerm = replaceTerm;
          return true;
        },
      setCaseSensitive:
        (caseSensitive: boolean) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.caseSensitive = caseSensitive;
          editor.storage.searchAndReplace.currentIndex = -1;
          return true;
        },
      goToNextSearchResult:
        () =>
        ({ editor }) => {
          const { results, currentIndex } = editor.storage.searchAndReplace;
          if (results.length === 0) return false;

          const nextIndex = (currentIndex + 1) % results.length;
          editor.storage.searchAndReplace.currentIndex = nextIndex;

          const result = results[nextIndex];
          if (result) {
            editor.commands.setTextSelection({ from: result.from, to: result.to });
            editor.commands.scrollIntoView();
          }
          return true;
        },
      goToPreviousSearchResult:
        () =>
        ({ editor }) => {
          const { results, currentIndex } = editor.storage.searchAndReplace;
          if (results.length === 0) return false;

          const prevIndex = currentIndex <= 0 ? results.length - 1 : currentIndex - 1;
          editor.storage.searchAndReplace.currentIndex = prevIndex;

          const result = results[prevIndex];
          if (result) {
            editor.commands.setTextSelection({ from: result.from, to: result.to });
            editor.commands.scrollIntoView();
          }
          return true;
        },
      replace:
        () =>
        ({ editor, state }) => {
          const { results, currentIndex, replaceTerm } = editor.storage.searchAndReplace;
          if (results.length === 0 || currentIndex < 0) return false;

          const result = results[currentIndex];
          if (!result) return false;

          const { from, to } = result;
          editor.chain().focus().insertContentAt({ from, to }, replaceTerm).run();

          // Move to next result after replacement
          editor.commands.goToNextSearchResult();
          return true;
        },
      replaceAll:
        () =>
        ({ editor, tr }) => {
          const { results, replaceTerm } = editor.storage.searchAndReplace;
          if (results.length === 0) return false;

          // Replace from end to start to maintain positions
          const sortedResults = [...results].sort((a, b) => b.from - a.from);

          sortedResults.forEach((result) => {
            editor.chain().focus().insertContentAt({ from: result.from, to: result.to }, replaceTerm).run();
          });

          // Clear search after replacing all
          editor.storage.searchAndReplace.searchTerm = '';
          editor.storage.searchAndReplace.currentIndex = -1;
          return true;
        },
      clearSearch:
        () =>
        ({ editor }) => {
          editor.storage.searchAndReplace.searchTerm = '';
          editor.storage.searchAndReplace.replaceTerm = '';
          editor.storage.searchAndReplace.currentIndex = -1;
          editor.storage.searchAndReplace.results = [];
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const extensionThis = this;

    return [
      new Plugin({
        key: new PluginKey('searchAndReplace'),
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldDecorationSet, oldState, newState) {
            const { searchTerm, caseSensitive, disableRegex } = extensionThis.storage;

            if (!searchTerm) {
              extensionThis.storage.results = [];
              return DecorationSet.empty;
            }

            const decorations: Decoration[] = [];
            const results: Array<{ from: number; to: number }> = [];

            // Create regex for searching
            let searchRegex: RegExp;
            try {
              if (disableRegex) {
                const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                searchRegex = new RegExp(escapedTerm, caseSensitive ? 'g' : 'gi');
              } else {
                searchRegex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
              }
            } catch (e) {
              return DecorationSet.empty;
            }

            // Search through the document
            newState.doc.descendants((node, pos) => {
              if (node.isText && node.text) {
                let match;
                while ((match = searchRegex.exec(node.text)) !== null) {
                  const from = pos + match.index;
                  const to = from + match[0].length;

                  results.push({ from, to });

                  decorations.push(
                    Decoration.inline(from, to, {
                      class: extensionThis.options.searchResultClass,
                    })
                  );
                }
              }
            });

            extensionThis.storage.results = results;

            // If there are results and no current index, set to first
            if (results.length > 0 && extensionThis.storage.currentIndex === -1) {
              extensionThis.storage.currentIndex = 0;
            }

            // If current index is out of bounds, reset
            if (extensionThis.storage.currentIndex >= results.length) {
              extensionThis.storage.currentIndex = results.length > 0 ? 0 : -1;
            }

            return DecorationSet.create(newState.doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
