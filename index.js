(function (win) {
  var global = win;
  var doc = this.document;

  var dom = function (params, context) {
    return new GetOrMakeDom(params, context);
  };

  var regXContainsTag = /^\s*<(\w+|!)[^>]*>/;

  var GetOrMakeDom = function (params, context) {
    var currentContext = doc;
    if (context) {
      if (context.nodeType) {
        currentContext = context;
      } else {
        doc.querySelector(context);
      }
    }

    var invalidParam =
      !params ||
      params === "" ||
      (typeof params === "string" && params.trim() === "");

    if (invalidParam) {
      this.length = 0;
      return this;
    }

    // If is a HTML string, construct domgragment, fill object then return obj
    if (typeof params === "string" && regXContainsTag.test(params)) {
      var divEl = currentContext.createElement("div");
      divEl.className = "hippo-doc-frag-wrapper";
      var docFragment = currentContext.createDocumentFragment();
      docFragment.appendChild(divEl);
      queryDiv = docFragment.querySelector("div");
      queryDiv.innerHTML = params;
      var numberOfChildren = queryDiv.children.length;

      for (var i = 0; i < numberOfChildren; i++) {
        this[i] = queryDiv.children[i];
      }

      this.length = numberOfChildren;
      return this;
    }

    if (typeof params === "object" && params.nodeName) {
      this.length = 1;
      this[0] = params;
      return this;
    }

    /**
     * If its an object but node a Node, assume it is a nodelist or array
     * else it's a string selector, so create nodeList
     */
    var nodes;
    if (typeof params !== "string") {
      // Nodelist or array
      nodes = params;
    } else {
      // Assume as string selector
      nodes = currentContext.querySelectorAll(params.trim());
    }

    // Loop over nodes, and fill current instance
    var nodesLength = nodes.length;
    for (var i = 0; i < nodesLength; i++) {
      this[i] = nodes[i];
    }
    this.length = nodesLength;

    return this;
  };

  dom.fn = GetOrMakeDom.prototype;

  dom.fn.each = function (callback) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
      callback.call(this[i], i, this[i]);
    }

    return this;
  };

  dom.fn.html = function (htmlString) {
    if (htmlString) {
      return this.each(function () {
        this.innerHTML = htmlString;
      });
    }

    return this[0].innerHTML;
  };

  dom.fn.text = function (textString) {
    if (textString) {
      return this.each(function () {
        this.textContent = textString;
      });
    }

    return this[0].textContent.trim();
  };

  dom.fn.append = function (stringOrObject) {
    return this.each(function () {
      if (typeof stringOrObject === "string") {
        this.insertAdjacentHTML("beforeend", stringOrObject);
      } else {
        // Node objects
        var that = this;
        dom(stringOrObject).each(function (name, value) {
          that.insertAdjacentHTML("beforeEnd", value.outerHTML);
        });
      }
    });
  };

  global.dom = dom;
})(window);
