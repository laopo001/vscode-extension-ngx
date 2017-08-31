'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path'
import { createService } from './ts_server';
// const unicod = require('./unicode.ts').Unicodes;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "angular-template" is now active!');
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    // const selectors = ['html', 'php', 'twig', 'jsp', 'htm'];

    // unicod().readJSONFile().then((resolve: Promise<vscode.CompletionItem[]>) => {
    //     const completionItem = {
    //         provideCompletionItems: () => resolve
    //     }

    //     let action = vscode.languages.registerCompletionItemProvider(selectors, completionItem, '&')
    //     context.subscriptions.push(disposable,action);
    // });
    let action = vscode.languages.registerCompletionItemProvider(['html', 'ngx'], {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
            // console.log(document, position, token)
            let path_obj = path.parse(document.fileName);
            let service = createService(path_obj.dir, { module: ts.ModuleKind.CommonJS });

            let fileName = path_obj.name + '.ts'

            let getSourceFile = service.getProgram().getSourceFile(fileName);


            let getNavigateToItems = service.getNavigateToItems('lastScrollLeft', 10000, fileName);
            getNavigateToItems.forEach((x) => {
                let getQuickInfoAtPosition = service.getQuickInfoAtPosition(fileName, x.textSpan.start);
                debugger
                console.log(getQuickInfoAtPosition)
            })
            let getNavigationBarItemss = service.getNavigationBarItems(fileName);

            // console.log(getTypeDefinitionAtPosition)
            // let items: Promise<vscode.CompletionItem[]>;
            let items: vscode.CompletionItem[] = [];
            let ci = new vscode.CompletionItem('cs', 0)
            ci.detail = 'test';
            service.dispose()
            return Promise.resolve(items);
        }
    }, '.')
    context.subscriptions.push(disposable, action);
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log('exit')
}