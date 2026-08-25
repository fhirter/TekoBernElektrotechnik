export const template = `
---
title: {{title}}
subtitle: {{subtitle}}
author: {{name}}, {{className}}
date: {{date}}
---

- Note: {{note}}
- Punkte: {{punkte}}/{{max}}
- Betreuer:in: {{tutor}}
- Expert:in: {{expert}}

{{#sections}}
## {{section}}

| Bewertungspunkt | Punkte | Kommentar |
|-----------------|--------|-----------|
{{#inputs}}
| {{label}} | {{value.punkte}}/{{value.max}} | {{value.kommentar}} |
{{/inputs}}

{{/sections}}
`
