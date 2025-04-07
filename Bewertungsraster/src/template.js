export const template = `
# {{title}} {{name}} 

- Note: {{note}}
- Punkte: {{punkte}}/{{max}}

{{#sections}}
## {{section}}

| Bewertungspunkt | Punkte | Kommentar |
|-----------------|--------|-----------|
{{#inputs}}
| {{label}} | {{value.punkte}} | {{value.kommentar}} |
{{/inputs}}

{{/sections}}
`
