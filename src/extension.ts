'use strict';

import * as vs from 'vscode';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path'
import { createService } from './ts_server';
import { AutoHelp } from './features/AutoHelpProvider'


export function activate(context: vs.ExtensionContext) {

    console.log('start')
    let action = vs.languages.registerCompletionItemProvider(['html'], new AutoHelp(), '.')
    context.subscriptions.push(action);
}

// this method is called when your extension is deactivated
export function deactivate() {

}