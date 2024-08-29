import { protocol } from 'electron';
import * as path from 'node:path';
import { URL } from 'node:url';

const createProtocol = (scheme: string) => {
  protocol.registerFileProtocol(scheme, (request, respond) => {
    let pathName = new URL(request.url).pathname;
    pathName = decodeURI(pathName); // Needed in case URL contains spaces

    const filePath = path.join(__dirname, pathName);
    respond({ path: filePath });
  });
};
export default createProtocol;
