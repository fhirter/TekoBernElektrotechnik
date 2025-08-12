// @ts-check
import {test, expect} from '@playwright/test';

test('add student', async ({page}) => {
    await page.goto('http://localhost:5173/TekoBernElektrotechnik/');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('John Doe');
    await page.getByRole('button', { name: 'Hinzufügen' }).click();
    await expect(page.getByRole('heading')).toContainText('Bewertungsraster TEL John Doe');
    await page.reload();

});

test('fill form', async ({page}) => {
    await page.goto('http://localhost:5173/TekoBernElektrotechnik/');
    await page.getByRole('textbox', {name: 'Name'}).fill('John Doe');
    await page.getByRole('button', {name: 'Hinzufügen'}).click();
    await page.getByRole('spinbutton', {name: 'Vollständigkeit (max. 10)'}).fill('10');
    await page.locator('[id="Abstract-Vollständigkeit-kommentar"]').fill('test');
    await page.getByRole('spinbutton', {name: 'Verständlichkeit (max. 5)', exact: true}).fill('5');
    await page.locator('[id="Abstract-Verständlichkeit-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Länge (max. 5)'}).fill('5');
    await page.locator('[id="Abstract-Länge-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Ausgangslage und'}).fill('10');
    await page.locator('[id="Einleitung-Ausgangslage und Problemstellung-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Zielsetzung (max. 10)'}).fill('10');
    await page.locator('#Einleitung-Zielsetzung-kommentar').fill('Test');
    await page.getByRole('spinbutton', {name: 'Zeitplanung (max. 5)'}).fill('5');
    await page.locator('#Einleitung-Zeitplanung-kommentar').fill('Test');
    await page.getByRole('spinbutton', {name: 'Vorgehen (max. 10)'}).fill('10');
    await page.locator('#Hauptteil-Vorgehen-kommentar').fill('Test');
    await page.getByRole('spinbutton', {name: 'Variantenentscheide (max. 10)'}).fill('10');
    await page.locator('#Hauptteil-Variantenentscheide-kommentar').fill('Test');
    await page.locator('#Hauptteil-Variantenentscheide-kommentar').press('Tab');
    await page.getByRole('spinbutton', {name: 'Ergebnisse (max. 10)', exact: true}).fill('10');
    await page.locator('#Hauptteil-Ergebnisse-kommentar').fill('Test');
    await page.getByRole('spinbutton', {name: 'Diskussion der Ergebnisse ('}).fill('10');
    await page.locator('[id="Diskussion-Diskussion der Ergebnisse-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Eigene Meinung und Reflexion'}).fill('10');
    await page.getByRole('spinbutton', {name: 'Eigene Meinung und Reflexion'}).press('Tab');
    await page.locator('[id="Diskussion-Eigene Meinung und Reflexion-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Empfehlung (max. 5)'}).fill('5');
    await page.locator('[id="Empfehlung und Ausblick-Empfehlung-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Ausblick (max. 10)'}).fill('10');
    await page.locator('[id="Empfehlung und Ausblick-Ausblick-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Quellen (max. 5)'}).fill('5');
    await page.locator('[id="Quellen und Hilfsmittel-Quellen-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Hilfsmittel (max. 5)'}).fill('5');
    await page.locator('[id="Quellen und Hilfsmittel-Hilfsmittel-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Code, Schemas, Zeichnungen ('}).fill('10');
    await page.getByRole('group', {name: 'Anhang'}).getByLabel('Kommentar').fill('Test');
    await page.getByRole('spinbutton', {name: 'Gliederung, Aufbau, Struktur'}).fill('5');
    await page.locator('[id="Bericht und Design-Gliederung, Aufbau, Struktur-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Darstellung (max. 5)'}).fill('5');
    await page.locator('[id="Bericht und Design-Darstellung-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Weekly Report (max. 5)'}).fill('5');
    await page.locator('[id="Arbeitsweise-Weekly Report-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Einhaltung der Termine (max.'}).fill('5');
    await page.locator('[id="Arbeitsweise-Einhaltung der Termine-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Inhaltliche Vollständigkeit'}).fill('5');
    await page.locator('[id="Präsentation-Inhaltliche Vollständigkeit und Verständlichkeit-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Beantwortung der Fragen (max'}).fill('10');
    await page.locator('[id="Präsentation-Beantwortung der Fragen-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Zeitverwaltung (max. 5)'}).fill('5');
    await page.locator('[id="Präsentation-Zeitverwaltung-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Inhalt und Verständlichkeit ('}).fill('5');
    await page.locator('[id="Onlinepublikation-Inhalt und Verständlichkeit-kommentar"]').fill('Test');
    await page.getByRole('spinbutton', {name: 'Ausgestaltung (max. 5)'}).fill('5');
    await page.locator('#Onlinepublikation-Ausgestaltung-kommentar').fill('Test');
    await page.getByRole('spinbutton', {name: 'Schwierigkeitsgrad (max. 15)'}).fill('0');
    await page.getByRole('group', {name: 'Bonus'}).getByLabel('Kommentar').fill('Test');
    await expect(page.getByRole('list')).toContainText('Note: 6');
    await expect(page.getByRole('list')).toContainText('Punkte: 180/180');
});

