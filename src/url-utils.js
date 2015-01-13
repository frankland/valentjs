function ResolveTemplateUrl(component) {
  var resolved = component.config.templateUrl;

  return 'yo.html';
  if (!isAbsolute(resolved)) {
    var deployDir = component.paths.output.replace(/\/[^\/]+$/, ''),
        output = component.paths.output,
        modulePath = component.paths.modulePath,
        srcDir = component.paths.src,
        root = component.paths.root;

    resolved = ResolveUrl(output, modulePath);

    var expr = new RegExp('^' + root);
    resolved = resolved.replace(srcDir, deployDir).replace(expr, '');

    resolved = ResolveUrl(resolved.replace(/[^\/]+$/, ''), component.config.templateUrl);
  }

  return resolved;
}

/**
 * Get at traceur
 * https://github.com/google/traceur-compiler/blob/5559a4d1da9424dd8784e5ab6ec17bbc11118648/src/runtime/url.js
 */
var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
var ComponentIndex = {
  SCHEME: 1,
  USER_INFO: 2,
  DOMAIN: 3,
  PORT: 4,
  PATH: 5,
  QUERY_DATA: 6,
  FRAGMENT: 7
};

function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = [];
  if (opt_scheme) {
    out.push(opt_scheme, ':');
  }
  if (opt_domain) {
    out.push('//');
    if (opt_userInfo) {
      out.push(opt_userInfo, '@');
    }
    out.push(opt_domain);
    if (opt_port) {
      out.push(':', opt_port);
    }
  }
  if (opt_path) {
    out.push(opt_path);
  }
  if (opt_queryData) {
    out.push('?', opt_queryData);
  }
  if (opt_fragment) {
    out.push('#', opt_fragment);
  }
  return out.join('');
};

function split(uri) {
  return (uri.match(splitRe));
}

function removeDotSegments(path) {
  if (path === '/')
    return '/';
  var leadingSlash = path[0] === '/' ? '/' : '';
  var trailingSlash = path.slice(-1) === '/' ? '/' : '';
  var segments = path.split('/');
  var out = [];
  var up = 0;
  for (var pos = 0; pos < segments.length; pos++) {
    var segment = segments[pos];
    switch (segment) {
      case '':
      case '.':
        break;
      case '..':
        if (out.length)
          out.pop();
        else
          up++;
        break;
      default:
        out.push(segment);
    }
  }
  if (!leadingSlash) {
    while (up-- > 0) {
      out.unshift('..');
    }
    if (out.length === 0)
      out.push('.');
  }
  return leadingSlash + out.join('/') + trailingSlash;
}

function joinAndCanonicalizePath(parts) {
  var path = parts[ComponentIndex.PATH] || '';
  path = removeDotSegments(path);
  parts[ComponentIndex.PATH] = path;
  return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
}

function canonicalizeUrl(url) {
  var parts = split(url);
  return joinAndCanonicalizePath(parts);
}

function ResolveUrl(base, url) {
  var parts = split(url);
  var baseParts = split(base);
  if (parts[ComponentIndex.SCHEME]) {
    return joinAndCanonicalizePath(parts);
  } else {
    parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
  }
  for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
    if (!parts[i]) {
      parts[i] = baseParts[i];
    }
  }
  if (parts[ComponentIndex.PATH][0] == '/') {
    return joinAndCanonicalizePath(parts);
  }
  var path = baseParts[ComponentIndex.PATH];
  var index = path.lastIndexOf('/');
  path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
  parts[ComponentIndex.PATH] = path;

  return joinAndCanonicalizePath(parts);
}

function isAbsolute(name) {
  if (!name)
    return false;
  if (name[0] === '/')
    return true;
  var parts = split(name);
  if (parts[ComponentIndex.SCHEME])
    return true;
  return false;
}

export { ResolveUrl }
export { isAbsolute }
export { ResolveTemplateUrl }
