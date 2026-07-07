# 🎮 KRAZY KIDS ANIMATIONS - TOP 10 Implementation Guide

## Quick Start

All animations are now integrated! Just call `KrazyAnimations.functionName()` from your game code.

---

## 🎯 TOP 10 ANIMATIONS

### 1. **Bouncy Button Animations** ✅
**Applied automatically to all buttons**
```javascript
// Automatically triggers on .btn, .shop-action, .content-btn, button
// No code needed - all buttons have bouncy spring physics!
```
**Visual:** Buttons scale up on hover with spring bounce, squash on click

---

### 2. **Rainbow Color Pulse** ✨
**Add to any element to make it rainbow-pulse**
```javascript
const element = document.getElementById('combo-bar');
element.classList.add('rainbow-pulse');
```
**Visual:** Text cycles through: Pink → Orange → Green → Cyan → Blue → Pink

---

### 3. **Floating Score Numbers** 💰
**Create floating score popups during gameplay**
```javascript
// Show +100 coins in gold
KrazyAnimations.floatScore(x, y, '+100', 'gold');

// Other colors: 'green', 'cyan', 'pink', 'purple'
KrazyAnimations.floatScore(500, 300, '+50 COMBO!', 'cyan');
```
**Visual:** Numbers float upward and fade away with glow effects

---

### 4. **Wobble Text Animation** 🤪
**Make UI text wiggle for attention**
```javascript
const title = document.querySelector('h1');
KrazyAnimations.wobbleText(title);
```
**Visual:** Text skews and scales as it wobbles side-to-side

---

### 5. **Celebration Dance** 🎉
**Victory animation on win screen**
```javascript
// Start celebration dance
const winElement = document.getElementById('s-win');
KrazyAnimations.celebrationDance(winElement);

// Stop it
KrazyAnimations.stopCelebrationDance(winElement);
```
**Visual:** Element rotates and translates with spring physics

---

### 6. **Bouncing on Landing** ⬇️
**Add bounce effect when character lands**
```javascript
// Apply to any element
const character = document.getElementById('character');
KrazyAnimations.bounceLanding(character);
```
**Visual:** Element squashes down, bounces up with squash/stretch deformation

---

### 7. **Pulsing Stars** ⭐
**Add glowing stars around titles/collectibles**
```html
<!-- Add class in HTML -->
<span class="pulsing-star fast">✨</span>
<span class="pulsing-star">✨</span>
<span class="pulsing-star slow">✨</span>
```
**Visual:** Stars pulse in and out with golden glow, different speeds

---

### 8. **Animated Health Bar** 💚
**Shimmer effect on health bars**
```html
<!-- Already applied to #boss-fill and #prog-fill -->
<!-- To trigger critical state: -->
```
```javascript
KrazyAnimations.healthCritical(true);  // Red pulsing
KrazyAnimations.healthCritical(false); // Normal green shimmer
```
**Visual:** Bar fills with rainbow gradient shimmer, flashes red when critical

---

### 9. **Combo Counter Explosion** 🎆
**Big explosion effect on combo milestones**
```javascript
// Triggers when combo reaches milestone
KrazyAnimations.comboExplosion();
```
**Visual:** Streak counter zooms in, explodes with golden glow and pink aura

---

### 10. **Glowing Aura Effects** 💫
**Add glowing aura to collectibles**
```javascript
// Add glow to power-ups or collectibles
KrazyAnimations.addGlowingAura(element, 'cyan');

// Color options: 'cyan', 'pink', 'green', 'purple', 'gold'
KrazyAnimations.addGlowingAura(collectible, 'gold');
```
**Visual:** Element pulses with colorful glow, grows brighter at peak

---

## 📚 BONUS ANIMATIONS

### Screen Shake (Impact feedback)
```javascript
KrazyAnimations.screenShake();
```

### Pulse Scale (Quick pop effect)
```javascript
KrazyAnimations.pulseScale(element);
```

### Flip In (New element reveal)
```javascript
KrazyAnimations.flipIn(element);
```

### Combo Dot Active
```javascript
KrazyAnimations.comboDotActive(0); // Activate combo dot 0
```

---

## 🎨 INTEGRATION EXAMPLES

### During Gameplay
```javascript
// When player collects a coin
function onCoinCollect(x, y, amount) {
  KrazyAnimations.floatScore(x, y, `+${amount}`, 'gold');
  KrazyAnimations.pulseScale(coinElement);
  Sensory.play('coin'); // Your existing sound
}

// When combo reaches 5
if (combo === 5) {
  KrazyAnimations.comboExplosion();
  KrazyAnimations.screenShake();
}

// When boss health is critical
if (bossHP <= 10) {
  KrazyAnimations.healthCritical(true);
}

// On victory
function onWin() {
  const winScreen = document.getElementById('s-win');
  KrazyAnimations.celebrationDance(winScreen);
  KrazyAnimations.rainbowPulse(document.querySelector('h1'));
}
```

### In HTML
```html
<!-- Add classes directly for always-on animations -->
<div id="power-up" class="glowing-aura cyan">⭐</div>
<div id="title" class="wobble-text">LAST STAND</div>
<span class="pulsing-star fast">✨</span>
```

---

## 🎮 CSS CLASS REFERENCE

Add these classes directly to HTML elements for instant effects:

| Class | Effect |
|-------|--------|
| `wobble-text` | Text wobbles side-to-side |
| `rainbow-pulse` | Text cycles rainbow colors |
| `glowing-aura` | Pulsing glow (add color: cyan/pink/green/purple/gold) |
| `pulsing-star` | Twinkling star (add: fast/slow for speed) |
| `bounce-landing` | Bounce with squash/stretch |
| `celebration-dance` | Wacky dancing rotation |
| `celebration-spin` | Fast spinning celebration |
| `pulse-scale` | Quick pop effect |
| `flip-in` | 3D flip entrance |
| `shake` | Screen shake |

---

## 🚀 PERFORMANCE TIPS

- **Reduced Motion:** Respects `prefers-reduced-motion: reduce` for accessibility
- **Mobile Optimized:** Animations scale down on smaller screens
- **Hardware Accelerated:** Uses `transform` and `opacity` for smooth 60fps
- **Auto Cleanup:** Animations remove classes after completion

---

## 🎯 NEXT STEPS

1. **Test in browser:** Open your game and click buttons (bouncy animation)
2. **Try combo explosion:** Reach a high combo count to see it trigger
3. **Add to your game:** Copy-paste the integration examples above
4. **Customize colors:** Edit CSS variables in `95-krazy-kids-animations.css`

---

## 🎨 COLOR THEME
```css
--krazy-pink: #FF1493
--krazy-cyan: #00FFFF
--krazy-lime: #00FF00
--krazy-purple: #DA70D6
--krazy-orange: #FF8000
--krazy-gold: #FFD700
```

---

**Your game is now KRAZY! 🎉✨🎮**
