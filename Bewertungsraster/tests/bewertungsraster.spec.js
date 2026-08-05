// @ts-check
import {test, expect} from '@playwright/test';
import {fields} from "../src/fields.js";

const url = 'http://localhost:5173/TekoBernElektrotechnik/';


const nameLabel = 'Vorname Nachname';
const addButton = 'Hinzufügen';
const selectPerson = 'Person auswählen';

test('add students', async ({page}) => {
    await page.goto(url);


    const addButtonElement = page.getByRole('button', { name: addButton });
    const nameInput = page.getByRole('textbox', { name: nameLabel });
    const selectPersonInput = page.getByLabel(selectPerson);

    // add two students
    await nameInput.fill('John Doe');
    await addButtonElement.click();
    await nameInput.fill('Jane Doe');
    await addButtonElement.click();

    await expect(page.getByRole('heading')).toContainText('Bewertungsraster TEL Jane Doe');

    await selectPersonInput.selectOption('John Doe');
    await expect(page.getByRole('heading')).toContainText('Bewertungsraster TEL John Doe');

    await page.reload();
    await selectPersonInput.selectOption('Jane Doe');
    await expect(page.getByRole('heading')).toContainText('Bewertungsraster TEL Jane Doe');
});

test('fill bewertungsraster', async ({page}) => {
    await page.goto(url);
    const name = 'Jane Doe';
    await page.getByRole('textbox', {name: nameLabel}).fill(name);
    await page.getByRole('button', {name: addButton}).click();
    await page.getByLabel(selectPerson).selectOption(name);

    for (const field of fields) {
        for (const input of field.inputs) {
              await page
                  .getByLabel(`${input.label} (0/${input.max})`,  {exact: true})
                  .selectOption('tadellos');

              await page.locator(`[id="${field.label}-${input.label}-kommentar"]`).fill('test');
        }
    }

    await expect(page.getByRole('list')).toContainText('Note: 6');
    await expect(page.getByRole('list')).toContainText('Punkte: 195/180');
});
test('fill heading', async ({page}) => {
    const name = 'Jack Doe';
    await page.goto(url);
    await page.getByRole('textbox', {name: nameLabel}).fill(name);
    await page.getByRole('button', {name: addButton}).click();

    await page.getByLabel('Name').fill('Jane Doe')
    await page.getByLabel('Klasse').fill('B-TEL-24-Ta')
    await page.getByLabel('Betreuer:in').fill('Peter')
    await page.getByLabel('Expert:in').fill('Karin')
});

