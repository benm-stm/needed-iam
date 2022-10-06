// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window, ViewColumn } from 'vscode';
import { CodelensProvider } from './CodelensProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
	const codelensProvider = new CodelensProvider();

	languages.registerCodeLensProvider(
		[{ scheme: 'file', pattern: '**/*.tf' }],
		codelensProvider
	);

	commands.registerCommand("needed-iam.enableCodeLens", () => {
		workspace.getConfiguration("needed-iam").update("enableCodeLens", true, true);
	});

	commands.registerCommand("needed-iam.disableCodeLens", () => {
		workspace.getConfiguration("needed-iam").update("enableCodeLens", false, true);
	});

	commands.registerCommand("needed-iam.codelensAction", (args: any) => {
		window.showInformationMessage(`Roles needed by terraform :${args}`);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
