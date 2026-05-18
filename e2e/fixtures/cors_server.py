import sys
import socketserver
from http.server import SimpleHTTPRequestHandler

class CORS(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1])
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', port), CORS) as httpd:
        httpd.serve_forever()
