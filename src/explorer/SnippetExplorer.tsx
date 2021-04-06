import * as vscode from 'vscode';
import * as React from 'react';
import * as path from 'path';
import ReactTreeView, { TreeItem, ExtendedTreeItem } from 'react-vsc-treeview';
import createSnippets from '../snippets/create.json';

type SnippetExplorerProps = {
  context: vscode.ExtensionContext;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const SnippetExplorer: React.FC<SnippetExplorerProps> = ({ context }) => {
  // Note: use context.extensionPath to reference resources in extension
  const baseIconPath = path.join(context.extensionPath, 'images');

  return (
    <TreeItem label="create" expanded={true} tooltip="Create Snippets">
      {Object.entries(createSnippets).map(([labelName, snippet]) => (
        <TreeItem
          tooltip={snippet.description}
          iconPath={{
            light: path.join(baseIconPath, 'file-code-light.svg'),
            dark: path.join(baseIconPath, 'file-code-dark.svg'),
          }}
          label={labelName}
          key={labelName}
          contextValue="snippet"
        />
      ))}
    </TreeItem>
  );
};

export const insertSnippet = (node: ExtendedTreeItem) => {
  const { label } = node.value;
  Object.entries(createSnippets).forEach(([labelName, snippet]) => {
    if (label === labelName) {
      const snippetString = snippet.body.join('\n');
      vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(snippetString));
    }
  });
};

export const copyToClipboard = (node: ExtendedTreeItem) => {
  const { label } = node.value;
  Object.entries(createSnippets).forEach(([labelName, snippet]) => {
    if (label === labelName) {
      const snippetString = snippet.body.join('\n');
      const formattedSnippetCode = snippetString
        .trim()
        .replace(/\${\d+:?/g, '')
        .replace(/}/g, '')
        .replace(/\t/g, Array(4).fill(' ').join(''));
      vscode.env.clipboard.writeText(formattedSnippetCode).then(() => {
        vscode.window.showInformationMessage(`Copy ${snippet.description} to clipboard successfully!`);
      });
    }
  });
};

export const renderSnippetExplorer = (context: vscode.ExtensionContext) => {
  const snippetExplorer = ReactTreeView.render(<SnippetExplorer context={context} />, 'flinksqlSnippets');
  return snippetExplorer;
};
