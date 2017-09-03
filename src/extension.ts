'use strict';

import * as vs from 'vscode';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path'
import { createService } from './ts_server';
import { AutoHelp } from './features/AutoHelpProvider'


export function activate(context: vs.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    /*     console.log('Congratulations, your extension "angular-template" is now active!');
        let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage('Hello World!');
        }); */


    let action = vs.languages.registerCompletionItemProvider(['html'], new AutoHelp(), '.')
    context.subscriptions.push(action);
}

// this method is called when your extension is deactivated
export function deactivate() {

}