import * as vscode from 'vscode';

const app: string = require('../package.json').name;

// The list of file extensions
type ExtensionList = {
    [Type in FileTypes]: string[];
};

// Whether a setting is enabled
type EnabledList = {
    [Type in FileTypes]: boolean;
};

type LocationList = {
	[Type in FileTypes]: vscode.ViewColumn;
};

// The types of files to be opened in split view
enum FileTypes
{
    TEMPLATE = 'template',
    SCRIPT = 'script',
    STYLE = 'style',
    SPEC = 'spec',
}

// The top level setting names
enum Settings
{
    EXTENSIONS = 'files',
	ENABLED = 'enable',
	LOCATIONS = 'locations'
}

interface SettingsList
{
    /**
     * The file extensions set by the user
     *
     * @type {ExtensionList}
     * @memberof SettingsList
     */
    extensions: ExtensionList;

    /**
     * The enabled status of each file type set by the user
     *
     * @type {EnabledList}
     * @memberof SettingsList
     */
	enabled: EnabledList;
	
	/**
	 * The location the file should be opened in
	 */
	locations: LocationList;

    [key: string]: any;
}

// The cache of the user settings
let UserSettings: SettingsList;

// Whether we have done first execution
let init: boolean = false;

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
        vscode.commands.registerCommand(`${app}.execute`, execute),
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

function updateConfiguration(): void
{
    init = true;

    UserSettings = {
        extensions: getConfiguration<ExtensionList>(Settings.EXTENSIONS),
		enabled: getConfiguration<EnabledList>(Settings.ENABLED),
		locations: getConfiguration<LocationList>(Settings.LOCATIONS)
    };
}

/**
 * Execute the split action
 *
 * @returns {void}
 */
function execute(): void
{
    // Do nothing if there is no workspace
    if(!vscode.workspace) { return; }

    // Do nothing if there is no active text editor
    const editor = vscode.window.activeTextEditor;
    if(!editor) { return; }

    // Get the current file and strip its file extension
    const extensionlessFileName = getExtensionlessFileName(editor.document.fileName);

    const extensionList = UserSettings.extensions;

    // Go through each extension list and try and open a file for it
    const keys = Object.keys(extensionList) as FileTypes[];
    for(let i = 0; i < keys.length; i++)
    {
        const key = keys[i];

        // Don't include the file if the user has it disabled
        if(!UserSettings.enabled[key]) { continue; }

        if(extensionList[key])
        {
            const extensions = extensionList[key];

			if(extensions.length <= 0) { continue; }
			
			const viewColumn =UserSettings.locations[key] || vscode.ViewColumn.Beside;
			

            // Run the open file generator function to go through each extension in the corresponding list
            next(openFileGen(extensionlessFileName, extensions, viewColumn));
        }
    }
}

/**
 * Gets configuration value
 *
 * @template T The type of the returned value
 * @param {Settings} name The name of the configuration (after `<extension-name>.`). Can only go 1 level deep
 * @param {boolean} force Whether to force reading directly from the settings instead of the cached value
 * @returns {T} The configuration value
 */
function getConfiguration<T>(name: Settings): T
{
    return vscode.workspace.getConfiguration(app).get<T>(name) as T;
}

/**
 * Takes a path and strips the file extension from it
 *
 * @param {string} path The path to the file
 * @returns {string} The stripped path
 */
function getExtensionlessFileName(path: string): string
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

/**
 * The function that recursively iterates over a extension list generator function to try and open the file
 *
 * @param {*} gen The result of calling `openFileGen(...)`
 * @returns {void}
 */
function next(gen: any): void
{
    // Get the next extension in the lists open result
    const doc = gen.next();

    // If we have finished iterating, return
    if(doc.done) { return; }

    // If we have a value, then we're done...
    doc.value.then(() =>
    {
        return;
    }, (err: any) =>
        {
            // ... otherwise continue with the next extension
            next(gen);
        }
    );
}

/**
 * **Should not be used directly, except by the `openFileGen` function**
 * 
 * Tries to open a file in the editor in split view next to the current document
 *
 * @param {string} path The path to try and open
 * @returns {Promise<vscode.TextDocument>} The instance of the document opened
 */
function openFile(path: string, viewColumn: vscode.ViewColumn): Promise<vscode.TextDocument>
{
    return new Promise((resolve, reject) =>
    {
        // Get the current text editors
        const textEditors = vscode.window.visibleTextEditors;

        let opened = false;

        // Go through each current text editors and see if the file we want to open already exists
        for(let i = 0; i < textEditors.length; i++)
        {
            const textEditor = textEditors[i];

            if(textEditor.document.fileName === path)
            {
                opened = true;
                break;
            }
        }

        // If the file isn't already open then open it
        if(!opened)
        {
            // Open the document...
            vscode.workspace.openTextDocument(path,).then((doc) =>
            {
                // ... then show it beside the current one
                vscode.window.showTextDocument(doc, viewColumn).then(() =>
                {
                    resolve(doc);
                }, (err) =>
                    {
                        reject(err);
                    }
                );
            }, (err) =>
                {
                    reject(err);
                }
            );
        }
    });
}

// function fileLocationToColumn(location:FileLocation){
// 	switch (location) {
// 		case FileLocation.left:
// 			vscode.window.editor
// 			break;
	
// 		default:
// 			break;
// 	}
// }

/**
 * Creates an iterable to try and open files with an array of file extensions
 *
 * @param {string} path The path of the file to try and open, minus the extension
 * @param {string[]} extensions The list of extensions to attempt to open
 * @returns {IterableIterator<Promise<vscode.TextDocument>>} The iterable to be used with the `next` function
 */
function* openFileGen(path: string, extensions: string[], viewColumn:vscode.ViewColumn): IterableIterator<Promise<vscode.TextDocument>>
{
    for(let i = 0; i < extensions.length; i++)
    {
        yield openFile(`${path}.${extensions[i]}`,viewColumn);
    }
}
