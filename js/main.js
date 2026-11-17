/**
 * ATELIER NOIR - LÜKS SİYAH BEYAZ ERKEK KUAFÖRÜ & BERBER ATÖLYESİ
 * İnteraktif Mantık ve Rezervasyon Sistemi
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initHeader();
  initLiveStatus();
  initServicesFilter();
  initBeforeAfterSlider();
  initBookingWizard();
  initGalleryLightbox();
  initFaqAccordion();
  initStatCounters();
});

/* -------------------------------------------------------------------------- */
/* 1. HERO SLIDER                                                             */
/* -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5500);
}

/* -------------------------------------------------------------------------- */
/* 2. HEADER & MOBİL MENÜ                                                     */
/* -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.header');
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      burgerBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', false);
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 3. CANLI ÇALIŞMA SAATİ DURUMU (Şu an Açık / Kapalı)                         */
/* -------------------------------------------------------------------------- */
function initLiveStatus() {
  const dot = document.getElementById('liveDot');
  const text = document.getElementById('liveStatusText');
  if (!dot || !text) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeDecimal = hour + minute / 60;

  // Pazartesi - Cumartesi: 09:00 - 21:00 arası açık
  const isSunday = (day === 0);
  const isOpenHours = (timeDecimal >= 9 && timeDecimal < 21);

  if (!isSunday && isOpenHours) {
    dot.classList.remove('closed');
    text.textContent = 'Şu an Açığız (21:00\'e kadar)';
  } else {
    dot.classList.add('closed');
    if (isSunday) {
      text.textContent = 'Pazar Günleri Kapalıyız (Yarın 09:00\'da Açık)';
    } else if (timeDecimal < 9) {
      text.textContent = 'Şu an Kapalıyız (Bugün 09:00\'da Açılacak)';
    } else {
      text.textContent = 'Şu an Kapalıyız (Yarın 09:00\'da Açılacak)';
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 4. HİZMETLER FİLTRESİ VE HIZLI SEÇİM                                        */
/* -------------------------------------------------------------------------- */
function initServicesFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // "Bu Hizmeti Seç" butonları randevu sihirbazına yönlendirir
  document.querySelectorAll('.service-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');

      // Randevu formuna kaydır
      const bookingSection = document.getElementById('randevu');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Randevu sihirbazındaki kartı otomatik seç
      setTimeout(() => {
        const matchingCard = document.querySelector(`.select-card[data-service-name="${serviceName}"]`);
        if (matchingCard) {
          matchingCard.click();
        }
      }, 400);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 5. İNTERAKTİF ÖNCESİ / SONRASI SLIDER                                        */
/* -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.getElementById('baContainer');
  const overlay = document.getElementById('baOverlay');
  const handle = document.getElementById('baHandle');
  if (!container || !overlay || !handle) return;

  let isDragging = false;

  const updatePosition = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updatePosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  // Dokunmatik cihazlar için
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 6. İNTERAKTİF RANDEVU SİHİRBAZI                                             */
/* -------------------------------------------------------------------------- */
function initBookingWizard() {
  const state = {
    service: 'Kişiye Özel Saç Kesimi',
    duration: '45 Dk',
    price: '650 ₺',
    barber: 'Kadir Usta (Baş Berber)',
    date: '',
    time: '14:00',
    name: '',
    phone: '',
    note: ''
  };

  let currentStep = 1;
  const totalSteps = 4;

  const stepElements = {
    1: document.getElementById('step1'),
    2: document.getElementById('step2'),
    3: document.getElementById('step3'),
    4: document.getElementById('step4')
  };

  const indicators = document.querySelectorAll('.step-indicator');
  const btnPrev = document.getElementById('bookingPrevBtn');
  const btnNext = document.getElementById('bookingNextBtn');

  // Özet Elemanları
  const sumService = document.getElementById('sumService');
  const sumBarber = document.getElementById('sumBarber');
  const sumDateTime = document.getElementById('sumDateTime');
  const sumPrice = document.getElementById('sumPrice');

  function updateSummaryDisplay() {
    if (sumService) sumService.textContent = state.service || 'Seçilmedi';
    if (sumBarber) sumBarber.textContent = state.barber || 'Fark etmez';
    if (sumDateTime) {
      if (state.date && state.time) {
        sumDateTime.textContent = `${state.date} • ${state.time}`;
      } else if (state.time) {
        sumDateTime.textContent = `Saat: ${state.time}`;
      } else {
        sumDateTime.textContent = 'Tarih seçilmedi';
      }
    }
    if (sumPrice) sumPrice.textContent = state.price || '0 ₺';
  }

  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;

    // Adım panellerini güncelle
    Object.keys(stepElements).forEach(s => {
      const el = stepElements[s];
      if (el) {
        if (parseInt(s) === currentStep) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      }
    });

    // Göstergeleri güncelle
    indicators.forEach(ind => {
      const indStep = parseInt(ind.getAttribute('data-step'));
      ind.classList.remove('active', 'completed');
      if (indStep === currentStep) {
        ind.classList.add('active');
      } else if (indStep < currentStep) {
        ind.classList.add('completed');
      }
    });

    // Buton metinleri
    if (btnPrev) {
      btnPrev.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    }
    if (btnNext) {
      btnNext.textContent = currentStep === totalSteps ? 'Randevuyu Onayla' : 'Devam Et →';
    }

    updateSummaryDisplay();
  }

  // Hizmet Seçimi
  const serviceCards = document.querySelectorAll('#step1 .select-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      state.service = card.getAttribute('data-service-name');
      state.duration = card.getAttribute('data-duration');
      state.price = card.getAttribute('data-price');
      updateSummaryDisplay();
    });
  });

  // Berber Seçimi
  const barberCards = document.querySelectorAll('#step2 .select-card');
  barberCards.forEach(card => {
    card.addEventListener('click', () => {
      barberCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      state.barber = card.getAttribute('data-barber-name');
      updateSummaryDisplay();
    });
  });

  // Tarih Girişi
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    state.date = today;

    dateInput.addEventListener('change', (e) => {
      state.date = e.target.value;
      updateSummaryDisplay();
    });
  }

  // Saat Dilimi Seçimi
  const timeSlots = document.querySelectorAll('.time-slot');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      if (slot.classList.contains('disabled')) return;
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');

      state.time = slot.textContent.trim();
      updateSummaryDisplay();
    });
  });

  // İleri / Geri Butonları
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      } else {
        // Formu tamamla
        const nameInput = document.getElementById('clientName');
        const phoneInput = document.getElementById('clientPhone');
        const noteInput = document.getElementById('clientNote');

        if (!nameInput.value.trim() || !phoneInput.value.trim()) {
          alert('Lütfen adınızı ve telefon numaranızı giriniz.');
          return;
        }

        state.name = nameInput.value.trim();
        state.phone = phoneInput.value.trim();
        state.note = noteInput ? noteInput.value.trim() : '';

        showReceiptModal(state);
      }
    });
  }

  goToStep(1);
}

