import * as vscode from 'vscode';

export class IamProvider implements vscode.TreeDataProvider<TreeIam> {
	
	private iams: string[] = [];

    constructor(private context: vscode.ExtensionContext, iams: string[]) {
		this.iams = iams;
    }

	public async getChildren(data?: TreeIam): Promise<TreeIam[]> {
		let treeIam: TreeIam[] = [];
		console.log(this.iams.length);
	  
		if (this.iams.length !== 0) {
		  for (var i = 0; i < this.iams.length; i++ ) {                             
			treeIam[i] = new TreeIam(this.iams[i], vscode.TreeItemCollapsibleState.None, { 
				  command: 'taskOutline.executeTask', 
				  title: "!", 
				  arguments: [this.iams[i], ]
			 });
		   }
		}
		return treeIam;
	}
  
	getTreeItem(data: TreeIam): vscode.TreeItem {
		return data;
	}

}

class TreeIam extends vscode.TreeItem {
    
    constructor(
        label: string, 
        collapsibleState: vscode.TreeItemCollapsibleState,
        command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.command = command;
    }
     
}



















/*import * as vscode from 'vscode';

export class NeededIam {

	constructor(context: vscode.ExtensionContext, data: string[]) {
		const view = vscode.window.createTreeView(
			'needed-iam',
			{
				treeDataProvider: dataProvider(data),
				showCollapseAll: true
			}
		);
		context.subscriptions.push(view);
	}
}

//const tree: string[] = ['test1', 'test2'];
const uniq: any = {};


function dataProvider(data: string[]): vscode.TreeDataProvider<{ key: string }> {
	return {
		getChildren: (element: { key: string }): { key: string }[] => {
			return getChildren(data, element ? element.key : undefined).map(key => getElem(key));
		},
		getTreeItem: (element: { key: string }): vscode.TreeItem => {
			const treeItem = getTreeItem(element.key);
			treeItem.id = element.key;
			return treeItem;
		},
		getParent: ({ }: { key: string }): { key: string } | undefined => {
			return undefined;
		}
	};
}

function getChildren(data: string[], elem: string | undefined): string[] {
	if (!elem) {
		return Object.values(data);
	}
	return [];
}

function getTreeItem(key: string): vscode.TreeItem {
	const tooltip = new vscode.MarkdownString(`$(zap) Iam for ${key}`, true);
	return {
		label: {label: key},
		tooltip,
	};
}

function getElem(key: string): { key: string } {
	if (!uniq[key]) {
		uniq[key] = new Key(key);
	}
	return uniq[key];
}

class Key {
	constructor(readonly key: string) { }
}

*/