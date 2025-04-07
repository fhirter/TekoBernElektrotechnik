export const template = `
# {{title}} {{name}} 

- Note: {{note}}
- Punkte: {{punkte}}/{{max}}

{{#sections}}
## {{section}}

{{#inputs}}
| Bewertungspunkt | Punkte | Kommentar |
|-----------------|--------|-----------|
| {{label}} | {{value.punkte}} | {{value.kommentar}} |

{{/inputs}}

{{/sections}}
`
