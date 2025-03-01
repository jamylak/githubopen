#include "mongoose.h"
/*#include <cstdio>*/
#include <stdio.h>
#include <string.h>

static void ev_handler(struct mg_connection *c, int ev, void *ev_data) {
  if (ev == MG_EV_HTTP_MSG) {
    printf("HTTP request received\n");
    struct mg_http_message *hm = (struct mg_http_message *)ev_data;

    printf("URI: %.*s\n", (int)hm->uri.len, hm->uri.buf);
    if (mg_match(hm->uri, mg_str("/receive-url"), NULL)) {

      // https://github.com/cesanta/mongoose/blob/2fe7c8a410e481ebc069cbe3357b00a4c8d4a99e/examples/modbus-dashboard/net.c#L42
      char msg[500];
      printf("Received message: %s\n", msg);

      // https://github.com/cesanta/mongoose/blob/2fe7c8a410e481ebc069cbe3357b00a4c8d4a99e/examples/modbus-dashboard/net.c#L114
      char *url = mg_json_get_str(hm->body, "$.url");
      printf("Received url: %s\n", url);

      char *branch = mg_json_get_str(hm->body, "$.branch");
      printf("Received branch: %s\n", branch);

      char cmd[500];
      if (branch != NULL) {
        snprintf(cmd, sizeof(cmd), "fish -c \"launchKittyGithubUrl '%s' '%s'\"", url, branch);
      }
      else {
        snprintf(cmd, sizeof(cmd), "fish -c \"launchKittyGithubUrl '%s'\"", url);
      }

      system(cmd);
      mg_http_reply(c, 200, "", "{%m:%lu}\n", MG_ESC("time"), time(NULL));
    }
    else {
      mg_http_reply(c, 500, "", "{%m:%m}\n", MG_ESC("error"),
                    MG_ESC("Unsupported URI"));
    }
  }
}

int main(void) {
  struct mg_mgr mgr; // Declare event manager
  mg_mgr_init(&mgr); // Initialise event manager
  printf("Starting web server on port %s\n", "5555");
  mg_http_listen(&mgr, "http://localhost:5555", ev_handler,
                 NULL); // Setup listener
  for (;;) {            // Run an infinite event loop
    mg_mgr_poll(&mgr, 1000);
  }
  return 0;
}
