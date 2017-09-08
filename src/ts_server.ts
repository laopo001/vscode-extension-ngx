import * as fs from "fs";
import * as ts from "typescript";
import * as path from 'path'
let services = null
let pathdirTemp=null;
export function createService(pathdir: string, options: ts.CompilerOptions): ts.LanguageService {
    // debugger
    // if (pathdirTemp == pathdir&&services!=null) { return services; }
    pathdirTemp=pathdir;
    let rootFileNames: string[] = fs.readdirSync(pathdir).filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts")
    const files: ts.MapLike<{ version: number }> = {};
    // initialize the list of files
    rootFileNames.forEach(fileName => {
        files[fileName] = { version: 0 };
    });

    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => rootFileNames,
        getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
        getScriptSnapshot: (fileName) => {
            if (!fs.existsSync(path.resolve(pathdir, fileName))) {
                return undefined;
            }
            return ts.ScriptSnapshot.fromString(fs.readFileSync(path.resolve(pathdir, fileName)).toString());
        },
        getCurrentDirectory: () => pathdir,
        getCompilationSettings: () => options,
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
    };

    services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())
    return services
}
