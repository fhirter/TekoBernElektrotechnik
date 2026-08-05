import {vi, beforeEach, it, expect, describe} from 'vitest';
import {ImportService} from './ImportService';


const storedData =  [{
        "name": "Flavio Müller",
        "tutor": "Matthias",
        "expert": "Jörg",
        "className": "B-TEL-23-T-a",
        "data": {}
    }
]

const dataImport = [
    {
        "name": "Stefan Schwander",
        "tutor": "Matthias",
        "expert": "Jörg",
        "className": "B-TEL-23-T-a",
        "data": {}
    }
]

const set = vi.fn();
const getAll = vi.fn().mockImplementation(() => [...storedData]);

const importData = ImportService({set, getAll});


let error;
beforeEach(() => {

    error = importData(JSON.stringify(dataImport))
});
it('should not return an error', () => {
    expect(error).toBeUndefined();
});
it('should call set', () => {
    const data = [...storedData, ...dataImport];
    expect(set).toHaveBeenCalledWith(data);
});
describe('collision', () => {
    it('should return an error on collision', () => {
        getAll.mockImplementationOnce(() => [...dataImport]);
        error = importData(importData);
        expect(error).toBeInstanceOf(Error);
    });
});