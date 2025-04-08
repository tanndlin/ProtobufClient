import { parseVarint } from './decode';

const buffer = Buffer.from([0x96, 0x01]);
console.log(parseVarint(buffer));