/* -------------------------------------------------------------------------- */
/* 7. RANDEVU ONAYI VE WHATSAPP ENTEGRASYONU                                   */
/* -------------------------------------------------------------------------- */
function showReceiptModal(data) {
  const modal = document.getElementById('receiptModal');
  if (!modal) return;

  const refCode = 'NOIR-' + Math.floor(100000 + Math.random() * 900000);

  document.getElementById('receiptRef').textContent = refCode;
  document.getElementById('receiptClient').textContent = data.name;
  document.getElementById('receiptPhone').textContent = data.phone;
  document.getElementById('receiptService').textContent = data.service;
  document.getElementById('receiptBarber').textContent = data.barber;
  document.getElementById('receiptDateTime').textContent = `${data.date} saat ${data.time}`;
  document.getElementById('receiptPrice').textContent = data.price;

  // WhatsApp Mesajı Oluştur
  const waBtn = document.getElementById('receiptWaBtn');
  if (waBtn) {
    const rawMsg = `Merhaba, Atelier Noir web sitenizden randevu oluşturdum:\n\n` +
      `📌 *Referans No:* ${refCode}\n` +
      `👤 *Müşteri:* ${data.name}\n` +
      `📞 *Telefon:* ${data.phone}\n` +
      `✂️ *Hizmet:* ${data.service} (${data.price})\n` +
      `💈 *Usta:* ${data.barber}\n` +
      `📅 *Tarih & Saat:* ${data.date} - ${data.time}\n` +
      (data.note ? `📝 *Not:* ${data.note}\n\n` : `\n`) +
      `Randevumu onaylamanızı rica ederim.`;

    const encodedMsg = encodeURIComponent(rawMsg);
    waBtn.href = `https://wa.me/905549443230?text=${encodedMsg}`;
  }

  modal.classList.add('active');

  const closeBtn = document.getElementById('receiptCloseBtn');
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove('active');
  }
}

/* -------------------------------------------------------------------------- */
/* 8. GALERİ LIGHTBOX                                                         */
/* -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImg) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      }
    });
  });

  const close = () => lightbox.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      close();
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 9. SIK SORULAN SORULAR AKORDİYONU                                          */
/* -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 10. SAYISAL İSTATİSTİK SAYAÇLARI                                           */
/* -------------------------------------------------------------------------- */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        stats.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 2000;
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = target.toLocaleString('tr-TR') + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(count).toLocaleString('tr-TR') + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statSection = document.querySelector('.why-section');
  if (statSection) {
    observer.observe(statSection);
  }
}
