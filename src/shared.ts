import * as vscode from 'vscode';
import { EnabledList, ExtensionList, LocationList, Settings, SettingsList } from './types';

// The cache of the user settings
export let UserSettings: SettingsList;

// Whether we have done first execution
export let init: boolean = false;

export const app: string = require('../package.json').name;

/**
 * Gets configuration value
 *
 * @template T The type of the returned value
 * @param {Settings} name The name of the configuration (after `<extension-name>.`). Can only go 1 level deep
 * @param {boolean} force Whether to force reading directly from the settings instead of the cached value
 * @returns {T} The configuration value
 */
export function getConfiguration<T>(name: Settings): T
{
    return vscode.workspace.getConfiguration(app).get<T>(name) as T;
}


/**
 * Takes a path and strips the file extension from it
 *
 * @param {string} path The path to the file
 * @returns {string} The stripped path
 */
export function getExtensionlessFileName(path: string): string
{
    // Split the path on . and remove the last item (the file extension)
    let split = path.split('.');
    split.pop();

    // If we have a longer split, check if it's a spec file and pop again if so
    if(split.length > 1)
    {
        if(split[split.length - 1] === 'spec')
        {
            split.pop();
        }
    }

    // Join the path up again with . and return it
    return split.join('.');
}

export function updateConfiguration(): void
{
    init = true;

    UserSettings = {
        extensions: getConfiguration<ExtensionList>(Settings.EXTENSIONS),
		enabled: getConfiguration<EnabledList>(Settings.ENABLED),
        locations: getConfiguration<LocationList>(Settings.LOCATIONS),
        saveOnDocumentClose: getConfiguration<boolean>(Settings.SAVEONDOCUMENTCLOSE)
    };
}

/**
 * The function that recursively iterates over a extension list generator function to try and open the file
 *
 * @param {*} gen The result of calling `openFileGen(...)`
 * @returns {void}
 */
export function next(gen: any): void
{
    // Get the next extension in the lists open result
    const doc = gen.next();

    // If we have finished iterating, return
    if(doc.done) { return; }

    // If we have a value, then we're done...
    doc.value.then(() =>
    {
        return;
    }, () =>
        {
            // ... otherwise continue with the next extension
            next(gen);
        }
    );
}
