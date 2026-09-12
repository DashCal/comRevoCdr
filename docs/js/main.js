/* ============================================
   Revocoder — Main Script
   纯原生 JS，零依赖
   ============================================ */

(function () {
  'use strict';

  /* ── DOM Ready ──────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavScroll();
    initMobileMenu();
    initSmoothScroll();
    initRevealOnScroll();
    initLucideIcons();
    initHeroBubbles();
  }

  /* ── Navigation: Scroll Background ─────── */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 40) {
            nav.classList.add('is-scrolled');
          } else {
            nav.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初始状态
  }

  /* ── Mobile Menu Toggle ─────────────────── */
  function initMobileMenu() {
    const btn = document.querySelector('.nav__menu-btn');
    const menu = document.querySelector('.nav__mobile-menu');
    if (!btn || !menu) return;

    let isOpen = false;

    btn.addEventListener('click', function () {
      isOpen = !isOpen;
      menu.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // 切换图标
      const icon = btn.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        if (window.lucide) window.lucide.createIcons();
      }
    });

    // 点击菜单链接后自动关闭
    menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        isOpen = false;
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const icon = btn.querySelector('[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  /* ── Smooth Scroll for Anchor Links ─────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = document.querySelector('.nav')
          ? document.querySelector('.nav').offsetHeight
          : 0;

        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }

  /* ── Scroll Reveal (Intersection Observer) ─ */
  function initRevealOnScroll() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      // 降级：直接显示
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Lucide Icons Initialization ────────── */
  function initLucideIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ── Hero 语音气泡轮播 ──────────────────── */
  function initHeroBubbles() {
    var container = document.getElementById('heroBubbles');
    if (!container) return;

    var messages = [
      '进一步制定具体的实施计划和细节',
      '帮我写一个 Python 脚本',
      '总结一下今天的会议内容',
      '打开客厅的灯',
      '播放我喜欢的音乐',
      '帮我整理一下桌面文件',
      '翻译这段英文',
      '写一封邮件给客户',
      '查询明天的天气',
      '设置一个明天早上八点的闹钟'
    ];

    var bubbles = [];
    var maxBubbles = 2;
    var currentIndex = 0;
    var bubbleSpacing = 55;
    var baseBottom = 35;

    function showBubble() {
      // 1. 所有现有气泡上移
      for (var i = 0; i < bubbles.length; i++) {
        var current = parseInt(bubbles[i].style.bottom) || 0;
        bubbles[i].style.bottom = (current + bubbleSpacing) + 'px';
      }

      // 2. 如果已达上限，移除最旧的（现在在最高位置）
      if (bubbles.length >= maxBubbles) {
        var oldest = bubbles.shift();
        oldest.classList.remove('is-visible');
        oldest.classList.add('is-fading');
        setTimeout(function () {
          if (oldest.parentNode) oldest.remove();
        }, 300);
      }

      // 3. 创建新气泡，初始在遥控器背后
      var bubble = document.createElement('div');
      bubble.className = 'hero__bubble';
      bubble.textContent = messages[currentIndex];
      bubble.style.bottom = '0px';
      container.appendChild(bubble);
      bubbles.push(bubble);

      // 4. 触发入场动画：从遥控器背后滑出到最终位置
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          bubble.classList.add('is-visible');
          bubble.style.bottom = baseBottom + 'px';
        });
      });

      currentIndex = (currentIndex + 1) % messages.length;
    }

    // 首条延迟
    setTimeout(showBubble, 800);

    // 后续循环
    function scheduleNext() {
      var delay = 2500 + Math.floor(Math.random() * 1000);
      setTimeout(function () {
        showBubble();
        scheduleNext();
      }, delay);
    }
    scheduleNext();
  }
})();
