import * as fs from "fs";
import * as ts from "typescript";
import * as path from 'path'
let services = null
export function createService(pathdir: string, options: ts.CompilerOptions): ts.LanguageService {
    // debugger
    // if (services != null) { return services; }

    let rootFileNames: string[] = fs.readdirSync(pathdir).filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts")
    const files: ts.MapLike<{ version: number }> = {};
    // initialize the list of files
    rootFileNames.forEach(fileName => {
        files[fileName] = { version: 0 };
    });

    // Create the language service host to allow the LS to communicate with the host
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

    // Create the language service files
    services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())
    return services
    // let program=services.getNavigationTree('extension.ts')
    // console.log(program);
    // Now let's watch the files
    /*     rootFileNames.forEach(fileName => {
            // First time around, emit all files
            emitFile(fileName);
    
            // Add a watch on the file to handle next change
            fs.watchFile(fileName,
                { persistent: true, interval: 250 },
                (curr, prev) => {
                    // Check timestamp
                    if (+curr.mtime <= +prev.mtime) {
                        return;
                    }
    
                    // Update the version to signal a change in the file
                    files[fileName].version++;
    
                    // write the changes to disk
                    emitFile(fileName);
                });
        });
    
        function emitFile(fileName: string) {
            let output = services.getEmitOutput(fileName);
    
            if (!output.emitSkipped) {
                console.log(`Emitting ${fileName}`);
            }
            else {
                console.log(`Emitting ${fileName} failed`);
                logErrors(fileName);
            }
    
            output.outputFiles.forEach(o => {
                fs.writeFileSync(o.name, o.text, "utf8");
            });
        }
    
        function logErrors(fileName: string) {
            let allDiagnostics = services.getCompilerOptionsDiagnostics()
                .concat(services.getSyntacticDiagnostics(fileName))
                .concat(services.getSemanticDiagnostics(fileName));
    
            allDiagnostics.forEach(diagnostic => {
                let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                if (diagnostic.file) {
                    let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                }
                else {
                    console.log(`  Error: ${message}`);
                }
            });
        } */
}

// Initialize files constituting the program as all .ts files in the current directory
// const currentDirectoryFiles = fs.readdirSync(process.cwd()).
//     filter(fileName=> fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts");

// Start the watcher
// watch(currentDirectoryFiles, { module: ts.ModuleKind.CommonJS });
// export default service;