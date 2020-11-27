import * as vscode from 'vscode';

// The list of file extensions
export type ExtensionList = {
    [Type in FileTypes]: string[];
};

// Whether a setting is enabled
export type EnabledList = {
    [Type in FileTypes]: boolean;
};

export type LocationList = {
	[Type in FileTypes]: vscode.ViewColumn;
};

// The types of files to be opened in split view
export enum FileTypes
{
    TEMPLATE = 'template',
    SCRIPT = 'script',
    STYLE = 'style',
    SPEC = 'spec',
}

// The top level setting names
export enum Settings
{
    EXTENSIONS = 'files',
	ENABLED = 'enable',
    LOCATIONS = 'locations',
    SAVEONDOCUMENTCLOSE = 'saveOnDocumentClose'
}

export interface SettingsList
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
    
    saveOnDocumentClose: boolean;

    [key: string]: any;
}

