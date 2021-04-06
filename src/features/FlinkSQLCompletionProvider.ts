import * as vscode from "vscode";
import reservedKeywords from './reservedKeywords.json';

export class FlinkSQLCompletionProvider
  implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    const range = document.getWordRangeAtPosition(position);
    const currentWord = document.getText(range);

    const keywordSuggestions = this.createKeywordsCompletion();
    const tokenSuggestions = this.createTokenCompletion(document, currentWord);

    return [...keywordSuggestions, ...tokenSuggestions];
  }

  createKeywordsCompletion = (): vscode.CompletionItem[] => {
    const {
      flinkSQLKeywords,
      flinkSQLTypes,
      flinkSQLFunctions,
      flinkSQLVariables,
      flinkSQLOperators,
    } = reservedKeywords;
    const keywordCompletions: vscode.CompletionItem[] = flinkSQLKeywords.map(
      (keyword) => ({
        label: keyword,
        kind: vscode.CompletionItemKind.Keyword,
        insertText: keyword,
      })
    );

    const dataTypeCompletions: vscode.CompletionItem[] = flinkSQLTypes.map(
      (dataType) => ({
        label: dataType,
        kind: vscode.CompletionItemKind.TypeParameter,
        insertText: dataType,
      })
    );

    // currently empty
    const variableCompletions: vscode.CompletionItem[] = flinkSQLVariables.map(
      (variableType) => ({
        label: variableType,
        kind: vscode.CompletionItemKind.Variable,
        insertText: variableType,
      })
    );

    const functionCompletions: vscode.CompletionItem[] = flinkSQLFunctions.map(
      (func) => ({
        ...func,
        kind: vscode.CompletionItemKind.Function,
        // documentation support markdown
        documentation: new vscode.MarkdownString(func.documentation),
      })
    );

    const operatorCompletions: vscode.CompletionItem[] = flinkSQLOperators.map(
      (operator) => ({
        label: operator,
        kind: vscode.CompletionItemKind.Operator,
        insertText: operator,
      })
    );

    return [
      ...keywordCompletions,
      ...dataTypeCompletions,
      ...functionCompletions,
      ...variableCompletions,
      ...operatorCompletions,
    ];
  };

  createTokenCompletion = (
    model: vscode.TextDocument,
    currentWord: string
  ): vscode.CompletionItem[] => {
    // a token refers to users' already input words
    // currently adding keyword completion will make token suggestion fail
    // see: https://github.com/microsoft/monaco-editor/issues/1850
    // solution: use custom regx to get all typed tokens and add to the suggestion list
    const tokens = this.getTokens(model.getText());
    const flinkSQLReserved = Object.entries(reservedKeywords).reduce(
      // @ts-ignore
      (result, [k, v]) => {
        return [
          ...result,
          // @ts-ignore
          ...v.map((e) => (typeof e === "string" ? e : e.label)),
        ];
      },
      []
    );
    const tokenCompletions: vscode.CompletionItem[] = tokens
      .filter(
        (token) =>
          token !== currentWord &&
          !flinkSQLReserved.includes(token.toUpperCase())
      )
      .map((t) => ({
        label: t,
        kind: vscode.CompletionItemKind.Text,
        documentation: "",
        insertText: t,
      }));
    return tokenCompletions;
  };

  getTokens = (document: string) => {
    const identifierPattern = "([a-zA-Z_]\\w*)";
    const identifier = new RegExp(identifierPattern, "g");
    const tokens = [];
    let array1;
    while ((array1 = identifier.exec(document)) !== null) {
      tokens.push(array1[0]);
    }
    return Array.from(new Set(tokens));
  };
}
