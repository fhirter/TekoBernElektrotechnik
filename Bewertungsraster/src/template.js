export const template = `
---
title: {{title}}
subtitle: {{subtitle}}
author: {{studentName}}, {{className}}
date: {{date}}
---

- Note: {{note}}
- Punkte: {{punkte}}/{{max}}
- Betreuer: {{tutor}}
- Experte: {{expert}}

{{#sections}}
## {{section}}

| Bewertungspunkt | Punkte | Kommentar |
|-----------------|--------|-----------|
{{#inputs}}
| {{label}} | {{value.punkte}}/{{value.max}} | {{value.kommentar}} |
{{/inputs}}

{{/sections}}
`
