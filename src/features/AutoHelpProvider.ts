import * as vs from 'vscode';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path'
import * as minimatch from 'minimatch';
import { createService } from '../ts_server';
export class AutoHelp implements vs.CompletionItemProvider {
    provideCompletionItems(document: vs.TextDocument, position: vs.Position, token: vs.CancellationToken): Promise<vs.CompletionItem[]> {
        let items: vs.CompletionItem[] = [];
        console.log('------------------')
        var currentLine = document.getText(document.lineAt(position).range);
        var word = this.getWord(currentLine, position.character)
        console.log(word)
        let path_obj = path.parse(document.fileName);
        let service = createService(path_obj.dir, { module: ts.ModuleKind.CommonJS });
        let fileName = path_obj.name + '.ts'
        if (fs.existsSync(path.resolve(path_obj.dir, fileName))) {

            let source = service.getProgram().getSourceFile(fileName);
            let checker = service.getProgram().getTypeChecker();
            let index = source.text.indexOf(path_obj.base);
            if (index > 0) {
                let visit = (node: ts.Node) => {
                    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                        if (word != '') {
                            getComponentInfo(node, word.split('.').filter(x => x !== '').reverse())
                        }

                    }
                    else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
                        // This is a namespace, visit its children
                        ts.forEachChild(node, visit);
                    }
                }
                ts.forEachChild(source, visit);
            }
            function getComponentInfo(node: ts.Node, keys: string[]) {
                console.log(keys)
                
                let key = keys.pop()
                node['members'].forEach((x, index) => {

                    if (key == null) {
                        let item = new vs.CompletionItem(x.symbol.name, 0)
                        item.detail = 'type: ' + checker.typeToString(checker.getTypeOfSymbolAtLocation(x.symbol, x.symbol.valueDeclaration))
                        //       item.detail='type: '+ts.SyntaxKind[x.kind]
                        // if(x.initializer&&x.initializer.kind===ts.SyntaxKind.ObjectLiteralExpression){
                        //   debugger;
                        // }
                        if (x.initializer && x.initializer.kind === ts.SyntaxKind.StringLiteral) {
                            item.documentation = 'value: ' + x.initializer.text;
                        }
                        if (x.initializer && x.initializer.kind === ts.SyntaxKind.NumericLiteral) {
                            item.documentation = 'value: ' + x.initializer.text;
                        }
                        // if(x.initializer&&x.initializer.kind===ts.SyntaxKind.ArrayType){
                        // }
                        items.push(item)
                    } else {
                        if (x.symbol.name === key && x.initializer && x.initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
         
                            runObj(x.initializer.symbol.members, keys)
                        }
                    }
                })
            }
            function runObj(keyValue:any[],keys: string[]){
                // debugger;
                items=[];
                let key = keys.pop()
                keyValue.forEach((x)=>{
                    if (key == null) {
                        let item = new vs.CompletionItem(x.name, 0)
                        item.detail = 'type: ' + checker.typeToString(checker.getTypeOfSymbolAtLocation(x.valueDeclaration.symbol, x.valueDeclaration))
                        //       item.detail='type: '+ts.SyntaxKind[x.kind]
                        // if(x.initializer&&x.initializer.kind===ts.SyntaxKind.ObjectLiteralExpression){
                        //   debugger;
                        // }
                        if (x.valueDeclaration.initializer && x.valueDeclaration.initializer.kind === ts.SyntaxKind.StringLiteral) {
                            item.documentation = 'value: ' + x.valueDeclaration.initializer.text;
                        }
                        if (x.valueDeclaration.initializer && x.valueDeclaration.initializer.kind === ts.SyntaxKind.NumericLiteral) {
                            item.documentation = 'value: ' + x.valueDeclaration.initializer.text;
                        }
                        // if(x.initializer&&x.initializer.kind===ts.SyntaxKind.ArrayType){
                        // }
                        items.push(item)
                    } else {
                        if (x.name === key && x.valueDeclaration.initializer && x.valueDeclaration.initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
         
                            runObj(x.valueDeclaration.initializer.symbol.members, keys)
                        }
                    }
                })
            }

        } else { console.log('文件不存在！') }


        // console.log(getTypeDefinitionAtPosition)
        // let ci = new vs.CompletionItem('cs', 0)
        // ci.detail = 'test';
        // items.push(ci)
        // service.dispose()
        return Promise.resolve(items);
    }
    getWord(currentLine: string, currentPosition: number): string {
        var start = -1;
        for (var i = currentPosition - 1; i >= 0; i--) {
            var c = currentLine[i];
            if (i == currentPosition - 1 && c == '.') { continue; }

            if (c == '\'' || c == '"' || c == ' ' || c == '\t') {
                start = i;
                break;
            }
        }
        if (start == -1) { return '' };
        // let end = -1;
        // for (var i = currentPosition; i <= currentLine.length; i++) {
        //     var c = currentLine[i];
        //     if (i == currentPosition && c == '.') { continue; }

        //     if (c == '\'' || c == '"' || c == ' ' || c == '\t' || c == '.') {
        //         end = i;
        //         break;
        //     }
        // }
        // if (end == -1) { return '' };
        return currentLine.substring(start + 1, currentPosition);
    }


}