import * as vscode from 'vscode';
import { load, Type } from 'js-yaml';
import { readFile } from "fs/promises";

type ResourceYaml = {
    resource: string;
    iams: string[];
};

/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private regex: RegExp;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;
    private yaml: ResourceYaml[] = [];

    constructor() {
        this.regex = /resource\s"(.*)"\s"(.*)"/g;

        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
        this.loadResourceIams("terraIams.yaml")
                .then((val) => this.yaml = val);
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {

        if (vscode.workspace.getConfiguration("needed-iam").get("enableCodeLens", true)) {
            this.codeLenses = [];
            const regex = new RegExp(this.regex);
            const text = document.getText();
            let matches;

                    while ((matches = regex.exec(text)) !== null) {
                        const line = document.lineAt(document.positionAt(matches.index).line);
                        const indexOf = line.text.indexOf(matches[0]);
                        const position = new vscode.Position(line.lineNumber, indexOf);
                        const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
                        if (range) {
                            let iams = this.parseIams(matches[1], this.yaml);
                            let command = {
                                title: "Needed IAM roles: " + iams.toString(),
                                tooltip: "IAM role to be granted to terraform for " + matches[1],
                                command: "needed-iam.codelensAction",
                                arguments: iams,
                            };
                            this.codeLenses.push(new vscode.CodeLens(range, command));
                        }
                    }
                    return this.codeLenses;
               
        }
        console.log("got it "+this.codeLenses);
        return [];
    }

    public resolveCodeLens(codeLens: vscode.CodeLens) {
        if (vscode.workspace.getConfiguration("needed-iam").get("enableCodeLens", true)) {
            return codeLens;
        }
        return null;
    }

    private async loadResourceIams(fileName: string) {
        const yaml = load(await readFile(fileName, "utf8")) as ResourceYaml[];
        return yaml;
    }

    private parseIams(resource: string, yaml: ResourceYaml[]): string[] {
        for (let entry of yaml) {
            if (entry.resource === resource) {
                return entry.iams;
            }
        }
        return [];
    }
}

