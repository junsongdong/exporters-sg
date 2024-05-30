import { NamingHelper, CSSHelper } from "@supernovaio/export-helpers"
import { Token, TokenGroup, TokenType } from "@supernovaio/sdk-exporters"
import { exportConfiguration } from ".."

 
export function convertedToken(token: Token, mappedTokens: Map<string, Token>, tokenGroups: Array<TokenGroup>): string {
  // First creating the name of the token, using helper function which turns any token name / path into a valid variable name
  let name = tokenVariableName(token, tokenGroups)
  if (token.tokenType === TokenType.borderWidth) {
    name = name.startsWith('border-width-') ? name.substring(12) : name
  }
    
  if (token.tokenType === TokenType.fontSize) {
    name = name.startsWith('font-size-') ? name.substring(10) : name
  }
  if (token.tokenType === TokenType.letterSpacing) {
    name = name.startsWith('letter-spacing-') ? name.substring(15) : name
  }
  if (token.tokenType === TokenType.lineHeight) {
    name = name.startsWith('line-height-') ? name.substring(12) : name
  }
  if (token.tokenType === TokenType.radius) {
    name = name.startsWith('border-radius-') ? name.substring(14) : name
  }
  if (token.tokenType === TokenType.size) {
    name = name.startsWith('sizing-') ? name.substring(7) : name
  }
  if (token.tokenType === TokenType.space) {
    name = name.startsWith('spacing-') ? name.substring(8) : name
  }

  if (token.tokenType === TokenType.fontFamily) {
    name = name.startsWith('font-family-') ? name.substring(12) : name
  }
    
  if (token.tokenType === TokenType.fontWeight) {
    name = name.startsWith('font-weight-') ? name.substring(12) : name
   }

  // Then creating the value of the token, using another helper function
  let value: string | number = CSSHelper.tokenToCSS(token, mappedTokens, {
    allowReferences: exportConfiguration.useReferences,
    decimals: exportConfiguration.colorPrecision,
    colorFormat: exportConfiguration.colorFormat,
    tokenToVariableRef: (t) => {

      let nameVal = tokenVariableName(t, tokenGroups)
      if (token.tokenType === TokenType.borderWidth) {
        nameVal = nameVal.startsWith('border-width-') ? nameVal.substring(12) : nameVal
      }
        
      if (token.tokenType === TokenType.fontSize) {
        nameVal = nameVal.startsWith('font-size-') ? nameVal.substring(10) : nameVal
      }
      if (token.tokenType === TokenType.letterSpacing) {
        nameVal = nameVal.startsWith('letter-spacing-') ? nameVal.substring(15) : nameVal
      }
      if (token.tokenType === TokenType.lineHeight) {
        nameVal = nameVal.startsWith('line-height-') ? nameVal.substring(12) : nameVal
      }
      if (token.tokenType === TokenType.radius) {
        nameVal = nameVal.startsWith('border-radius-') ? nameVal.substring(14) : nameVal
      }
      if (token.tokenType === TokenType.size) {
        nameVal = nameVal.startsWith('sizing-') ? nameVal.substring(7) : nameVal
      }
      if (token.tokenType === TokenType.space) {
        nameVal = nameVal.startsWith('spacing-') ? nameVal.substring(8) : nameVal
      }
    
      if (token.tokenType === TokenType.fontFamily) {
        nameVal = nameVal.startsWith('font-family-') ? nameVal.substring(12) : nameVal
      }
        
      if (token.tokenType === TokenType.fontWeight) {
        nameVal = nameVal.startsWith('font-weight-') ? nameVal.substring(12) : nameVal
       }
      return `var(--${nameVal})`
    },
  })
 
 if (token.tokenType === TokenType.fontWeight) {
    let candidate = +(value?.replaceAll('"', ''))
    value = Number.isNaN(candidate) ? value : candidate;
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
