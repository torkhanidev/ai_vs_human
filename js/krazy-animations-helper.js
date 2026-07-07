/* ═══════════════════════════════════════════════════════════════════════════════
   KRAZY ANIMATIONS HELPER - Integration with game.js
   Usage: Call these functions to trigger krazy animations during gameplay
   ═══════════════════════════════════════════════════════════════════════════════ */

const KrazyAnimations = {
  
  /**
   * Create floating score numbers that float up and disappear
   * Usage: KrazyAnimations.floatScore(x, y, '+100', 'gold')
   */
  floatScore(x, y, text, color = 'gold') {
    const score = document.createElement('div');
    score.className = `float-score ${color}`;
    score.textContent = text;
    score.style.left = x + 'px';
    score.style.top = y + 'px';
    document.body.appendChild(score);
    
    setTimeout(() => score.remove(), 2000);
  },

  /**
   * Add bouncy button animation to clicked elements
   * Usage: KrazyAnimations.addBouncyButtons()
   */
  addBouncyButtons() {
    document.querySelectorAll('.btn, .shop-action, .content-btn, button').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.style.animation = 'none';
        setTimeout(() => {
          btn.style.animation = '';
        }, 10);
      });
    });
  },

  /**
   * Trigger combo explosion animation
   * Usage: KrazyAnimations.comboExplosion()
   */
  comboExplosion() {
    const streakVal = document.getElementById('streak-val');
    if (streakVal) {
      streakVal.classList.remove('combo-explosion');
      void streakVal.offsetWidth; // Trigger reflow
      streakVal.classList.add('combo-explosion');
      setTimeout(() => streakVal.classList.remove('combo-explosion'), 600);
    }
  },

  /**
   * Add landing bounce to character/element
   * Usage: KrazyAnimations.bounceLanding(element)
   */
  bounceLanding(element) {
    element.classList.add('bounce-landing');
    element.addEventListener('animationend', function removeAnimation() {
      element.classList.remove('bounce-landing');
      element.removeEventListener('animationend', removeAnimation);
    }, { once: true });
  },

  /**
   * Screen shake effect
   * Usage: KrazyAnimations.screenShake()
   */
  screenShake() {
    const hud = document.getElementById('hud');
    if (hud) {
      hud.classList.add('shake');
      setTimeout(() => hud.classList.remove('shake'), 300);
    }
  },

  /**
   * Celebrate victory with dance animation
   * Usage: KrazyAnimations.celebrationDance(element)
   */
  celebrationDance(element) {
    element.classList.add('celebration-dance');
  },

  /**
   * Stop celebration dance
   */
  stopCelebrationDance(element) {
    element.classList.remove('celebration-dance');
  },

  /**
   * Add rainbow pulse to element
   * Usage: KrazyAnimations.rainbowPulse(element)
   */
  rainbowPulse(element) {
    element.classList.add('rainbow-pulse');
  },

  /**
   * Add glowing aura to collectible items
   * Usage: KrazyAnimations.addGlowingAura(element, 'cyan')
   */
  addGlowingAura(element, color = 'cyan') {
    element.classList.add('glowing-aura', color);
  },

  /**
   * Health bar critical state
   * Usage: KrazyAnimations.healthCritical(true/false)
   */
  healthCritical(isCritical) {
    const fill = document.getElementById('boss-fill');
    if (fill) {
      if (isCritical) {
        fill.classList.add('critical');
      } else {
        fill.classList.remove('critical');
      }
    }
  },

  /**
   * Pulse scale animation (quick pop effect)
   * Usage: KrazyAnimations.pulseScale(element)
   */
  pulseScale(element) {
    element.classList.add('pulse-scale');
    element.addEventListener('animationend', function remove() {
      element.classList.remove('pulse-scale');
      element.removeEventListener('animationend', remove);
    }, { once: true });
  },

  /**
   * Flip-in animation for new elements
   * Usage: KrazyAnimations.flipIn(element)
   */
  flipIn(element) {
    element.classList.add('flip-in');
  },

  /**
   * Make text wobble (attention grab)
   * Usage: KrazyAnimations.wobbleText(element)
   */
  wobbleText(element) {
    element.classList.add('wobble-text');
  },

  /**
   * Apply combo dot animation
   * Usage: KrazyAnimations.comboDotActive(index)
   */
  comboDotActive(index) {
    const dot = document.getElementById(`cd${index}`);
    if (dot) {
      dot.classList.add('active');
      setTimeout(() => dot.classList.remove('active'), 400);
    }
  }
};

// Integrate with game.js - Call this after game initializes
window.initKrazyAnimations = function() {
  KrazyAnimations.addBouncyButtons();
  console.log('✨ Krazy Animations initialized!');
};

// Make it globally accessible
window.KrazyAnimations = KrazyAnimations;
