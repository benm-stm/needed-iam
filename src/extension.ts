// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window, tasks } from 'vscode';
import { CodelensProvider } from './CodelensProvider';
import { IamProvider } from './NeededIamView';

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
		//new NeededIam(context, args);
	});
	
	//new NeededIam(context, []);
	const iamsProvider = new IamProvider(context, ["test1", "testkk"]);
	window.registerTreeDataProvider('needed-iam', iamsProvider);
/*
	commands.registerCommand('taskOutline.executeTask', task => {
		tasks.executeTask(task).then(function (value) {
			return value;
		}, function(e) {
			console.error('Error');
		});
	});*/
}



// this method is called when your extension is deactivated
export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}
