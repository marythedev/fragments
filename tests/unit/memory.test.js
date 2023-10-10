const {
    readFragment,
    writeFragment,
    readFragmentData,
    writeFragmentData,
    listFragments
} = require('../../src/model/data/memory/memory');


describe('Memory back-end data strategy', () => {
    const fragment = { ownerId: 'ownerId', id: 'fragment id' };

    // test for calling writeFragment(fragment)
    test('writeFragment(fragment)', async () => {
        await writeFragment(fragment);
        expect(await listFragments(fragment.ownerId)).toEqual([fragment.id]);
    });

    //test for calling readFragment(ownerId, id)
    test('readFragment(ownerId, id)', async () => {
        const result = await readFragment('ownerId', 'fragment id');
        console.log(result)
        expect(result).toEqual(fragment);
    });

    // test for calling writeFragmentData(ownerId, id, buffer)
    test('writeFragmentData(ownerId, id, buffer)', async () => {
        fragment.data = 'fragment data'
        await writeFragmentData(fragment.ownerId, fragment.id, fragment.data);
        expect(await listFragments(fragment.ownerId, true)).toEqual([{id: fragment.id, ownerId: fragment.ownerId, data: fragment.data}]);
    });

    // test for calling readFragmentData(ownerId, id)
    test('readFragmentData(ownerId, id)', async () => {
        const result = await readFragmentData(fragment.ownerId, fragment.id);
        console.log(result)
        expect(result).toEqual(fragment.data)
    });
});
