/* ことばクエスト Android音声ブリッジ。Webブラウザーの標準音声認識は上書きしません。 */
(function () {
  'use strict';

  var nativeSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  function AndroidSpeechRecognition() {
    this.lang = 'ja-JP';
    this.continuous = false;
    this.interimResults = true;
    this.maxAlternatives = 3;
    this.onstart = null;
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
    window.__activeAndroidSpeechRecognition = this;
  }

  AndroidSpeechRecognition.prototype.start = function () {
    window.__activeAndroidSpeechRecognition = this;
    if (!window.AndroidSpeech) {
      this.__emitError('not-supported');
      return;
    }
    try { window.AndroidSpeech.start(this.lang || 'ja-JP'); }
    catch (e) { this.__emitError('client'); }
  };

  AndroidSpeechRecognition.prototype.abort = function () {
    try { if (window.AndroidSpeech) window.AndroidSpeech.stop(); } catch (e) {}
  };

  AndroidSpeechRecognition.prototype.__emitStart = function () {
    try { if (typeof this.onstart === 'function') this.onstart(); } catch (e) {}
  };
  AndroidSpeechRecognition.prototype.__emitResult = function (text, isFinal) {
    var item = {0: {transcript: String(text || ''), confidence: 1.0}, isFinal: !!isFinal, length: 1};
    var event = {resultIndex: 0, results: [item]};
    try { if (typeof this.onresult === 'function') this.onresult(event); } catch (e) {}
  };
  AndroidSpeechRecognition.prototype.__emitError = function (error) {
    try { if (typeof this.onerror === 'function') this.onerror({error: String(error || 'unknown')}); } catch (e) {}
  };
  AndroidSpeechRecognition.prototype.__emitEnd = function () {
    try { if (typeof this.onend === 'function') this.onend(); } catch (e) {}
  };

  window.AndroidSpeechRecognition = AndroidSpeechRecognition;
  // Android WebViewではネイティブブリッジを使用。通常のWebではブラウザー標準APIを優先。
  if (window.AndroidSpeech || !nativeSpeechRecognition) {
    window.SpeechRecognition = AndroidSpeechRecognition;
    window.webkitSpeechRecognition = AndroidSpeechRecognition;
  }

  window.__androidSpeechDispatch = {
    start: function () { var r = window.__activeAndroidSpeechRecognition; if (r) r.__emitStart(); },
    result: function (text, isFinal) { var r = window.__activeAndroidSpeechRecognition; if (r) r.__emitResult(text, isFinal); },
    error: function (error) { var r = window.__activeAndroidSpeechRecognition; if (r) r.__emitError(error); },
    end: function () { var r = window.__activeAndroidSpeechRecognition; if (r) r.__emitEnd(); },
    permission: function (granted) {
      window.__androidMicGranted = !!granted;
      try { if (window.__nativeMicPermissionCallback) window.__nativeMicPermissionCallback(!!granted); } catch (e) {}
    }
  };
})();
