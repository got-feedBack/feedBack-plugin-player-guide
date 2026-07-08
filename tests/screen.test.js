'use strict';
// Coverage for screen.js's tour-button wiring and tour.json's structural
// integrity (guards against a typo/missing-field regression in the guide
// content, since nothing else in this repo would catch one).
// Runs under the org reusable CI as `node tests/screen.test.js`.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

class FakeButton {
    constructor() { this._listeners = {}; }
    addEventListener(type, fn) { this._listeners[type] = fn; }
    click() { if (this._listeners.click) this._listeners.click(); }
}

test('tour button click starts the player_guide tour when the SDK is present', () => {
    const btn = new FakeButton();
    global.document = { getElementById: (id) => (id === 'pg-tour-btn-screen' ? btn : null) };
    let startedWith = null;
    global.window = { slopsmithTour: { start: (id) => { startedWith = id; } } };

    const file = path.join(__dirname, '..', 'screen.js');
    delete require.cache[require.resolve(file)];
    require(file);

    btn.click();
    assert.equal(startedWith, 'player_guide');
});

test('screen.js does not throw when the tour button or SDK is absent', () => {
    global.document = { getElementById: () => null };
    global.window = {};
    const file = path.join(__dirname, '..', 'screen.js');
    delete require.cache[require.resolve(file)];
    assert.doesNotThrow(() => require(file));
});

test('screen.js does not throw on click when window.slopsmithTour is missing', () => {
    const btn = new FakeButton();
    global.document = { getElementById: (id) => (id === 'pg-tour-btn-screen' ? btn : null) };
    global.window = {}; // no slopsmithTour
    const file = path.join(__dirname, '..', 'screen.js');
    delete require.cache[require.resolve(file)];
    require(file);
    assert.doesNotThrow(() => btn.click());
});

// ── tour.json structural integrity ───────────────────────────────────────────

const tour = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tour.json'), 'utf-8'));

test('tour.json has a version and a non-empty step list', () => {
    assert.equal(typeof tour.version, 'number');
    assert.ok(Array.isArray(tour.tour) && tour.tour.length > 0);
});

test('every tour step has a unique id, title, content, and a valid shape/position', () => {
    const VALID_SHAPES = new Set(['bubble', 'spotlight']);
    const VALID_POSITIONS = new Set(['auto', 'top', 'bottom', 'left', 'right']);
    const seenIds = new Set();
    for (const step of tour.tour) {
        assert.equal(typeof step.id, 'string');
        assert.ok(step.id.length > 0);
        assert.ok(!seenIds.has(step.id), `duplicate step id: ${step.id}`);
        seenIds.add(step.id);
        assert.equal(typeof step.title, 'string');
        assert.equal(typeof step.content, 'string');
        assert.ok(VALID_SHAPES.has(step.shape), `${step.id}: shape ${step.shape}`);
        assert.ok(VALID_POSITIONS.has(step.position), `${step.id}: position ${step.position}`);
    }
});

test('every spotlight step declares a target selector', () => {
    for (const step of tour.tour) {
        if (step.shape === 'spotlight') {
            assert.equal(typeof step.selector, 'string', `${step.id}: missing selector`);
            assert.ok(step.selector.startsWith('#'), `${step.id}: selector should target an id`);
        }
    }
});
