# FuRI - Fast Uniform Resource Identifier Architecture Document

## Route Path parsing

A Route Path is parsed into 2 distinct lookup maps, by checking if the path is a:

1. Static Route path, direct matching.
2. Dynamic "Named Route" or Regex path, requiring addition matching.

During the check, the path is checked for any RegEx characters, if found, then the path is marked as RegEx pattern.

### Addition references

1. See "__interface UriMap__" for the two lookip maps.
1. See class "__Furi__" method, "__buildRequestMap__" for parsing implimentation details.

### Static Route path matching

If the path is a static string, then it can be used as a key for the static route map.

Example paths:

"/about"
"/admin/dashboard"

Route: /aa/bb/cc -> generate -> Key: /aa/bb/cc

Path:  /aa/bb/cc
Key lookup result in O(1).

### Dynamic "Named Route" path matching

For named route or Regex path, the key is first placed into a bucket, that is indexed by the number of path "/" separators.

Example RegEx paths:

/boat+houses?/
/boathouse/dept\\d+

Example named route path:

/students/:id/courses/:courseId

The key used to match the path is constructed as follow:

1. Set "useRegex" flag from the path URI.
    1. If "true", then the path is split on "/".
    1. Save segements to the "keyNames" array to be used by the "fastPathMatch" alogorithmn.
    1. If "false" initialize the "keyNames" with an empty array.

Next we check the URI for named parameters.

1. If a segment is prefixed with ":" then it is considered a named route parameter.
    1. The key is then appened with a Regex string like, "/([\\w-.~]+)".
    1. The segment name with the prefix ":" removed is added to a params array.
1. Otherwise the key is appended with the segment name "/${segment}".

Example processing:

Give the following "Named route" URI:

```pre
Route => /aa/:one/bb/cc/:two/e
```

1. Construct the search key from the Route.
1. Collect named parameter into an array from the Route.
1. This path is marked false for using Regex matching.
1. The fast match algorithm is used.

```pre
useRegex => false
Key      => /aa/(\w+)/bb/cc/(\w+)/e
params   => ['one', 'two']
```

The constructed search key and route parameters are return, to be saved into the partitioned lookup bucket:

```ts
return => { params: ['one', 'two'], key: "/aa/(\w+)/bb/cc/(\w+)/e" }
```
