import {describe, expect, it} from 'vitest';
import {transformBewertungsraster} from './Helpers.js';

describe('convertData', () => {
    const input = {
        'Section A': {
            'Field 1': {
                punkte: 3,
                max: 5,
                kommentar: 'line one\nline two'
            },
            'Field 2': {
                punkte: 1,
                max: 5,
                kommentar: undefined
            },
        },
    };

    const expected = [
        {
            section: 'Section A',
            inputs: [
                {
                    label: 'Field 1',
                    value: {
                        punkte: 3,
                        max: 5,
                        kommentar: 'line one<br>line two'
                    }
                },
                {
                    label: 'Field 2',
                    value: {
                        punkte: 1,
                        max: 5,
                        kommentar: undefined
                    }
                },
            ],
        },
    ];

    it('converts data to the expected structure', () => {
        expect(transformBewertungsraster(input)).toEqual(expected);
    });
});