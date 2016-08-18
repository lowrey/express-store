# express-store
-----
An small webserver that stores and retrieves JSON objects using a mongo like interface.  BasicAuth and CORS are enabled on each request.

Examples
-----
* `curl -u admin:changethis -H "Content-Type: application/json" -X POST --data '{"data1":"xyz","data2":"abc"}' https://domain.example/testCollection`

  `[{"data1":"xyz","data2":"abc","_id":2}]`
  
* `curl -u admin:changethis https://domain.example/testCollection/2`

  `{"data1":"xyz","data2":"abc","_id":2}`

* `curl -u admin:changethis -H "Content-Type: application/json" -X PUT --data '{"data1":"xyz","data2":"abc"}' https://domain.example/testCollection/2`

  `1`

* `curl -u admin:changethis https://domain.example/testCollection/all`

`[{"data2":"xyz","_id":2}]`

* `curl -u -X DELETE admin:changethis https://domain.example/testCollection/2`

  `1`
