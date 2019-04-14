const http = require('http');
const memwatch = require('node-memwatch')
const heapdump  = require('heapdump')

var server = http.createServer((req, res) => {
 for (var i=0; i<1000; i++) {
 server.on('request', function leakyfunc() {});
 }

 res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
server.setMaxListeners(0);

console.log('Server running at http://127.0.0.1:1337/. Process PID: ', process.pid);

// 添加泄漏事件的监听器
memwatch.on('leak', (info) => {
  console.error('Memory leak detected:\n', info);
  const filename = `/tmp/${Date.now()}.heapsnapshot`
  heapdump.writeSnapshot((err, filename) => {
    if (err) console.error(err);
    else console.error('Wrote snapshot: ' + filename);
  })
})