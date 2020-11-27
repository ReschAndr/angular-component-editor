# Angular Component Editor

![.github/workflows/ci.yml](https://github.com/mvp-angular/angular-component-editor/workflows/.github/workflows/ci.yml/badge.svg?branch=master&event=deployment)

## Based on
This extension is based on [Angular Split](https://marketplace.visualstudio.com/items?itemName=chifilly.angular-split). All I did, was add an option to customize in which tab a filetype should be opened.

## Features

An extension that allows you to easily open the corresponding Angular Component files (template, script, stylesheet and spec files) side-by-side with a single key binding.

You can also configure which files you wish to open, as well as the file extensions to look for when attempting to split.

## Extension Settings

| Setting | Description | Default |
| --- | --- | --- |
| `angular-component-editor.enable.template` | Whether template file should be included when split viewing the component files | `true` |
| `angular-component-editor.enable.script` | Whether script file should be included when split viewing the component files | `true` |
| `angular-component-editor.enable.style` | Whether stylesheet file should be included when split viewing the component files | `true` |
| `angular-component-editor.enable.spec` | Whether spec file should be included when split viewing the component files | `false` |
| `angular-component-editor.files.template` | The list of file extensions to try and open for the component template | `["html"]` |
| `angular-component-editor.files.script` | The list of file extensions to try and open for the component script | `["ts"]` |
| `angular-component-editor.files.style` | The list of file extensions to try and open for the component stylesheet | `["css", "scss", "sass", "less"]` |
| `angular-component-editor.files.spec` | The list of file extensions to try and open for the component specification | `["spec.ts"]` |
| `angular-component-editor.template` | In which tab the file should be opended (available options: see [ViewColumn](###ViewColumn)) | `-2`|
| `angular-component-editor.script` | In which tab the file should be opended (available options: see [ViewColumn](###ViewColumn)) | `-2`|
| `angular-component-editor.style` | In which tab the file should be opended (available options: see [ViewColumn](###ViewColumn)) | `-2`|
| `angular-component-editor.spec` | In which tab the file should be opended (available options: see [ViewColumn](###ViewColumn)) | `-2`|


### ViewColumn
[Official Documentation from VS-Code](https://code.visualstudio.com/api/references/vscode-api#ViewColumn)
```typescript
enum ViewColumn{
    /**
     * A *symbolic* editor column representing the currently active column. This value
     * can be used when opening editors, but the *resolved* [viewColumn](#TextEditor.viewColumn)-value
     * of editors will always be `One`, `Two`, `Three`,... or `undefined` but never `Active`.
     */
    Active = -1,
    /**
     * A *symbolic* editor column representing the column to the side of the active one. This value
     * can be used when opening editors, but the *resolved* [viewColumn](#TextEditor.viewColumn)-value
     * of editors will always be `One`, `Two`, `Three`,... or `undefined` but never `Beside`.
     */
    Beside = -2,
    /**
     * The first editor column.
     */
    One = 1,
    /**
     * The second editor column.
     */
    Two = 2,
    /**
     * The third editor column.
     */
    Three = 3,
    /**
     * The fourth editor column.
     */
    Four = 4,
    /**
     * The fifth editor column.
     */
    Five = 5,
    /**
     * The sixth editor column.
     */
    Six = 6,
    /**
     * The seventh editor column.
     */
    Seven = 7,
    /**
     * The eighth editor column.
     */
    Eight = 8,
    /**
     * The ninth editor column.
     */
    Nine = 9
}
```

## Key Bindings

| Command | Description | Binding |
| --- | --- | --- |
| `angular-component-editor.execute` | Execute the split action | `Strg + Shift + O` (`Shift + Alt + S` on Mac) |

## Known Issues

None
<br/>
<br/>
<br/>
# Planned Features

- close all files of an component with one shortcut
