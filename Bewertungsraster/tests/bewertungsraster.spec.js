// @ts-check
import {test, expect} from '@playwright/test';
import {fields} from "../src/fields.js";

const url = 'http://localhost:5173/TekoBernElektrotechnik/';

test('add student', async ({page}) => {
    await page.goto(url);
    await page.getByRole('textbox', { name: 'Name' }).fill('John Doe');
    await page.getByRole('button', { name: 'Hinzufügen' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Jane Doe');
    await page.getByRole('button', { name: 'Hinzufügen' }).click();
    await page.getByLabel('Student auswählen').selectOption('John Doe');
    await page.getByRole('button', { name: 'Laden', exact: true}).click();
    await expect(page.getByRole('heading')).toContainText('Bewertungsraster TEL John Doe');
    await page.getByLabel('Student auswählen').selectOption('Jane Doe');
    await page.getByRole('button', { name: 'Laden', exact: true }).click();
    await expect(page.getByRole('heading')).toContainText('Bewertungsraster TEL Jane Doe');
    await page.reload();
    await page.getByLabel('Student auswählen').selectOption('Jane Doe');
    await page.getByRole('button', { name: 'Laden', exact: true }).click();
    await expect(page.getByRole('heading')).toContainText('Bewertungsraster TEL Jane Doe');
});

test('fill form', async ({page}) => {
    await page.goto(url);
    await page.getByRole('textbox', {name: 'Name'}).fill('John Doe');
    await page.getByRole('button', {name: 'Hinzufügen'}).click();
    await page.getByLabel('Student auswählen').selectOption('John Doe');
    await page.getByRole('button', { name: 'Laden', exact: true}).click();

    for (const field of fields) {
        for (const input of field.inputs) {
              await page
                  .getByLabel(`${input.label} (max. ${input.max})`,  {exact: true})
                  .selectOption('tadellos');

              await page.locator(`[id="${field.label}-${input.label}-kommentar"]`).fill('test');
        }
    }

    await expect(page.getByRole('list')).toContainText('Note: 6');
    await expect(page.getByRole('list')).toContainText('Punkte: 195/180');
});

