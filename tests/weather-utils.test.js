import { test } from "node:test";
import assert from "node:assert/strict";
import { getWeatherInfo, computeAnimationSpeed } from "../weather-utils.js";

function assertAlmostEqual(actual, expected) {
    assert.ok(Math.abs(actual - expected) < 0.0001,
        `Attendu ${expected}, obtenu ${actual}`);   
}

test("Vent nul : animation à la vitesse minimale", () => {
    const result = computeAnimationSpeed(0);
    assertAlmostEqual(result, 0.3);
});

test("Vent moyen : animation à une vitesse courante", () => {
    const result = computeAnimationSpeed(45);
    assertAlmostEqual(result, 1.15);
});

test("Vent au maximum : animation à la vitesse maximale", () => {
    const result = computeAnimationSpeed(90);
    assertAlmostEqual(result, 2);
});

test("Tempête au-delà du maximum : animation à la vitesse maximale", () => {
    const result = computeAnimationSpeed(120);
    assertAlmostEqual(result, 2);
});

test("Code 0 en journée : ciel dégagé avec l'icône de jour", () => {
    const result = getWeatherInfo(0, 1);
    assert.equal(result.text, "Ciel dégagé");
    assert.equal(result.icon, "icons/clear-day.svg");
});

test("Code 0 la nuit : ciel dégagé avec l'icône de nuit", () => {
    const result = getWeatherInfo(0, 0);
    assert.equal(result.text, "Ciel dégagé");
    assert.equal(result.icon, "icons/clear-night.svg");
});

test("Code sans icône de nuit, la nuit : faible pluie la nuit", () => {
    const result = getWeatherInfo(61, 0);
    assert.equal(result.text, "Faible pluie");
    assert.equal(result.icon, "icons/rain.svg");
});

test("Code inconnu : message 'Météo indisponible'", () => {
    const result = getWeatherInfo(1000, 1);
    assert.equal(result.text, "Météo indisponible");
    assert.equal(result.icon, "icons/not-available.svg");
});