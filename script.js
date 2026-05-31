document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Navigation & Header Scroll State
  // ==========================================
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Handle sticky header scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ==========================================
  // 2. Navigation Link Scroll Spy
  // ==========================================
  const sections = document.querySelectorAll('section');
  
  function scrollSpy() {
    const scrollPosition = window.scrollY + 120; // Offset for sticky header

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', scrollSpy);

  // ==========================================
  // 3. Stats Counter Animation (Count-Up)
  // ==========================================
  const statItems = document.querySelectorAll('.stat-item h3');
  
  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const decimals = parseInt(element.getAttribute('data-decimals')) || 0;
    const duration = 1800; // Total count animation duration in ms
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = easedProgress * target;
      
      element.textContent = currentValue.toFixed(decimals) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  // Observer for triggering stats when they enter viewport
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const h3 = entry.target.querySelector('h3');
        if (h3) {
          countUp(h3);
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item').forEach(item => {
    statsObserver.observe(item);
  });


  // ==========================================
  // 4. Canvas Architecture Visualizer (Hero Graphic)
  // ==========================================
  const canvas = document.getElementById('arch-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Scale for high density displays
    function resizeCanvas() {
      const parent = canvas.parentElement;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Nodes representing our architectural layers (coordinates & labels)
    // Structured in a hierarchy: Client -> Gateway -> Services -> MessageBus -> Storage
    const nodes = [
      { id: 'client', x: 0.5, y: 0.15, label: 'L1: Client Edge', type: 'client', active: true, pulseSize: 0, glowColor: 'rgba(222, 232, 114, ' }, // Lime Cream
      { id: 'gateway', x: 0.5, y: 0.35, label: 'L2: API Gateway', type: 'gateway', active: false, pulseSize: 0, glowColor: 'rgba(255, 0, 96, ' }, // Hot Fuchsia
      // Microservices layer
      { id: 'service-a', x: 0.25, y: 0.55, label: 'L3: AuthService', type: 'services', active: false, pulseSize: 0, glowColor: 'rgba(255, 0, 96, ' },
      { id: 'service-b', x: 0.5, y: 0.55, label: 'L3: Core Engine', type: 'services', active: false, pulseSize: 0, glowColor: 'rgba(255, 0, 96, ' },
      { id: 'service-c', x: 0.75, y: 0.55, label: 'L3: BillingService', type: 'services', active: false, pulseSize: 0, glowColor: 'rgba(255, 0, 96, ' },
      // Message Bus
      { id: 'event-bus', x: 0.35, y: 0.75, label: 'L4: Event Broker', type: 'event', active: false, pulseSize: 0, glowColor: 'rgba(222, 232, 114, ' }, // Lime Cream
      { id: 'cache', x: 0.65, y: 0.72, label: 'L3: Shared Cache', type: 'services', active: false, pulseSize: 0, glowColor: 'rgba(183, 173, 153, ' }, // Khaki Beige
      // Storage Layer
      { id: 'database', x: 0.5, y: 0.9, label: 'L5: Write Partition', type: 'db', active: false, pulseSize: 0, glowColor: 'rgba(183, 173, 153, ' } // Khaki Beige
    ];

    // Connections representing packet flows
    const connections = [
      { from: 'client', to: 'gateway', speeds: [1.2, 1.8], packets: [] },
      { from: 'gateway', to: 'service-a', speeds: [1.0, 1.5], packets: [] },
      { from: 'gateway', to: 'service-b', speeds: [0.8, 1.2], packets: [] },
      { from: 'gateway', to: 'service-c', speeds: [1.4, 2.0], packets: [] },
      
      { from: 'service-a', to: 'cache', speeds: [1.5, 2.2], packets: [] },
      { from: 'service-b', to: 'event-bus', speeds: [1.1, 1.6], packets: [] },
      { from: 'service-c', to: 'event-bus', speeds: [1.3, 1.7], packets: [] },
      
      { from: 'service-b', to: 'cache', speeds: [1.8, 2.4], packets: [] },
      
      { from: 'event-bus', to: 'database', speeds: [0.9, 1.3], packets: [] },
      { from: 'cache', to: 'database', speeds: [1.5, 2.5], packets: [] }
    ];

    // Generate random packets traversing connections
    setInterval(() => {
      connections.forEach(conn => {
        // Dynamic packet generation chance based on active state
        if (Math.random() < 0.25) {
          const speed = conn.speeds[0] + Math.random() * (conn.speeds[1] - conn.speeds[0]);
          conn.packets.push({ progress: 0, speed: speed * 0.005 });
        }
      });
    }, 400);

    // Active Layer Highlight State
    let activeLayerType = 'client';

    // Highlight nodes matching current active section layer
    function updateNodeHighlights(layerType) {
      activeLayerType = layerType;
      nodes.forEach(n => {
        n.active = (n.type === layerType);
      });
    }

    // Export trigger so layer switcher can highlight canvas
    window.highlightArchCanvasLayer = updateNodeHighlights;

    // Node hovering tracking
    let hoveredNode = null;
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      let found = null;
      nodes.forEach(n => {
        const nx = n.x * width;
        const ny = n.y * height;
        const distance = Math.sqrt((mouseX - nx) ** 2 + (mouseY - ny) ** 2);
        if (distance < 24) {
          found = n;
        }
      });

      if (found !== hoveredNode) {
        hoveredNode = found;
        if (hoveredNode) {
          // Highlight equivalent UI block in About section
          const targetBlock = document.querySelector(`.arch-layer[data-layer="${hoveredNode.type}"]`);
          if (targetBlock) {
            document.querySelectorAll('.arch-layer').forEach(b => b.classList.remove('active'));
            targetBlock.classList.add('active');
            activeLayerType = hoveredNode.type;
            nodes.forEach(n => n.active = (n.type === hoveredNode.type));
          }
        }
      }
    });

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Connections (Lines)
      ctx.lineWidth = 1.5;
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const x1 = fromNode.x * width;
        const y1 = fromNode.y * height;
        const x2 = toNode.x * width;
        const y2 = toNode.y * height;

        // Visual highlight line if nodes connected are active
        const isActiveLine = fromNode.active || toNode.active;
        ctx.strokeStyle = isActiveLine ? 'rgba(255, 0, 96, 0.4)' : 'rgba(183, 173, 153, 0.2)'; // Fuchsia active connection line, Khaki Beige inactive line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw flowing packets along paths
        conn.packets.forEach((packet, idx) => {
          packet.progress += packet.speed;
          if (packet.progress >= 1) {
            conn.packets.splice(idx, 1);
            return;
          }

          const px = x1 + (x2 - x1) * packet.progress;
          const py = y1 + (y2 - y1) * packet.progress;

          ctx.fillStyle = isActiveLine ? '#DEE872' : 'rgba(255, 0, 96, 0.8)'; // active Lime Cream packet, inactive Fuchsia packet
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#DEE872';
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        });
      });

      // 2. Draw Nodes
      nodes.forEach(n => {
        const nx = n.x * width;
        const ny = n.y * height;

        // Interactive pulsing glow effect
        if (n.active) {
          n.pulseSize += 0.05;
          const alpha = Math.max(0, 0.3 - Math.sin(n.pulseSize) * 0.1);
          ctx.fillStyle = n.glowColor + alpha + ')';
          ctx.beginPath();
          ctx.arc(nx, ny, 16 + Math.sin(n.pulseSize) * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Outer Border
        ctx.strokeStyle = n.active ? '#FF0060' : 'rgba(183, 173, 153, 0.4)'; // active Hot Fuchsia node border
        ctx.lineWidth = n.active ? 2 : 1;
        ctx.fillStyle = n.active ? 'rgba(255, 0, 96, 0.1)' : 'rgba(245, 242, 233, 0.85)'; // active Fuchsia background, inactive light warm beige background
        
        ctx.beginPath();
        ctx.arc(nx, ny, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node Inner Dot
        ctx.fillStyle = n.active ? '#FF0060' : '#B7AD99'; // active Hot Fuchsia, inactive Khaki Beige inner dot
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw Labels
        ctx.fillStyle = n.active ? '#030301' : 'rgba(3, 3, 1, 0.6)'; // black labels for high contrast in light mode
        ctx.font = n.active ? 'bold 10px Space Grotesk' : '9px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, nx, ny - 16);
      });

      requestAnimationFrame(animate);
    }
    
    // Start canvas animation
    animate();
  }

  // ==========================================
  // 5. Interactive Layer Switcher (Biz Kimiz)
  // ==========================================
  const layers = document.querySelectorAll('.arch-layer');
  
  layers.forEach(layer => {
    layer.addEventListener('click', () => {
      // Clear active states
      layers.forEach(l => l.classList.remove('active'));
      
      // Activate clicked layer
      layer.classList.add('active');
      
      // Update canvas focus layer if canvas loaded
      const layerType = layer.getAttribute('data-layer');
      if (window.highlightArchCanvasLayer) {
        window.highlightArchCanvasLayer(layerType);
      }
    });
  });


  // ==========================================
  // 6. Projects Filtering System
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear active state of filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Activate clicked button
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      // First step: Fade out all cards smoothly to prevent abrupt layout shifts
      projectCards.forEach(card => {
        card.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      });

      // Second step: After fade-out completes, update display states and fade matching cards back in
      setTimeout(() => {
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        // Force a layout reflow so the browser registers the display changes
        void document.body.offsetHeight;

        // Third step: Fade in matching cards with a smooth, premium ease-out transition
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            card.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }
        });
      }, 500);
    });
  });



  // ==========================================
  // 7. Secure Contact Form Handling & Validation
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');
  const submitBtn = document.getElementById('submit-btn');

  // Input Sanitizer to strip basic HTML script elements
  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }

  // Quick email validation utility
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset response field state
    formResponse.style.display = 'none';
    formResponse.className = 'form-response';
    formResponse.replaceChildren();

    // Get input elements safely
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectSelect = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Retrieve and sanitize values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectSelect.value;
    const message = messageInput.value.trim();

    // 1. Client-side field validations
    if (!name || name.length < 3) {
      showResponse('Lütfen adınızı ve soyadınızı eksiksiz girin (En az 3 karakter).', 'error');
      nameInput.focus();
      return;
    }

    if (!email || !validateEmail(email)) {
      showResponse('Lütfen geçerli bir e-posta adresi yazın.', 'error');
      emailInput.focus();
      return;
    }

    if (!subject) {
      showResponse('Lütfen projenizin ilgilendirdiği bir talep türü seçin.', 'error');
      subjectSelect.focus();
      return;
    }

    if (!message || message.length < 15) {
      showResponse('Lütfen projenizin detaylarını en az 15 karakterle açıklayın.', 'error');
      messageInput.focus();
      return;
    }

    // 2. Send form data to Cloudflare Worker
    submitBtn.disabled = true;
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.textContent = 'İstek Gönderiliyor...';

    fetch('https://api.syprise.com/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, subject, message })
    })
    .then(async (response) => {
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'İstek gönderilirken bir hata oluştu.');
      }

      // Reset form controls
      contactForm.reset();
      
      // Trigger floating label repositioning manually
      document.querySelectorAll('.form-input').forEach(input => {
        input.dispatchEvent(new Event('blur'));
      });

      // Show success callback safely (escape input inside presentation payload)
      const safeName = sanitizeInput(name);
      showResponse(`Teşekkürler Sayın ${safeName}, mimari analiz talebiniz başarıyla iletildi. En kısa sürede dönüş yapacağız.`, 'success');
    })
    .catch((error) => {
      showResponse(`Hata: ${error.message}`, 'error');
    })
    .finally(() => {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    });
  });

  // Display form status message helper using textContent for XSS prevention
  function showResponse(messageText, statusType) {
    formResponse.replaceChildren(); // clear old elements
    formResponse.textContent = messageText;
    formResponse.classList.add(statusType);
    formResponse.style.display = 'block';
  }

  // ==========================================
  // 8. Custom Dropdown / Combobox Handling
  // ==========================================
  const dropdownInput = document.getElementById('subject');
  const dropdownMenu = document.getElementById('subject-dropdown');
  const dropdownContainer = dropdownInput.parentElement;
  const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

  dropdownInput.addEventListener('focus', () => {
    dropdownMenu.style.display = 'block';
    dropdownContainer.classList.add('open');
    filterDropdownItems();
  });

  dropdownInput.addEventListener('input', () => {
    dropdownMenu.style.display = 'block';
    dropdownContainer.classList.add('open');
    filterDropdownItems();
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!dropdownContainer.contains(e.target)) {
      dropdownMenu.style.display = 'none';
      dropdownContainer.classList.remove('open');
    }
  });

  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      dropdownInput.value = item.textContent;
      dropdownMenu.style.display = 'none';
      dropdownContainer.classList.remove('open');
      // Dispatch input event to update label floating state
      dropdownInput.dispatchEvent(new Event('input'));
    });
  });

  function filterDropdownItems() {
    const val = dropdownInput.value.toLowerCase().trim();
    dropdownItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(val)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

});
