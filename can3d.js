(function () {
  function whenThree(cb) { if (window.THREE) cb(); else setTimeout(function () { whenThree(cb); }, 30); }
  var texCache = {};
  var FINISH = { gloss: [0.22, 0.08], satin: [0.45, 0.05], matte: [0.8, 0.0] };
  var LABEL_ASPECT = 4096 / 2216;
  var FRONT_U = 515 / 2576;

  function loadTex(url, renderer, cb) {
    var T = THREE, e = texCache[url];
    if (e && e.loaded) return cb(e.tex);
    if (e) { e.cbs.push(cb); return; }
    e = texCache[url] = { loaded: false, cbs: [cb] };
    e.tex = new T.TextureLoader().load(url, function () { e.loaded = true; e.cbs.forEach(function (f) { f(e.tex); }); e.cbs = []; });
    e.tex.encoding = T.sRGBEncoding;
    e.tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
  }

  function makeEnv(T) {
    var s = new T.Scene();
    s.add(new T.Mesh(new T.BoxGeometry(30, 30, 30), new T.MeshBasicMaterial({ color: new T.Color(0.26, 0.26, 0.26), side: T.BackSide })));
    function L(w, h, x, y, z, k) {
      var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(k, k, k), side: T.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m);
    }
    L(2.5, 24, -8, 0, 5, 6); L(1.6, 24, 8, 0, 3, 4); L(20, 6, 0, 12, 0, 2.2); L(3, 24, 2, 0, -10, 2.5); L(30, 30, 0, -14.5, 0, 0.08);
    return s;
  }

  function buildScene(T, r) {
    var scene = new T.Scene();
    var pm = new T.PMREMGenerator(r);
    scene.environment = pm.fromScene(makeEnv(T), 0.02).texture;
    var key = new T.DirectionalLight(0xffffff, 0.45); key.position.set(-4, 5, 6); scene.add(key);
    var fill = new T.DirectionalLight(0xffffff, 0.18); fill.position.set(5, 1, 4); scene.add(fill);
    scene.add(new T.AmbientLight(0xffffff, 0.12));
    var g = new T.Group(); scene.add(g);
    var H = 2 * Math.PI / LABEL_ASPECT, h = H / 2;
    var metal = new T.MeshStandardMaterial({ color: 0xd9dcdf, metalness: 1, roughness: 0.26, side: T.DoubleSide });
    var metalDark = new T.MeshStandardMaterial({ color: 0xb9bcc0, metalness: 1, roughness: 0.34, side: T.DoubleSide });
    var labelMat = new T.MeshStandardMaterial({ color: 0xffffff, metalness: 0.08, roughness: 0.22 });
    var body = new T.Mesh(new T.CylinderGeometry(1, 1, H, 180, 1, true), labelMat);
    body.rotation.y = -FRONT_U * Math.PI * 2; g.add(body);
    function V(a) { return a.map(function (p) { return new T.Vector2(p[0], p[1]); }); }
    g.add(new T.Mesh(new T.LatheGeometry(V([[0, h + 0.33], [0.77, h + 0.33], [0.79, h + 0.37], [0.805, h + 0.425], [0.835, h + 0.435], [0.852, h + 0.405], [0.848, h + 0.36], [0.87, h + 0.3], [0.935, h + 0.19], [0.985, h + 0.07], [1, h]]), 180), metal));
    g.add(new T.Mesh(new T.LatheGeometry(V([[1, -h], [0.975, -h - 0.11], [0.9, -h - 0.25], [0.76, -h - 0.33], [0.68, -h - 0.33], [0.6, -h - 0.27], [0.4, -h - 0.22], [0, -h - 0.2]]), 180), metalDark));
    var tab = new T.Shape(), tw = 0.19, tl = 0.36, rr = 0.12;
    tab.moveTo(-tw, -tl + rr); tab.lineTo(-tw, tl - rr); tab.quadraticCurveTo(-tw, tl, -tw + rr, tl); tab.lineTo(tw - rr, tl); tab.quadraticCurveTo(tw, tl, tw, tl - rr);
    tab.lineTo(tw, -tl + rr); tab.quadraticCurveTo(tw, -tl, tw - rr, -tl); tab.lineTo(-tw + rr, -tl); tab.quadraticCurveTo(-tw, -tl, -tw, -tl + rr);
    var hole = new T.Path(); hole.absellipse(0, -0.14, 0.11, 0.13, 0, Math.PI * 2, false); tab.holes.push(hole);
    var tabM = new T.Mesh(new T.ExtrudeGeometry(tab, { depth: 0.018, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 16 }), metal);
    tabM.rotation.x = -Math.PI / 2; tabM.position.set(0, h + 0.345, 0.1); g.add(tabM);
    var rivet = new T.Mesh(new T.CylinderGeometry(0.06, 0.07, 0.04, 24), metal); rivet.position.set(0, h + 0.35, 0.12); g.add(rivet);
    var mouth = new T.Shape(); mouth.absellipse(0, 0, 0.3, 0.2, 0, Math.PI * 2, false);
    var mouthM = new T.Mesh(new T.ShapeGeometry(mouth, 32), metalDark); mouthM.rotation.x = -Math.PI / 2; mouthM.position.set(0, h + 0.333, 0.5); g.add(mouthM);
    return { scene: scene, group: g, labelMat: labelMat };
  }
  function fitCam(c, a, zoom) {
    var t = Math.tan((c.fov / 2) * Math.PI / 180);
    var d = Math.max(4.9 / (2 * t), 2.9 / (2 * t * a)) / (zoom || 1);
    c.aspect = a; c.position.set(0, d * 0.11, d); c.lookAt(0, 0.02, 0); c.updateProjectionMatrix();
  }
  function applyFinish(m, f) { var v = FINISH[f] || FINISH.gloss; m.roughness = v[0]; m.metalness = v[1]; }

  function FDCan(el, opts) {
    this.el = el;
    this.o = Object.assign({ tilt: 0.1, autoSpin: true, spring: false, flavor: null, labels: {}, zoom: 1, finish: 'gloss', yaw: 0 }, opts || {});
    this.ext = 0; this.user = 0; this.vel = 0; this.dead = false; this.visible = true;
    var self = this;
    (window.__fdcans = window.__fdcans || []).push(this);
    whenThree(function () { try { self._init(); } catch (e) { console.error('FDCan init: ' + e.message); } });
  }
  FDCan.prototype._init = function () {
    if (this.dead) return;
    var T = THREE, self = this;
    var r = this.renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.outputEncoding = T.sRGBEncoding;
    r.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab;';
    this.el.appendChild(r.domElement);
    var b = buildScene(T, r);
    this.scene = b.scene; this.group = b.group; this.labelMat = b.labelMat;
    this.camera = new T.PerspectiveCamera(24, 1, 0.1, 100);
    this.group.rotation.z = this.o.tilt;
    this.setFinish(this.o.finish);
    if (this.o.flavor) this.setFlavor(this.o.flavor);
    var down = false, lx = 0;
    r.domElement.addEventListener('pointerdown', function (e) { down = true; lx = e.clientX; self.vel = 0; r.domElement.style.cursor = 'grabbing'; r.domElement.setPointerCapture(e.pointerId); });
    r.domElement.addEventListener('pointermove', function (e) { if (!down) return; var d = (e.clientX - lx) * 0.012; lx = e.clientX; self.user += d; self.vel = d; });
    var up = function () { down = false; r.domElement.style.cursor = 'grab'; };
    r.domElement.addEventListener('pointerup', up); r.domElement.addEventListener('pointercancel', up);
    this.ro = new ResizeObserver(function () { self._resize(); }); this.ro.observe(this.el); this._resize();
    this.io = new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; }); this.io.observe(this.el);
    var last = performance.now();
    var loop = function (t) {
      if (self.dead) return;
      self.raf = requestAnimationFrame(loop);
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!self.visible) return;
      if (!down) { self.user += self.vel; self.vel *= 0.94; if (self.o.autoSpin) self.user += dt * 0.35; else if (self.o.spring) self.user *= 0.95; }
      self.group.rotation.y = self.ext + self.user + self.o.yaw;
      self.group.position.y = Math.sin(t / 1400) * 0.05;
      try { r.render(self.scene, self.camera); } catch (e) { if (!self.err) { self.err = 1; console.error('FDCan render: ' + e.message); } }
    };
    this.raf = requestAnimationFrame(loop);
  };
  FDCan.prototype._resize = function () {
    var w = this.el.clientWidth || 1, hh = this.el.clientHeight || 1;
    this.renderer.setSize(w, hh, false);
    fitCam(this.camera, w / hh, this.o.zoom);
  };
  FDCan.prototype.setFlavor = function (k) {
    this.o.flavor = k;
    if (!this.labelMat) return;
    var url = this.o.labels[k]; if (!url) return;
    var self = this;
    loadTex(url, this.renderer, function (tex) { if (self.o.flavor !== k || self.dead) return; self.labelMat.map = tex; self.labelMat.needsUpdate = true; });
  };
  FDCan.prototype.preload = function () { for (var k in this.o.labels) loadTex(this.o.labels[k], this.renderer, function () {}); };
  FDCan.prototype.setRotation = function (rad) { this.ext = rad; };
  FDCan.prototype.setAutoSpin = function (b) { this.o.autoSpin = b; };
  FDCan.prototype.setFinish = function (f) { this.o.finish = f; if (this.labelMat) applyFinish(this.labelMat, f); };
  FDCan.prototype.dispose = function () { this.dead = true; cancelAnimationFrame(this.raf); if (this.ro) this.ro.disconnect(); if (this.io) this.io.disconnect(); if (this.renderer) { this.renderer.dispose(); this.renderer.domElement.remove(); } };

  FDCan.snapshots = function (labels, o) {
    o = Object.assign({ w: 480, h: 720, tilt: 0, yaw: -0.3, finish: 'gloss' }, o || {});
    return new Promise(function (res) {
      whenThree(function () {
        var T = THREE;
        var r = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        r.setPixelRatio(1); r.setSize(o.w, o.h, false); r.outputEncoding = T.sRGBEncoding;
        var b = buildScene(T, r);
        b.group.rotation.z = o.tilt; b.group.rotation.y = o.yaw; applyFinish(b.labelMat, o.finish);
        var cam = new T.PerspectiveCamera(24, 1, 0.1, 100); fitCam(cam, o.w / o.h, 1);
        var keys = Object.keys(labels), out = {}, i = 0;
        (function next() {
          if (i >= keys.length) { r.dispose(); return res(out); }
          var k = keys[i++];
          loadTex(labels[k], r, function (tex) { b.labelMat.map = tex; b.labelMat.needsUpdate = true; r.render(b.scene, cam); r.domElement.toBlob(function (bl) { out[k] = bl ? URL.createObjectURL(bl) : ''; next(); }, 'image/png'); });
        })();
      });
    });
  };
  window.FDCan = FDCan;
})();
