import * as vscode from 'vscode';
import { getExtensionlessFileName, next, UserSettings } from './shared';
import { FileTypes } from './types';

/**
 * Execute the open action
 *
 * @returns {void}
 */
export function open(): void {
  // Do nothing if there is no workspace
  if (!vscode.workspace) {
    return;
  }

  // Do nothing if there is no active text editor
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  // Get the current file and strip its file extension
  const extensionlessFileName = getExtensionlessFileName(
    editor.document.fileName
  );

  const extensionList = UserSettings.extensions;

  // Go through each extension list and try and open a file for it
  const keys = Object.keys(extensionList) as FileTypes[];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Don't include the file if the user has it disabled
    if (!UserSettings.enabled[key]) {
      continue;
    }

    if (extensionList[key]) {
      const extensions = extensionList[key];

      if (extensions.length <= 0) {
        continue;
      }

      const viewColumn =
        UserSettings.locations[key] || vscode.ViewColumn.Beside;

      // Run the open file generator function to go through each extension in the corresponding list
      next(openFileGen(extensionlessFileName, extensions, viewColumn));
    }
  }
}

/**
 * **Should not be used directly, except by the `openFileGen` function**
 *
 * Tries to open a file in the editor in split view next to the current document
 *
 * @param {string} path The path to try and open
 * @returns {Promise<vscode.TextDocument>} The instance of the document opened
 */
function openFile(
  path: string,
  viewColumn: vscode.ViewColumn
): Promise<vscode.TextDocument> {
  return new Promise((resolve, reject) => {
    // Get the current text editors
    const textEditors = vscode.window.visibleTextEditors;

    let opened = false;

    // Go through each current text editors and see if the file we want to open already exists
    for (let i = 0; i < textEditors.length; i++) {
      const textEditor = textEditors[i];

      if (textEditor.document.fileName === path) {
        opened = true;
        break;
      }
    }

    // If the file isn't already open then open it
    if (!opened) {
      // Open the document...
      vscode.workspace.openTextDocument(path).then(
        (doc) => {
          // ... then show it beside the current one
          vscode.window.showTextDocument(doc, viewColumn).then(
            () => {
              resolve(doc);
            },
            (err) => {
              reject(err);
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
}

/**
 * Creates an iterable to try and open files with an array of file extensions
 *
 * @param {string} path The path of the file to try and open, minus the extension
 * @param {string[]} extensions The list of extensions to attempt to open
 * @returns {IterableIterator<Promise<vscode.TextDocument>>} The iterable to be used with the `next` function
 */
function* openFileGen(
  path: string,
  extensions: string[],
  viewColumn: vscode.ViewColumn
): IterableIterator<Promise<vscode.TextDocument>> {
  for (let i = 0; i < extensions.length; i++) {
    yield openFile(`${path}.${extensions[i]}`, viewColumn);
  }
}
