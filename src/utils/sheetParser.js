/**
 * Parse numbered keys from a key-value object into an array of objects.
 * Example: { service_1_title: 'A', service_1_desc: 'B', service_2_title: 'C', service_2_desc: 'D' }
 *   => parseList(kv, 'service', ['title', 'desc'])
 *   => [{ title: 'A', desc: 'B' }, { title: 'C', desc: 'D' }]
 */
export function parseList(kv, prefix, fields) {
    if (!kv || typeof kv !== 'object') return [];
    const items = [];
    let i = 1;
    while (kv[`${prefix}_${i}_${fields[0]}`] !== undefined && kv[`${prefix}_${i}_${fields[0]}`] !== '') {
        const item = {};
        fields.forEach(f => {
            item[f] = kv[`${prefix}_${i}_${f}`] || '';
        });
        items.push(item);
        i++;
    }
    return items;
}

/**
 * Parse simple numbered keys into a string array.
 * Example: { coverage_1: 'Jakarta', coverage_2: 'Bandung' }
 *   => parseSimpleList(kv, 'coverage')
 *   => ['Jakarta', 'Bandung']
 */
export function parseSimpleList(kv, prefix) {
    if (!kv || typeof kv !== 'object') return [];
    const items = [];
    let i = 1;
    while (kv[`${prefix}_${i}`] !== undefined && kv[`${prefix}_${i}`] !== '') {
        items.push(kv[`${prefix}_${i}`]);
        i++;
    }
    return items;
}
