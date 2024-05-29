import { NamingHelper, CSSHelper } from "@supernovaio/export-helpers"
import { Token, TokenGroup, TokenType } from "@supernovaio/sdk-exporters"
import { exportConfiguration } from ".."

export function convertedToken(token: Token, mappedTokens: Map<string, Token>, tokenGroups: Array<TokenGroup>): string {
  // First creating the name of the token, using helper function which turns any token name / path into a valid variable name
  const name = tokenVariableName(token, tokenGroups)

  // Then creating the value of the token, using another helper function
  let value: string | number = CSSHelper.tokenToCSS(token, mappedTokens, {
    allowReferences: exportConfiguration.useReferences,
    decimals: exportConfiguration.colorPrecision,
    colorFormat: exportConfiguration.colorFormat,
    tokenToVariableRef: (t) => {
      return `var(--${tokenVariableName(t, tokenGroups)})`
    },
  })
  
 if (token.tokenType.toLowerCase().indexOf(TokenType.fontWeight.toLowerCase()) > -1){
    value = Number.isNaN(parseFloat(value)) ? value : Number(value) 
    if(!Number.isNaN(value) ){
      value = Number(value) ;
    }
 }
 
  const indentString = " ".repeat(exportConfiguration.indent)

  if (exportConfiguration.showDescriptions && token.description) {
    // Generate token with comments
    return `${indentString}/* ${token.description.trim()} */\n${indentString}--${name}: ${value};`
  } else {
    // Generate tokens without comments
    return `${indentString}--${name}: ${value};`
  }
}

function tokenVariableName(token: Token, tokenGroups: Array<TokenGroup>): string {
  const prefix = exportConfiguration.tokenPrefixes[token.tokenType]
  const parent = tokenGroups.find((group) => group.id === token.parentGroupId)! 
  return NamingHelper.codeSafeVariableNameForToken(token, exportConfiguration.tokenNameStyle, parent, prefix)
}
