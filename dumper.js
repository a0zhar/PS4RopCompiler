function printf(){}//for debugging

const hostIP = "ENTER_IP_HERE";
const hostPort="5000";

const webkitSize = 27262976; //27mb
const libKernelSize = 300000; //300kb
const libcSize = 1200000; //1.2mb

function dumpModule(address, size, name) {
  printf(`[*] Starting to dump the ${name} module!`);
  
  const webSock = new WebSocket(`ws://${hostIP}:${hostPort}`);
  webSock.addEventListener("open", () => {
    let chunkSize = size / 1000;
    let bytesLeft = size;
    let bytesRead = 0;
    while (bytesLeft > 0) {
      let buffer = read_mem(address + bytesRead, chunkSize);
      /* Over at the server, we split this string into 2 parts 
      ([filename].bin, [filedata]) and using this, we no 
      longer need to manually change the filename inside the 
      server.js file. */
      webSock.send(`${name}.bin,${buffer});
      bytesLeft -= chunkSize;
      bytesRead += chunkSize;
      buffer = null;
    }

    printf(`${name} successfully dumped`);
    webSock.close();
  });
}
