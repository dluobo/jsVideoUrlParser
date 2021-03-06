function URLParser() {
  "use strict";
  this.plugins = {};
}
URLParser.prototype.parse = function(url) {
  "use strict";
  var th = this,
    match = url.match(/(?:https?:\/\/)?(?:[^\.]+\.)?(\w+)\./i),
    provider = match ? match[1] : undefined,
    result,
    createdUrl;
  if (match && provider && th.plugins[provider]) {
    result = th.plugins[provider].parse.call(this, url);
    if (result) {
      result.provider = th.plugins[provider].provider;
      return result;
    }
  }
  return undefined;
};
URLParser.prototype.bind = function(plugin) {
  var th = this;
  th.plugins[plugin.provider] = plugin;
  if (plugin.alternatives) {
    var i;
    for (i = 0; i < plugin.alternatives.length; i += 1) {
      th.plugins[plugin.alternatives[i]] = plugin;
    }
  }
};
URLParser.prototype.create = function(op) {
  var th = this,
    vi = op.videoInfo;
  op.format = op.format || 'short';
  if (th.plugins[vi.provider].create) {
    return th.plugins[vi.provider].create.call(this, op);
  }
  return undefined;
};

var urlParser = new URLParser();
