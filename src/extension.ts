import * as vscode from 'vscode';
import { close } from './close';
import { open } from './open';
import {app, init, updateConfiguration} from "./shared";



/**
 * Called when the extension is activated
 *
 * @export
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext): void
{
    // Make sure the `CONFIGURATION` variable is updated on first activation and when the user changes their settings
    if(!init) { updateConfiguration(); }
    vscode.workspace.onDidChangeConfiguration(updateConfiguration);

    // Register the commands
    context.subscriptions.push(...[
        // The command that executes the splitting action
        vscode.commands.registerCommand(`${app}.open`, open),
        vscode.commands.registerCommand(`${app}.close`, close)
    ]);
}

/**
 * Called when the extension is deactivated
 *
 * @export
 * @returns {void}
 */
export function deactivate(): void
{
    return;
}


