# Api Mock

Mocks an API given a response map in json format

## Usage

```
$ node apimock.js map.json
```

This will start a server listening on _http://localhost:8080_ .

If you want to specify the port, you can use the second argument.
```
$ node apimock.js map.json 8080
```

## map.json format

```json
{

	"/no/body/or/headers": {
		"code": 200
	},

	"/path/to/endpoint": {
		"code": 429,
		"headers": {
			"Retry-After": 2
		}
	},

	"/some/other/endpoint": {
		"code": 200,
		"headers": {
			"Content-Type": "application/json"
		},
		"body": {
			"key": "value",
			"foo": "bar"
		}
	}
}
```

The _code_, _headers_ and _body_ properties are all optional.

If no code is specified, 200 is returned.

If the endpoint is not found in the map, 404 is returned.

