(() => {
    "use strict";
    var e,
        n = function () {},
        t = (function () {
            function e() {}
            return (
                (e.reset = function () {
                    (e.sessionId = ""), (e.isResetSession = !1), (e.idleTimer = 0), (e.lastIdleTime = Date.now()), (e.lastTabExitTime = 0), (e.scrollObservedElements = new Set());
                }),
                (e.debounceTime = 500),
                (e.qeenDeviceId = ""),
                (e.boundThreadEvents = !1),
                (e.bindQueue = []),
                (e.contentServed = !1),
                e
            );
        })(),
        o =
            ((e = function (n, t) {
                return (
                    (e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function (e, n) {
                                e.__proto__ = n;
                            }) ||
                        function (e, n) {
                            for (var t in n) Object.prototype.hasOwnProperty.call(n, t) && (e[t] = n[t]);
                        }),
                    e(n, t)
                );
            }),
            function (n, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
                function o() {
                    this.constructor = n;
                }
                e(n, t), (n.prototype = null === t ? Object.create(t) : ((o.prototype = t.prototype), new o()));
            }),
        i = (function (e) {
            function n(n) {
                var t = e.call(this, n) || this;
                return (t.name = "InvalidParameterError"), t;
            }
            return o(n, e), n;
        })(Error),
        r = (function (e) {
            function n(n) {
                var t = e.call(this, n) || this;
                return (t.name = "AnalyticsEndpointError"), t;
            }
            return o(n, e), n;
        })(Error),
        c = (function (e) {
            function n(n) {
                var t = e.call(this, n) || this;
                return (t.name = "URLContainsNoQeenError"), t;
            }
            return o(n, e), n;
        })(Error),
        l = (function (e) {
            function n(n, t, o) {
                var i = e.call(this, "Request to ".concat(o, " failed with status ").concat(n, ": ").concat(t)) || this;
                return (i.name = "ResponseNotOkError"), (i.status = n), (i.statusText = t), (i.url = o), i;
            }
            return o(n, e), n;
        })(Error),
        s = (function () {
            function e(e, o, i, r) {
                (this.ts = Date.now()),
                    (this.pid = t.sessionId),
                    (this.u = window.location.href),
                    (this.ua = navigator.userAgent),
                    (this.r = document.referrer),
                    (this.p = n.projectId),
                    (this.csrvid = n.contentServingId),
                    (this.cid = n.contentId),
                    (this.uid = t.qeenDeviceId),
                    (this.npdp = !n.isPdp),
                    (this.t = e),
                    (this.v = o),
                    (this.l = i),
                    (this.edp = r),
                    this.pushEvent();
            }
            return (
                (e.prototype.pushEvent = function () {
                    if (!n.analyticsEndpoint) throw new r("Qeen analytics endpoint not set.");
                    if (!t.qeenDeviceId) throw new i("Qeen user device ID is required.");
                    window.location.hash.includes("qeen-dev") && console.log(this);
                    var e = { event: this },
                        o = JSON.stringify(e);
                    navigator.sendBeacon(n.analyticsEndpoint, o);
                }),
                e
            );
        })(),
        u = (function () {
            function e(e) {
                (this.pageUrl = window.location.href),
                    (this.referrerUrl = document.referrer),
                    (this.locale = navigator.language),
                    (this.langCode = document.documentElement.lang || "en"),
                    (this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone),
                    (this.userDeviceId = e),
                    (this.params = new URLSearchParams({ pageUrl: this.pageUrl, userDeviceId: this.userDeviceId, referrerUrl: this.referrerUrl, locale: this.locale, langCode: this.langCode, timezone: this.timezone }));
            }
            return (
                (e.prototype.toString = function () {
                    return this.params.toString();
                }),
                e
            );
        })(),
        a = function (e, n) {
            if (!e || !n) throw new i("Label and value are required for interaction events.");
            (this.label = e), (this.value = n);
        },
        d = (function () {
            function e(n, t) {
                var o = this;
                (this.timer = 0),
                    (this.context = null),
                    (this.args = null),
                    (this.clear = function () {
                        window.clearTimeout(o.timer), (o.context = null), (o.args = null);
                        var n = e.debouncedEvents.indexOf(o);
                        -1 !== n && e.debouncedEvents.splice(n, 1);
                    }),
                    (this.debounced = function () {
                        for (var n = [], t = 0; t < arguments.length; t++) n[t] = arguments[t];
                        (o.context = o), (o.args = n);
                        var i = o.clear;
                        window.clearTimeout(o.timer),
                            (o.timer = window.setTimeout(function () {
                                o.fn.apply(o.context, o.args), i();
                            }, o.delay)),
                            -1 === e.debouncedEvents.indexOf(o) && e.debouncedEvents.push(o);
                    }),
                    (this.trigger = function () {
                        o.context && o.args && o.fn.apply(o.context, o.args), o.clear();
                    }),
                    (this.fn = n),
                    (this.delay = t);
            }
            return (
                (e.debouncedEvents = []),
                (e.flushAll = function () {
                    e.debouncedEvents.forEach(function (e) {
                        e.trigger();
                    });
                }),
                e
            );
        })();
    function v() {
        var e = Math.pow(10, 16) - 1;
        return Math.floor(Math.random() * (e - 1 + 1)) + 1;
    }
    function f(e) {
        (Array.isArray(e) ? e : [e]).forEach(function (e) {
            e instanceof a || (e = new a(e.label, e.value));
            var o = document.querySelectorAll(e.value);
            if (0 === o.length) throw new i("No elements found with the selector: ".concat(e.value));
            o.forEach(function (n) {
                n.hasAttribute("data-qeen-click-bound") ||
                    (n.setAttribute("data-qeen-click-bound", "true"),
                    n.addEventListener(
                        "click",
                        new d(function () {
                            new s("CLICK", null, e.label, e.value);
                        }, t.debounceTime).debounced
                    ));
            }),
                (n.clickEvents = n.clickEvents || []),
                n.clickEvents.some(function (n) {
                    return (null == n ? void 0 : n.label) === e.label && (null == n ? void 0 : n.value) === e.value;
                }) || n.clickEvents.push(e);
        });
    }
    function h(e) {
        (Array.isArray(e) ? e : [e]).forEach(function (e) {
            e instanceof a || (e = new a(e.label, e.value));
            var o = document.querySelectorAll(e.value);
            if (0 === o.length) throw new i("No elements found with the selector: ".concat(e.value));
            o.forEach(function (n) {
                var o = new IntersectionObserver(
                    function (n) {
                        n.forEach(function (n) {
                            n.isIntersecting && (t.scrollObservedElements.has(e.label) || (new s("SCROLL", null, e.label, e.value), t.scrollObservedElements.add(e.label)), null == o || o.unobserve(n.target), (o = null));
                        });
                    },
                    { threshold: 0.5 }
                );
                o.observe(n);
            }),
                (n.scrollEvents = n.scrollEvents || []),
                n.scrollEvents.some(function (n) {
                    return (null == n ? void 0 : n.label) === e.label && (null == n ? void 0 : n.value) === e.value;
                }) || n.scrollEvents.push(e);
        });
    }
    function w(e) {
        if (!e) throw new i("Idle threshold is required to reset the idle timer.");
        window.clearTimeout(t.idleTimer),
            document.hidden ||
                (t.idleTimer = window.setTimeout(function () {
                    var n = Date.now() - t.lastIdleTime >= e;
                    !document.hidden && n && (new s("IDLE", e, null, null), (t.lastIdleTime = Date.now()), y());
                }, e));
    }
    function E(e, t) {
        if (n.isPdp) throw new i("Checkout events may only be sent on non-product detail pages.");
        new s("CHECKOUT", t, e, null);
    }
    function m() {
        t.contentServed = !1;
    }
    function p(e) {
        function o() {
            new s("PAGE_VIEW", null, e, null), t.contentServed && n.isPdp && "0" !== n.contentServingId && new s("CONTENT_SERVED", null, null, null);
        }
        "RESET" === e && (t.isResetSession = !0),
            (t.sessionId = String(v())),
            w(n.idleTime),
            "visible" === document.visibilityState
                ? o()
                : document.addEventListener("visibilitychange", function e() {
                      (t.lastTabExitTime = Date.now()), "visible" === document.visibilityState && (o(), document.removeEventListener("visibilitychange", e));
                  });
    }
    function b() {
        d.flushAll(), new s("PAGE_EXIT", null, null, null);
    }
    function g() {
        var e, o;
        t.boundThreadEvents ||
            ((t.boundThreadEvents = !0),
            document.addEventListener("visibilitychange", function () {
                document.hidden ? ((t.lastTabExitTime = Date.now()), new s("TAB_SWITCH", null, "EXIT", null), d.flushAll()) : Date.now() - t.lastTabExitTime >= n.idleTime ? y() : new s("TAB_SWITCH", null, "RETURN", null);
            }),
            (e = n.idleTime),
            ["mousemove", "keypress", "touchmove", "scroll", "click", "keyup", "touchstart", "touchend", "visibilitychange"].forEach(function (n) {
                document.addEventListener(n, function () {
                    w(e);
                });
            }),
            (o = function () {
                b();
            }),
            window.addEventListener(
                "beforeunload",
                function () {
                    o();
                },
                !1
            ));
    }
    function y() {
        t.reset(), h(n.scrollEvents), p("RESET");
    }
    var I = function (e, n) {
        (this.fn = e), (this.args = n);
    };
    (window.qeen = window.qeen || {}),
        (window.qeen.fetchQeenContent = function (e) {
            return (
                (t = this),
                (o = void 0),
                (s = function () {
                    var t, o, r, s;
                    return (function (e, n) {
                        var t,
                            o,
                            i,
                            r,
                            c = {
                                label: 0,
                                sent: function () {
                                    if (1 & i[0]) throw i[1];
                                    return i[1];
                                },
                                trys: [],
                                ops: [],
                            };
                        return (
                            (r = { next: l(0), throw: l(1), return: l(2) }),
                            "function" == typeof Symbol &&
                                (r[Symbol.iterator] = function () {
                                    return this;
                                }),
                            r
                        );
                        function l(l) {
                            return function (s) {
                                return (function (l) {
                                    if (t) throw new TypeError("Generator is already executing.");
                                    for (; r && ((r = 0), l[0] && (c = 0)), c; )
                                        try {
                                            if (((t = 1), o && (i = 2 & l[0] ? o.return : l[0] ? o.throw || ((i = o.return) && i.call(o), 0) : o.next) && !(i = i.call(o, l[1])).done)) return i;
                                            switch (((o = 0), i && (l = [2 & l[0], i.value]), l[0])) {
                                                case 0:
                                                case 1:
                                                    i = l;
                                                    break;
                                                case 4:
                                                    return c.label++, { value: l[1], done: !1 };
                                                case 5:
                                                    c.label++, (o = l[1]), (l = [0]);
                                                    continue;
                                                case 7:
                                                    (l = c.ops.pop()), c.trys.pop();
                                                    continue;
                                                default:
                                                    if (!((i = (i = c.trys).length > 0 && i[i.length - 1]) || (6 !== l[0] && 2 !== l[0]))) {
                                                        c = 0;
                                                        continue;
                                                    }
                                                    if (3 === l[0] && (!i || (l[1] > i[0] && l[1] < i[3]))) {
                                                        c.label = l[1];
                                                        break;
                                                    }
                                                    if (6 === l[0] && c.label < i[1]) {
                                                        (c.label = i[1]), (i = l);
                                                        break;
                                                    }
                                                    if (i && c.label < i[2]) {
                                                        (c.label = i[2]), c.ops.push(l);
                                                        break;
                                                    }
                                                    i[2] && c.ops.pop(), c.trys.pop();
                                                    continue;
                                            }
                                            l = n.call(e, c);
                                        } catch (e) {
                                            (l = [6, e]), (o = 0);
                                        } finally {
                                            t = i = 0;
                                        }
                                    if (5 & l[0]) throw l[1];
                                    return { value: l[0] ? l[1] : void 0, done: !0 };
                                })([l, s]);
                            };
                        }
                    })(this, function (a) {
                        switch (a.label) {
                            case 0:
                                return (
                                    a.trys.push([0, 3, , 4]),
                                    e
                                        ? window.location.hash.includes("no-qeen")
                                            ? [2, Promise.reject(new c("Qeen is disabled; URL contains #no-qeen"))]
                                            : (m(), (t = new u(e)), [4, fetch("".concat("https://fodoole-web-analytics-qfan6cresq-ew.a.run.app/sdk/client-config", "?").concat(t.toString()))])
                                        : [2, Promise.reject(new i("Qeen user device ID is required."))]
                                );
                            case 1:
                                return (o = a.sent()).ok ? [4, o.json()] : [2, Promise.reject(new l(o.status, o.statusText, o.url))];
                            case 2:
                                return (
                                    ((r = a.sent()).qeenDeviceId = e),
                                    (r.contentSelectors =
                                        ((d = r.rawContentSelectors),
                                        (v = {}),
                                        d.forEach(function (e) {
                                            v[null == e ? void 0 : e.path] = null == e ? void 0 : e.value;
                                        }),
                                        v)),
                                    (n.rawContentSelectors = r.rawContentSelectors),
                                    (n.contentSelectors = r.contentSelectors),
                                    [2, r]
                                );
                            case 3:
                                return (s = a.sent()), console.error("Failed to get Qeen content:", s), [2, Promise.reject(s)];
                            case 4:
                                return [2];
                        }
                        var d, v;
                    });
                }),
                new ((r = void 0) || (r = Promise))(function (e, n) {
                    function i(e) {
                        try {
                            l(s.next(e));
                        } catch (e) {
                            n(e);
                        }
                    }
                    function c(e) {
                        try {
                            l(s.throw(e));
                        } catch (e) {
                            n(e);
                        }
                    }
                    function l(n) {
                        var t;
                        n.done
                            ? e(n.value)
                            : ((t = n.value),
                              t instanceof r
                                  ? t
                                  : new r(function (e) {
                                        e(t);
                                    })).then(i, c);
                    }
                    l((s = s.apply(t, o || [])).next());
                })
            );
            var t, o, r, s;
        }),
        (window.qeen.initPageSession = function (e) {
            if (!n.noQeen) {
                if (!e.qeenDeviceId) throw new i("User device ID is required.");
                var o, r;
                t.sessionId && b(),
                    (t.qeenDeviceId = e.qeenDeviceId),
                    (n.analyticsEndpoint = e.analyticsEndpoint || ""),
                    (n.projectId = e.projectId || "0"),
                    (n.contentServingId = e.contentServingId || "0"),
                    (n.contentId = e.contentId || "-"),
                    (n.isPdp = e.isPdp || !1),
                    (n.idleTime = ((o = e.idleTime), void 0 === (r = 3e5) && (r = 0), Math.min(Math.max(o, 6e4), 599e3) || r)),
                    (n.clickEvents = n.clickEvents || []),
                    (n.scrollEvents = n.scrollEvents || []),
                    (n.clickEvents = n.clickEvents.filter(function (e) {
                        return document.querySelector(e.value);
                    })),
                    (n.scrollEvents = n.scrollEvents.filter(function (e) {
                        return document.querySelector(e.value);
                    })),
                    t.reset(),
                    (t.sessionId = String(v())),
                    (c = function () {
                        p("INIT"), g();
                    }),
                    null === document.body
                        ? document.addEventListener(
                              "DOMContentLoaded",
                              function () {
                                  c();
                              },
                              !1
                          )
                        : c(),
                    t.bindQueue.forEach(function (e) {
                        e.fn.apply(e, e.args);
                    }),
                    (t.bindQueue = []);
            }
            var c;
        }),
        (window.qeen.bindClickEvents = function (e) {
            t.sessionId ? f(e) : ((t.bindQueue = t.bindQueue || []), t.bindQueue.push(new I(f, [e])));
        }),
        (window.qeen.bindScrollEvents = function (e) {
            t.sessionId ? h(e) : ((t.bindQueue = t.bindQueue || []), t.bindQueue.push(new I(h, [e])));
        }),
        (window.qeen.sendCheckoutEvent = function (e, n) {
            if (!e || !n) throw new i("Currency and value are required for checkout events.");
            t.sessionId ? E(e, n) : ((t.bindQueue = t.bindQueue || []), t.bindQueue.push(new I(E, [e, n])));
        }),
        (window.qeen.setContentServed = function () {
            t.contentServed = !0;
        }),
        (window.qeen.resetContentServed = m),
        (window.qeen.randInt = v),
        (window.qeen.config = n),
        (window.qeen.state = t),
        (window.qeen.InteractionEvent = a),
        (window.qeen.InvalidParameterError = i),
        (window.qeen.AnalyticsEndpointError = r),
        (window.qeen.ResponseNotOkError = l),
        (window.qeen.URLContainsNoQeenError = c),
        window.location.hash.includes("no-qeen")
            ? ((n.noQeen = !0),
              console.log("".concat((window.qeenError = "Qeen is disabled; URL contains #no-qeen"))),
              (window.qeen.receiveMessage = function (e) {
                  var n, t, o, i, r, c, l, s;
                  e &&
                      ("renderDemoContent" === (null === (n = null == e ? void 0 : e.data) || void 0 === n ? void 0 : n.action)
                          ? ((c = null === (t = e.data) || void 0 === t ? void 0 : t.domPath), (l = null === (o = e.data) || void 0 === o ? void 0 : o.content), (s = document.querySelector(c)) && (s.innerHTML = l))
                          : "scrollToTarget" === (null === (i = e.data) || void 0 === i ? void 0 : i.action) &&
                            (function (e) {
                                var n = document.querySelector(e);
                                n && window.scrollTo({ behavior: "smooth", top: n.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 100 });
                            })(null === (r = e.data) || void 0 === r ? void 0 : r.domPath));
              }),
              window.addEventListener("message", window.qeen.receiveMessage, !1))
            : (n.noQeen = !1);
})();
